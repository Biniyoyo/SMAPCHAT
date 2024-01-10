import { Button, Card, Container, Spinner } from "react-bootstrap";
import { useContext, useState } from "react";
import "./UserPopup.css";
import "./CommonPopup.css";
import { BsXLg } from "react-icons/bs";
import { popContext } from "../../App";

export default function SavePopup(props) {
  const setPop = useContext(popContext);

  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [waiting, setWaiting] = useState(false);

  if (waiting) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only"></span>
          </Spinner>
          <p className="ml-2 mt-2">Uploading...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="popup">
      <Card.Body
        style={{
          backgroundColor: "#0C0D34",
          color: "white",
          height: "40px",
          padding: "5px",
        }}
      >
        <Card.Title>Name your map!</Card.Title>
        <BsXLg className="close" onClick={() => setPop(null)}></BsXLg>
      </Card.Body>

      <Container>
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}></input>
        <textarea className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </Container>
      <Button className="button" onClick={() => {
            props.onClick(name, description);
            setWaiting(true);
            }}>{props.buttonText}</Button>
    </Card>
  );
}
