import React, { useContext, useEffect, useState } from "react";
import "./CreatePage.css";
import MapTypes from "./LocalComponents/MapTypes";
import { useNavigate } from "react-router-dom";
import MapRenderer from "../../reuseable/MapRenderer";
import { handleFileUpload } from "../../../util/fileUtil";
import { GlobalStoreContext } from "../../../contexts/GlobalStoreContext";
import AuthContext from "../../../contexts/AuthContext";

const CreatePage = () => {
  console.log("Rerender!");
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const isLoggedIn = auth.loggedIn;
  const [mapType, setMapType] = useState("ArrowMap");
  const [typeLocked, setTypeLocked] = useState(false);
  const [preview, setPreview] = useState({});
  const [loadedMap, setLoadedMap] = useState(null);

  const globalStore = useContext(GlobalStoreContext);

  const handleRouteToEditPage = () =>
    navigate(isLoggedIn ? "/map-edit-page/" + mapType : "/login-page");

  useEffect(() => {
    console.log("Clear occured");
    globalStore.store.currentMap = null;
    globalStore.store.currentMapGraphic = null;
    globalStore.store.currentGeoJson = null;
    globalStore.setStore(globalStore.store);
  }, [globalStore]);

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="leftC p-0 rounded">
          <MapTypes
            mapType={mapType}
            setMapType={setMapType}
            typeLocked={typeLocked}
          />
        </div>
        <div className="middleC p-0 rounded ms-2">
          <div
            className="position-relative text-center"
            style={{ width: "100%", height: "100%" }}
          >
            <MapRenderer
              width="100%"
              height="100%"
              mapType={mapType}
              Geometry={preview}
              GeoJsonData={loadedMap}
            />
            <input
              id="uploadGeometry"
              style={{ visibility: "hidden" }}
              type="file"
              accept=".kml, .dbf, .shp, .json, .geojson"
              multiple
              onChange={(event) =>
                handleFileUpload(event.target.files).then((val) => {
                  globalStore.store.currentGeoJson = val;
                  globalStore.setStore(globalStore.store);
                  setPreview(val);
                  console.log("GeoJSON ready!");
                })
              }
            ></input>

            <label
              for="uploadGeometry"
              className="btn btn-edit-map position-absolute"
              style={{ top: "16px", right: "16px" }}
            >
              Upload Geometry
            </label>

            <input
              id="uploadGraphic"
              style={{ visibility: "hidden" }}
              type="file"
              accept=".json"
              onChange={(event) => {
                const file = event.target.files[0];
                const reader = new FileReader();

                reader.onload = (e) => {
                  const data = JSON.parse(e.target.result);
                  globalStore.store.currentMapGraphic = data.data;
                  globalStore.setStore(globalStore.store);
                  setLoadedMap(data.data);
                  setMapType(data.mapType);
                  setTypeLocked(true);
                };

                reader.readAsText(file);
              }}
            ></input>

            <label
              for="uploadGraphic"
              className="btn btn-edit-map position-absolute"
              style={{ top: "64px", right: "16px" }}
            >
              Upload Saved Map
            </label>
          </div>
        </div>
        <div className="rightC d-flex align-items-center">
          <div className="col align-items-center justify-content-center text-center">
            <div className="">
              In order to create a map, upload a region using the "Upload
              Geometry" button in GeoJSON, KML, or Shapefile format. Then,
              select one of the 5 map types on the left. <br />
              <br />
              Alternatively, you can upload a map you have previously saved
              locally using the "Upload Saved Map" button.
              <br />
              <br />
              Once you're ready to start editing, click on "Start Editing"
            </div>
            <br></br>
            <button className="custom-button" onClick={handleRouteToEditPage}>
              Start Editing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
