import { Card, Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useState } from "react";
import {
  BsXLg,
  BsArrowCounterclockwise,
  BsArrowClockwise,
  BsPlusLg,
} from "react-icons/bs";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import app from "../../config/firebase";

import "./CommonToolbox.css";
import DebouncedInput from "./DebouncedInput";

/// The toolbox for editing an picture map. Expects the map data and a TransactionHandler
/// for that data as the pictureMap and handler props respectively.
export default function PictureMapToolbox(props) {
  const cards = [];
  for (const picturePointLocation in props.pictureMap.Location) {
    cards.push(
      <PictureMapLocation
        key={`PictureMapLocation${picturePointLocation}`}
        handler={props.handler}
        index={picturePointLocation}
        readyPlace={props.readyPlace}
        picturePointLocation={props.pictureMap.Location[picturePointLocation]}
      />,
    );
  }

  return (
    <Card id="toolbox" className="toolbox">
      <Card.Body style={{ backgroundColor: "#0C0D34", color: "white" }}>
        <Card.Text>Picture Map Editor</Card.Text>
      </Card.Body>

      <Container>
        <Button
          className="undoredo"
          disabled={props.handler.undoList.length <= 0}
          onClick={() => props.handler.undo()}
        >
          <BsArrowCounterclockwise /> Undo
        </Button>
        <Button
          className="undoredo"
          disabled={props.handler.redoList.length <= 0}
          onClick={() => props.handler.redo()}
        >
          <BsArrowClockwise /> Redo
        </Button>
      </Container>

      <Container className="toolscroller">
        {cards}
        <Button
          className="inner"
          onClick={() =>
            props.readyPlace(() => (latlng) => {
              props.handler.createTrans("Location", {
                Name: "",
                Library: [],
                Longitude: latlng.lng,
                Lattitude: latlng.lat,
              });
            })
          }
        >
          Add new
        </Button>
      </Container>
    </Card>
  );
}

/// Sub-component for the PictureMapToolbox, expects a location and picture map data handler
/// as the picturePointLocation and handler props respectively. Also expects the index of the
/// picturePointLocation in the Location of the map data as the index prop.
function PictureMapLocation(props) {
  const cards = [];
  for (const library in props.picturePointLocation.Library) {
    cards.push(
      <PictureMapLibrary
        key={`library${library}`}
        handler={props.handler}
        parentIndex={props.index}
        index={library}
        library={props.picturePointLocation.Library[library]}
      />,
    );
  }

  return (
    <Card className="inner">
      <Card.Body
        style={{
          backgroundColor: "#0C0D34",
          color: "white",
          height: "40px",
          padding: "5px",
        }}
      >
        <input
          className="invisibleInput"
          placeholder="Name"
          value={props.picturePointLocation.Name}
          onChange={(val) =>
            props.handler.updateTrans(
              `Location[${props.index}].Name`,
              val.target.value,
            )
          }
        />
        <BsXLg
          className="invisibleButton"
          onClick={(val) =>
            props.handler.deleteTrans("Location", props.picturePointLocation)
          }
        />
      </Card.Body>
      <Container style={{ padding: "20px" }}>
        {cards}
        <Button
          className="inner"
          onClick={() =>
            props.handler.createTrans(`Location[${props.index}].Library`, {
              Name: "",
              Images: [],
            })
          }
        >
          Add new
        </Button>

        <Button
          onClick={() =>
            props.readyPlace(() => (latlng) => {
              props.handler.compoundTrans([
                {
                  path: `Location[${props.index}].Lattitude`,
                  newValue: latlng.lat,
                },
                {
                  path: `Location[${props.index}].Longitude`,
                  newValue: latlng.lng,
                },
              ]);
            })
          }
        >
          Move
        </Button>
      </Container>
    </Card>
  );
}

/// Dispalys a collection of images that makes up a library in the image map
function PictureMapLibrary(props) {
  const images = [];
  const [uploadText, setUploadText] = useState("+");

  for (const img in props.library.Images) {
    images.push(
      <PictureMapPicture
        key={`image${img}`}
        handler={props.handler}
        parentIndex={props.parentIndex}
        index={props.index}
        src={props.library.Images[img]}
      />,
    );
  }

  const uploadImageToFirebase = async (file) => {
    if (!file) return null;

    const storage = getStorage(app);
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          const progressTwoDecimal = progress.toFixed(2);
          setUploadText("Uploading: " + progressTwoDecimal + "%");

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
          setUploadText("+");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
            setUploadText("+");
          });
        },
      );
    });
  };

  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const downloadURL = await uploadImageToFirebase(file);
      if (downloadURL) {
        props.handler.createTrans(
          `Location[${props.parentIndex}].Library[${props.index}].Images`,
          downloadURL,
        );
      }
    }
  };

  return (
    <Card className="inner">
      <Card.Body
        style={{
          backgroundColor: "#0C0D34",
          color: "white",
          height: "40px",
          padding: "5px",
        }}
      >
        <DebouncedInput
          className="invisibleInput"
          placeholder="Name"
          value={props.library.Name}
          onChange={(val) =>
            props.handler.updateTrans(
              `Location[${props.parentIndex}].Library[${props.index}].Name`,
              val,
            )
          }
        />
        <BsXLg
          className="invisibleButton"
          onClick={(val) =>
            props.handler.deleteTrans(
              `Location[${props.parentIndex}].Library`,
              props.library,
            )
          }
        />
      </Card.Body>

      <Container>
        {images}
        {uploadText === "+" ? (
          <>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id={`upload-${props.parentIndex}-${props.index}`}
              onChange={handleFileInput}
            />
            <label
              htmlFor={`upload-${props.parentIndex}-${props.index}`}
              style={{ margin: "5px" }}
            >
              <Button style={{ width: "129px", height: "100px" }} disabled>
                <BsPlusLg style={{ width: "30px", height: "30px" }} />
              </Button>
            </label>
          </>
        ) : (
          <div style={{ margin: "5px" }}>{uploadText}</div>
        )}
      </Container>
    </Card>
  );
}

/// Image element that previews an image with a cross to remove it
function PictureMapPicture(props) {
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        width: "129px",
        height: "100px",
        margin: "5px",
      }}
    >
      <img
        alt="Custom"
        style={{ width: "129px", height: "100px" }}
        src={props.src}
      ></img>

      <Button
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          padding: "2px",
        }}
        onClick={(val) =>
          props.handler.deleteTrans(
            `Location[${props.parentIndex}].Library[${props.index}].Images`,
            props.src,
          )
        }
      >
        <BsXLg />
      </Button>
    </div>
  );
}
