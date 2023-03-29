const http = require("http");
const https = require("https");
const fs = require("fs");

const options = {
  rejectUnauthorized: false,
};

const kad_numbers = [
  "030550041309",
  "030550041337",
  "030550041056",
  "030550041062",
  "030550041064",
  "030550041247",
  "030550041338",
  "030550041339",
  "030550041248",
  "030550041249",
  "030550041375",
  "030550041251",
  "030550041252",
  "030550041320",
  "030550041319",
  "030550041256",
  "030550041257",
  "030550041258",
  "030550041295",
  "030550041260",
  "030550041296",
  "030550041313",
  "030550041315",
  "030550041318",
  "030550041316",
  "030550041303",
  "030550041311",
  "030550041314",
  "030550041317",
  "030550041308",
  "030550041307",
  "030550041306",
  "030550041305",
  "030550041304",
  "030550041312",
  "030550041310",
];

async function getCoordinates() {
  try {
    for (let i = 0; i < kad_numbers.length; i++) {
      const kad_number = kad_numbers[i];
      const url = `https://aisgzk.kz/aisgzk/Proxy/aisgzkZem2/MapServer/find?f=json&searchText=${kad_number}&contains=true&returnGeometry=true&layers=59&searchFields=KAD_NOMER&sr=3857&returnM=true&transformForward=true&wkid=1241`;
      const response = await httpRequest(url);
      const responseData = JSON.parse(response);

      // convert to normal coordinates
      if (responseData.results && responseData.results.length > 0) {
        const ringsData = responseData.results[0].geometry.rings;
        const rings = ringsData.map((ring) => {
          return ring.map((coord) => {
            return coord3857To4326(coord);
          });
        });
        // console.log(i, " ", rings);

        // convert to geol-json
        const stream = fs.createWriteStream("data.geojson", { flags: "a" });
        const geojson = {
          type: "FeatureCollection",
          features: [],
        };
        rings.forEach((polygon) => {
          const feature = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [[]],
            },
            properties: {},
          };
          polygon.forEach((point) => {
            feature.geometry.coordinates[0].push([point.lng, point.lat]);
          });
          geojson.features.push(feature);
          stream.write(JSON.stringify(feature) + "\n"); // Write feature to file
          // map.getSource(i).setData(geojson);
        });
        console.log(JSON.stringify(geojson));
        // fs.writeFile("data.geojson", JSON.stringify(geojson), (err) => {
        //   if (err) throw err;
        //   console.log("GeoJSON data saved to file.");
        // });
        stream.end(); // Close the stream
        console.log("GeoJSON data saved to file.");
      } else {
        console.log("No results found for this kad_number:", kad_number);
      }
    }
  } catch (error) {
    console.error(`Error fetching coordinates: ${error}`);
  }
}

function httpRequest(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, options, (response) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(
            new Error(
              `Failed to load page, status code: ${response.statusCode}`
            )
          );
        }
        const body = [];
        response.on("data", (chunk) => body.push(chunk));
        response.on("end", () => resolve(body.join("")));
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function coord3857To4326(coord) {
  const e_value = 2.7182818284;
  const X = 20037508.34;
  const lat3857 = coord[0];
  const long3857 = coord[1];
  //converting the longitute from epsg 3857 to 4326
  const long4326 = (long3857 * 180) / X;
  //converting the latitude from epsg 3857 to 4326 split in multiple lines for readability
  let lat4326 = lat3857 / (X / 180);
  const exponent = (Math.PI / 180) * lat4326;
  lat4326 = Math.atan(Math.pow(e_value, exponent));
  lat4326 = lat4326 / (Math.PI / 360); // Here is the fixed line
  lat4326 = lat4326 - 90;
  return { lat: lat4326, lng: long4326 };
}

getCoordinates();
