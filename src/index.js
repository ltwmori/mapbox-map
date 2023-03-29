import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import config from "./config";

(() => {
  mapboxgl.accessToken = config.accessToken;
  const map = new mapboxgl.Map({
    container: "map", // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: "mapbox://styles/mapbox/light-v11", // style URL
    center: [60.794187970925776, 48.85571554964046], // starting position
    // center: config.center,
    zoom: config.zoom,
    hash: true,
    attributionControl: false,
  });

  map.addControl(new mapboxgl.NavigationControl(), "top-right");
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }),
    "top-right"
  );
  map.addControl(new MapboxPitchToggleControl({ minpitchzoom: 19 }));
  MapboxStyleSwitcherControl.DEFAULT_STYLE = config.styles[0].title;
  map.addControl(new MapboxStyleSwitcherControl(config.styles), "top-right");
  map.addControl(
    new MapboxAreaSwitcherControl(config.areaSwitcher.areas),
    "top-right"
  );
  if (config.elevation) {
    map.addControl(
      new MapboxElevationControl(
        config.elevation.url,
        config.elevation.options
      ),
      "top-right"
    );
  }
  map.addControl(
    new MapboxExportControl({ Crosshair: true, PrintableArea: true }),
    "top-right"
  );
  if (config.valhalla) {
    map.addControl(
      new MapboxValhallaControl(config.valhalla.url, config.valhalla.options),
      "top-right"
    );
  }
  map.addControl(
    new mapboxgl.ScaleControl({ maxWidth: 80, unit: "metric" }),
    "bottom-left"
  );
  map.addControl(
    new mapboxgl.AttributionControl({
      compact: true,
      customAttribution: config.attribution,
    }),
    "bottom-right"
  );
  if (config.popup) map.addControl(new MapboxPopupControl(config.popup.target));

  if (config.legend) {
    const legendCtrl = new MapboxLegendControl(
      config.legend.targets,
      config.legend.options
    );
    map.addControl(legendCtrl, "bottom-left");
  }


  map.on("load", () => {
    map.addSource("polygons", {
      type: "geojson",
      data: "./map.geojson", // Replace with the path to your GeoJSON file
    });
  
    // Add a layer to the map to display the polygons
    map.addLayer({
      id: "polygons-layer",
      type: "fill",
      source: "polygons",
      paint: {
        "fill-color": "#FF0000",
        "fill-opacity": 0.5,
      },
    });
  });

  // Load GeoJSON data
//   fetch("./map.geojson")
//     .then((response) => response.json())
//     .then((data) => {
//       // Add data to map
//       map.addSource("polygons", {
//         type: "geojson",
//         data: data,
//       });

//       console.log(data);

//       // Add layer to map
//       map.addLayer({
//         id: "polygons-layer",
//         type: "fill",
//         source: "polygons",
//         paint: {
//           "fill-color": "#FF0000",
//           "fill-opacity": 0.5,
//         },
//       });

//       // Show popup on click
//       map.on("click", "polygons-layer", (e) => {
//         const feature = e.features[0];
//         const popup = new mapboxgl.Popup()
//           .setLngLat(e.lngLat)
//           .setHTML(
//             `<strong>${feature.properties.name}</strong><br>${feature.properties.description}`
//           )
//           .addTo(map);
//       });
//     });
})();
