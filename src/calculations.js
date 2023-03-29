import fetch from "node-fetch";
// 'use strict';
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();


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

// async function getCoordinates() {
//   try {
//     for (let i = 0; i < kad_numbers.length; i++) {
//       const kad_number = kad_numbers[i];
//       const url = `https://aisgzk.kz/aisgzk/Proxy/aisgzkZem2/MapServer/find?f=json&searchText=${kad_number}&contains=true&returnGeometry=true&layers=59&searchFields=KAD_NOMER&sr=3857&returnM=true&transformForward=true&wkid=1241`;
//       const response = await fetch(url);
//       const data = await response.json();
//       if (data.results && data.results.length > 0 && data.results[0].geometry && data.results[0].geometry.rings) {
//         console.log(data.results[0].geometry.rings);
//         for (let j = 0; j < data.results[0].geometry.rings.length; j++) {
//           const coord = data.results[0].geometry.rings[j];
//           const coord4326 = coord3857To4326(coord);
//           console.log(coord4326);
//         }
//       } else {
//         console.log(`No geometry data found for kad_number ${kad_number}`);
//       }
//     }
//   } catch (error) {
//     console.error(`Error fetching coordinates: ${error}`);
//   }
// }


function getCoordinates() {
  for (let i = 0; i < kad_numbers.length; i++) {
    const kad_number = kad_numbers[i];
    const url = `https://aisgzk.kz/aisgzk/Proxy/aisgzkZem2/MapServer/find?f=json&searchText=${kad_number}&contains=true&returnGeometry=true&layers=59&searchFields=KAD_NOMER&sr=3857&returnM=true&transformForward=true&wkid=1241`;
     fetch(url).then((res) => {
         console.log(res);
     }).catch((err) => {
         console.log(err);
     })
      
  }
}


function coord3857To4326(coords) {
  const convertedCoords = coords.map(coord => {
    const e_value = 2.7182818284;
    const X = 20037508.34;
    const lat3857 = coord[0];
    const long3857 = coord[1];
    // Converting the longitude from epsg 3857 to 4326
    const long4326 = (long3857 * 180) / X;
    // Converting the latitude from epsg 3857 to 4326 split in multiple lines for readability
    let lat4326 = lat3857 / (X / 180);
    const exponent = (Math.PI / 180) * lat4326;
    lat4326 = Math.atan(Math.pow(e_value, exponent));
    lat4326 = lat4326 / (Math.PI / 360); // Here is the fixed line
    lat4326 = lat4326 - 90;
    return { lat: lat4326, lng: long4326 };
  });
  return convertedCoords;
}

getCoordinates();