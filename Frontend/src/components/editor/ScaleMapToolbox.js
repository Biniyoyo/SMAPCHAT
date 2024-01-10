import { Card, Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import {
  BsXLg,
  BsArrowCounterclockwise,
  BsArrowClockwise,
} from "react-icons/bs";
import "./CommonToolbox.css";
import ColorWidget from "./ColorWidget";
import DebouncedInput from "./DebouncedInput";

/// The toolbox for editing an scale map. Expects the map data and a TransactionHandler
/// for that data as the scaleMap and handler props respectively.
export default function ScaleMapToolbox(props) {
  const cards = [];
  for (const scalePointLocation in props.scaleMap.Location) {
    cards.push(
      <ScaleMapLocation
        handler={props.handler}
        index={scalePointLocation}
        scalePointLocation={props.scaleMap.Location[scalePointLocation]}
      />,
    );
  }

  return (
    <Card id="toolbox" className="toolbox">
      <Card.Body style={{ backgroundColor: "#0C0D34", color: "white" }}>
        <Card.Title>Scale Map Editor</Card.Title>
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

        <div style={{ marginLeft: "10px" }}>
          <ColorWidget
            text={"Min"}
            color={props.scaleMap.MinColor}
            onChange={(val) => props.handler.updateTrans(`MinColor`, val)}
          />
          <ColorWidget
            text={"Max"}
            color={props.scaleMap.MaxColor}
            onChange={(val) => props.handler.updateTrans(`MaxColor`, val)}
          />
        </div>
      </Container>

      <Container className="toolscroller">
        {cards}
        <Button
          className="inner"
          onClick={() =>
            props.readyPlace(() => (latlng) => {
              props.handler.createTrans("Location", {
                Name: "",
                Lattitude: latlng.lat,
                Longitude: latlng.lng,
                Value: 0,
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

/// Sub-component for the ScaleMapToolbox, expects a location and scale map data handler
/// as the scalePointLocation and handler props respectively. Also expects the index of the
/// scalePointLocation in the Location of the map data as the index prop.
function ScaleMapLocation(props) {
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
          value={props.scalePointLocation.Name}
          onChange={(val) =>
            props.handler.updateTrans(`Location[${props.index}].Name`, val)
          }
        />
        <BsXLg
          className="invisibleButton"
          onClick={(val) =>
            props.handler.deleteTrans("Location", props.scalePointLocation)
          }
        />
      </Card.Body>
      <Container style={{ padding: "20px" }}>
        <DebouncedInput
          className="input"
          placeholder="Value"
          type="number"
          value={props.scalePointLocation.Value}
          onChange={(val) =>
            props.handler.updateTrans(`Location[${props.index}].Value`, val)
          }
        />
      </Container>
    </Card>
  );
}
