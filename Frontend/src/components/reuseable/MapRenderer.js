import Leaflet from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from "react-leaflet";
import { renderPictureMap } from "./mapgraphics/PictureMap";
import { renderArrowMap } from "./mapgraphics/ArrowMap";
import { renderBubbleMap } from "./mapgraphics/BubbleMap";
import { renderCategoryMap } from "./mapgraphics/CategoryMap";
import { renderScaleMap } from "./mapgraphics/ScaleMap";
import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter';
import "leaflet/dist/leaflet.css";
import "./MapRenderer.css";

export default function MapRenderer(props) {
  const [map, setMap] = useState(null);
  const [zoom] = useState(2);
  const [layerGroup] = useState(Leaflet.layerGroup());
  const [boundaries, setBoundaries] = useState([]); // State to store GeoJSON boundaries

  useEffect(() => {
    if (props.Geometry && map) {
      const geoJsonLayer = Leaflet.geoJSON(props.Geometry.features, {
        onEachFeature: (feature, layer) => {
          setBoundaries((current) => [...current, { feature, layer }]);
        },
      });

      geoJsonLayer.addTo(map);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, {animate: false});
      }
    }
  }, [props.Geometry, map, zoom]);

  useEffect(() => {
    if (props.GeoJsonData) {
      layerGroup.clearLayers(); // Clear existing layers

      // Render maps based on the type
      if (props.mapType === "PictureMap" && props.GeoJsonData) {
        renderPictureMap(layerGroup, props.GeoJsonData);
      } else if (props.mapType === "ArrowMap" && props.GeoJsonData) {
        renderArrowMap(layerGroup, props.GeoJsonData);
      } else if (props.mapType === "BubbleMap" && props.GeoJsonData) {
        renderBubbleMap(layerGroup, props.GeoJsonData);
      } else if (props.mapType === "CategoryMap" && props.GeoJsonData && map) {
        renderCategoryMap(layerGroup, props.GeoJsonData, boundaries, map);
      } else if (props.mapType === "ScaleMap" && props.GeoJsonData && map) {
        renderScaleMap(layerGroup, props.GeoJsonData, boundaries, map);
      }
    }

    if (map) {
      layerGroup.addTo(map);
      console.log("Added layer group");
    } else {
      console.log("Failed to add layer group");
    }
  });

  useEffect(() => {
    if (map && props.screenshot) {
      new SimpleMapScreenshoter().addTo(map);
    }
  }, [map, props.screenshot]);

  return (
    <div id={props.id} style={{ width: props.width, height: props.height }}>
      <MapContainer
        style={{ height: props.height }}
        zoom={zoom}
        center={[40.9173, -73.1184]}
        minZoom={2}
        maxBoundsViscosity={1}
        ref={setMap}
      >
        <ClickHandler onClick={props.onClick} />
        <TileLayer
          noWrap={true}
          url="http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://carto.com/">carto.com</a> contributors'
        />
        {props.Geometry && <GeoJSON data={props.Geometry.features} />}
      </MapContainer>
    </div>
  );
}

function ClickHandler(props) {
  useMapEvents({
    click(e) {
      if (props.onClick != null) {
        props.onClick(e.latlng);
      }
    },
  });

  return <></>;
}
