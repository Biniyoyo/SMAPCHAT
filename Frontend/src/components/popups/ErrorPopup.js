import { Button, Card, Container, Spinner } from "react-bootstrap";
import { useContext, useState } from "react";
import "./UserPopup.css";
import "./CommonPopup.css";
import { BsXLg } from "react-icons/bs";
import { popContext } from "../../App";

export default function SavePopup(props) {
  const setPop = useContext(popContext);

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
        <Card.Title>Uh oh!</Card.Title>
        <BsXLg className="close" onClick={() => setPop(null)}></BsXLg>
      </Card.Body>

      <Container>
        {props.message}
      </Container>
      <Button className="button" onClick={() => {
            props.onClick(name, description);
            setWaiting(true);
            }}>{props.buttonText}</Button>
    </Card>
  );
}
