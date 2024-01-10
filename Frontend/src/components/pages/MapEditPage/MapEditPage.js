import React, { useState, useReducer, useContext } from "react";
import "./MapEditPage.css";

import arrowData from "../../editor/SampleArrowMap.json";
import bubbleData from "../../editor/SampleBubbleMap.json";
import pictureData from "../../editor/SamplePictureMap.json";
import categoryData from "../../editor/SampleCategoryMap.json";
import scaleData from "../../editor/SampleScaleMap.json";

import ArrowMapToolbox from "../../editor/ArrowMapToolbox";
import BubbleMapToolbox from "../../editor/BubbleMapToolbox";
import PictureMapToolbox from "../../editor/PictureMapToolbox";
import CategoryMapToolbox from "../../editor/CategoryMapToolbox";
import ScaleMapToolbox from "../../editor/ScaleMapToolbox";

import TransactionHandler from "../../editor/TransactionHandler";
import MapRenderer from "../../reuseable/MapRenderer";

import { GlobalStoreContext } from "../../../contexts/GlobalStoreContext";

import { useNavigate, useParams } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";

import AuthContext from "../../../contexts/AuthContext";
import { createMap } from "../../../util/mapUtil";
import { popContext } from "../../../App";
import FileSaver from "file-saver";
import SavePopup from "../../popups/SavePopup";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import app from "../../../config/firebase";

export default function MapEditPage() {
  const globalStore = useContext(GlobalStoreContext);
  const auth = useContext(AuthContext);
  const setPop = useContext(popContext);

  const navigate = useNavigate();

  var params = useParams();
  var defaultData = {};
  var toolbox = <></>;

  // If we're carrying over data from a global state, we should use that.
  // Otherwise, we want to use a default template.
  if (globalStore.store.currentMapGraphic) {
    defaultData = globalStore.store.currentMapGraphic;
    console.log("Pulling in global store data");
  } else {
    switch (params.mapType) {
      case "ArrowMap":
        defaultData = arrowData;
        break;
      case "BubbleMap":
        defaultData = bubbleData;
        break;
      case "PictureMap":
        defaultData = pictureData;
        break;
      case "CategoryMap":
        defaultData = categoryData;
        break;
      case "ScaleMap":
        defaultData = scaleData;
        break;
      default:
        defaultData = {};
        break;
    }
  }

  // This contains the current map graphic data and geoJson. A transaction
  // handler is initialized to handle operating on the data. See
  // TransactionHandler.js for details.
  const [data, setData] = useState(defaultData);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [handler, setHandler] = useState(new TransactionHandler(data, forceUpdate));

  if (!globalStore.store.currentMapGraphic) {
    console.log("UseEffect Edit");
    console.log(scaleData);
    setData(defaultData);
    setHandler(new TransactionHandler(data, forceUpdate));

    globalStore.store.currentMapGraphic = data;
    globalStore.setStore(globalStore.store);
  }

  // This state controls if the editor screen is in a mode where we can click
  // on the map. In this state, the next time the user clicks on the map, the
  // placeFunction will fire. you need to pass a double closure as the function
  // because of javascript weirdness, so the form would look something like:
  // readyPlace(() => (latlng) => DoSomeSuff(latlng)); when set in an onClick.
  const [placing, setPlacing] = useState(false);
  const [placeFunction, setPlaceFunction] = useState((latlng) => {});
  const readyPlace = (placeFunction) => {
    setPlacing(true);
    setPlaceFunction(placeFunction);
  };

  //save button
  const handleSaveButton = () => {
    sendMap(0);
  };

  //publish button
  const handlePublishButton = () => {
    sendMap(1);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({mapType: params.mapType, data: data})], {type: "text/json"});
    FileSaver.saveAs(blob, `Smapchat${params.mapType}.json`);
  };


  const uploadToFirebase = async (file) => {
    if (!file) return null;

    const storage = getStorage(app);
    const storageRef = ref(storage, `geojson/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {

          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
          }
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const sendMap = (visibility) => {

    if (!auth.auth.user) {
      alert("You must be logged in to save or publish maps!");
      return;
    }

    var mapData = globalStore.store.currentMap;

    if (!mapData) {
      mapData = {
        mapType: params.mapType,
        MapID: 0,
        avgRate: 0,
        comment: [],
        mapFile: "",
        date: Date(),
        public: visibility,
        owner: auth.auth.user.email,
      };
    }

    setPop(
      <SavePopup
        name={mapData.title}
        description={mapData.description}
        buttonText="Save map!"
        onClick={(name, desc) => {
          mapData.title = name;
          mapData.description = desc;
          mapData.owner = auth.auth.user.email;
          mapData.public = visibility;

          if (mapData.mapFile === "") {
            const stringify = JSON.stringify(globalStore.store.currentGeoJson);
            var blob = new Blob([stringify], { type: "application/json" });
            const file = new File(
              [blob],
              `${Date()}-${Math.random()}.geo.json`
            );
            uploadToFirebase(file).then((mapFile) => {
              mapData.mapFile = mapFile;

              var graphicData = data;
              graphicData.MapID = mapData._id ?? 0;

              createMap(mapData, graphicData).then(() => {
                setPop(null);
                navigate("/");
              });
            });
          } else {
            var graphicData = data;
            graphicData.MapID = mapData._id ?? 0;

            createMap(mapData, graphicData).then(() => {
              setPop(null);
              navigate("/");
            });
          }
        }}
      />
    );
  };

  // Load an appropriate toolbox based on which map type we're editing.
  // May be a nicer way to clean this up later...

  switch (params.mapType) {
    case "ArrowMap":
      toolbox = (
        <ArrowMapToolbox
          handler={handler}
          arrowMap={data}
          readyPlace={readyPlace}
        />
      );
      break;
    case "BubbleMap":
      toolbox = (
        <BubbleMapToolbox
          handler={handler}
          bubbleMap={data}
          readyPlace={readyPlace}
        />
      );
      break;
    case "PictureMap":
      toolbox = (
        <PictureMapToolbox
          handler={handler}
          pictureMap={data}
          readyPlace={readyPlace}
        />
      );
      break;
    case "CategoryMap":
      toolbox = (
        <CategoryMapToolbox
          handler={handler}
          categoryMap={data}
          readyPlace={readyPlace}
        />
      );
      break;
    case "ScaleMap":
      toolbox = (
        <ScaleMapToolbox
          handler={handler}
          scaleMap={data}
          readyPlace={readyPlace}
        />
      );
      break;
    default:
      toolbox = <></>;
      break;
  }

  // Handles firing the appropriate events if possible when the map is clicked.
  // Will only fire anything if we're in the placing state.
  const handleMapClick = (latlng) => {
    if (!placing) {
      console.log("Clicked not placing");
      return;
    }

    placeFunction(latlng);

    setPlacing(false);
    setPlaceFunction((latlng) => {});
  };

  // Display a notification the user can click in the map when in the placing
  // state. This is the main visual distinction for this state.
  const notification = placing ? (
    <Alert style={{ position: "absolute", margin: "auto", bottom: "20px" }}>
      Click anywhere on the map!
    </Alert>
  ) : (
    <></>
  );
  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col leftF p-0 rounded ms-2">
          <MapRenderer
            width="100%"
            height="100%"
            Geometry={globalStore.store.currentGeoJson}
            mapType={params.mapType}
            GeoJsonData={data}
            onClick={handleMapClick}
            screenshot={true}
          />
          {notification}
        </div>
        <div className="col rightE p-0 rounded ms-2">
          {toolbox}
          <div style={{ width: "100%", display: "flex", marginTop: "40px" }}>
            <Button
              style={{ width: "40%", margin: "auto" }}
              onClick={handleSaveButton}
            >
              Save
            </Button>
            <Button
              style={{ width: "40%", margin: "auto" }}
              onClick={handlePublishButton}
            >
              Publish
            </Button>

          </div>
          <div style={{ width: "100%", display: "flex", marginTop: "20px" }}>
            <Button
              style={{ width: "40%", margin: "auto" }}
              onClick={handleExport}
            >
              Save Locally
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
