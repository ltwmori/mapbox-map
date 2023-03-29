import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import config from "./config";


function fetchJSON(url) {
  return fetch(url).then(function (response) {
    return response.json();
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

  console.log("Map:", map);
  var content = fetchJSON("../mappy.geojson").then(function (content) {
    return content;
  });

  map.on("load", () => {
    console.log("Map loaded.");

    map.addSource("polygons", {
      type: "geojson",
      data: content,
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
    const feature = e.features[0];
    const popup = new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(
        `<strong>${feature.properties.name}</strong><br>${feature.properties.description}`
      )
      .addTo(map);
  });
}

//   const map = new mapboxgl.Map({
//     container: "map", // container ID
//     // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
//     style: "mapbox://styles/mapbox/streets-v12", // style URL
//     center: [60.794187970925776, 48.85571554964046], // starting position
//     // center: config.center,
//     zoom: 12,
//     hash: true,
//     attributionControl: false,
//   });

//   map.addControl(new mapboxgl.NavigationControl(), "top-right");
//   map.addControl(
//     new mapboxgl.GeolocateControl({
//       positionOptions: { enableHighAccuracy: true },
//       trackUserLocation: true,
//     }),
//     "top-right"
//   );
//   map.addControl(new MapboxPitchToggleControl({ minpitchzoom: 19 }));
//   MapboxStyleSwitcherControl.DEFAULT_STYLE = config.styles[0].title;
//   map.addControl(new MapboxStyleSwitcherControl(config.styles), "top-right");
//   map.addControl(
//     new MapboxAreaSwitcherControl(config.areaSwitcher.areas),
//     "top-right"
//   );
//   if (config.elevation) {
//     map.addControl(
//       new MapboxElevationControl(
//         config.elevation.url,
//         config.elevation.options
//       ),
//       "top-right"
//     );
//   }
//   map.addControl(
//     new MapboxExportControl({ Crosshair: true, PrintableArea: true }),
//     "top-right"
//   );
//   if (config.valhalla) {
//     map.addControl(
//       new MapboxValhallaControl(config.valhalla.url, config.valhalla.options),
//       "top-right"
//     );
//   }
//   map.addControl(
//     new mapboxgl.ScaleControl({ maxWidth: 80, unit: "metric" }),
//     "bottom-left"
//   );
//   map.addControl(
//     new mapboxgl.AttributionControl({
//       compact: true,
//       customAttribution: config.attribution,
//     }),
//     "bottom-right"
//   );
//   if (config.popup) map.addControl(new MapboxPopupControl(config.popup.target));

//   if (config.legend) {
//     const legendCtrl = new MapboxLegendControl(
//       config.legend.targets,
//       config.legend.options
//     );
//     map.addControl(legendCtrl, "bottom-left");
//   }

//   map.on("load", () => {
//     map.addSource("polygons", {
//       type: "geojson",
//       data: "../data.geojson", // Replace with the path to your GeoJSON file
//     });

//     // Add a layer to the map to display the polygons
//     map.addLayer({
//       id: "polygons-layer",
//       type: "fill",
//       source: "polygons",
//       paint: {
//         "fill-color": "#FF0000",
//         "fill-opacity": 0.5,
//       },
//     });
//   });
//   map.on("click", "polygons-layer", (e) => {
//     const feature = e.features[0];
//     const popup = new mapboxgl.Popup()
//       .setLngLat(e.lngLat)
//       .setHTML(
//         `<strong>${feature.properties.name}</strong><br>${feature.properties.description}`
//       )
//       .addTo(map);
//   });
// })();
