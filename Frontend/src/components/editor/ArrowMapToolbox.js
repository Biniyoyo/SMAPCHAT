import { Card, Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import DebouncedInput from "./DebouncedInput";
import {
  BsXLg,
  BsArrowCounterclockwise,
  BsArrowClockwise,
} from "react-icons/bs";
import "./CommonToolbox.css";

/// Developer note: I've set this up with some basic functionality early so that it can
/// be used as a refference in the future. Check out how the TransactionHandler is utilized
/// here to mutate the map data while being able to undo and redo it!

/// The toolbox for editing an arrow map. Expects the map data and a TransactionHandler
/// for that data as the arrowMap and handler props respectively.
export default function ArrowMapToolbox(props) {
  const cards = [];
  for (const arrowPointLocation in props.arrowMap.Location) {
    cards.push(
      <ArrowMapLocation
        handler={props.handler}
        readyPlace={props.readyPlace}
        index={arrowPointLocation}
        arrowPointLocation={props.arrowMap.Location[arrowPointLocation]}
      />,
    );
  }

  return (
    <Card id="toolbox" className="toolbox">
      <Card.Body style={{ backgroundColor: "#0C0D34", color: "white" }}>
        <Card.Text>Arrow Map Editor</Card.Text>
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
                Lattitude: latlng.lat,
                Longitude: latlng.lng,
                Order: 0,
                Date: "",
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

/// Sub-component for the ArrowMapToolbox, expects a location and arrow map data handler
/// as the arrowPointLocation and handler props respectively. Also expects the index of the
/// arrowPointLocation in the Location of the map data as the index prop.
function ArrowMapLocation(props) {
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
          value={props.arrowPointLocation.Name}
          onChange={(val) =>
            props.handler.updateTrans(`Location[${props.index}].Name`, val)
          }
        />
        <BsXLg
          className="invisibleButton"
          onClick={(val) =>
            props.handler.deleteTrans("Location", props.arrowPointLocation)
          }
        />
      </Card.Body>
      <Container style={{ padding: "20px" }}>
        <DebouncedInput
          className="input"
          placeholder="Order"
          value={props.arrowPointLocation.Order}
          onChange={(val) =>
            props.handler.updateTrans(`Location[${props.index}].Order`, val)
          }
        />
        <DebouncedInput
          className="input"
          placeholder="Date"
          value={props.arrowPointLocation.Date}
          onChange={(val) =>
            props.handler.updateTrans(`Location[${props.index}].Date`, val)
          }
        />
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
