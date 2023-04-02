import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import config from "./config";
import { geojson } from "../data";


console.log("Access token:", config.accessToken);

// const url = `https://aisgzk.kz/aisgzk/Index/FindObjInfoForMap?kadNum=${kadNum}`;


function postRequest(url, data) {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(url, options, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(
          new Error(`Failed to load page, status code: ${response.statusCode}`)
        );
      }
      const body = [];
      response.on("data", (chunk) => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

mapboxgl.accessToken = config.accessToken;
const mapContainer = document.getElementById("map");

if (!mapContainer) {
  console.error("No map container found.");
} else {
  console.log("Map container:", mapContainer);

  const map = new mapboxgl.Map({
    container: mapContainer,
    style: "mapbox://styles/mapbox/streets-v12",
    center: [77.0612390421626, 43.82639521539019],
    zoom: 12,
  });

  map.addControl(new mapboxgl.NavigationControl(), "top-right");
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }),
    "top-right"
  );
  map.on("load", () => {
    console.log("Map loaded.");
    

    map.addSource("polygons", {
      type: "geojson",
      data: geojson,
    });
    map.addLayer({
      id: "polygons-layer",
      type: "fill",
      source: "polygons",
      paint: {
        "fill-color": "#FF0000",
        "fill-opacity": 0.5,
      },
    });
    console.log("added layer");
  });

  map.on("click", "polygons-layer", (e) => {
    try {
      
      const feature = e.features[0];
      const parsedInfo = JSON.parse(feature.properties.info);

      function generatePopupContent(parsedValue) {
        let html = '<div style="background-color: #fff; padding: 0 10px">';
      
        parsedValue.forEach((item) => {
          html += `
            <div>
              <p style="font-weight: bold; margin-bottom: 0;">${item.Key}:</p>
              <p style="margin: 0;">${item.Name.Kz || "Нет данных"}</p>
            </div>
          `;
        });
      
        html += '</div>';
      
        return html;
      }
  
      const popup = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(generatePopupContent(parsedInfo))
        .addTo(map);
    } catch (error) {
      console.error("Error handling click event:", error);
    }
  });
}
