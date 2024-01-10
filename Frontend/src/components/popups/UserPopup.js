import { Card, Container, Image } from "react-bootstrap";
import { useContext } from "react";
import defaultAvatar from "../../assets/images/avatar.png";
import "./UserPopup.css";
import "./CommonPopup.css";
import { BsXLg } from "react-icons/bs";
import { popContext } from "../../App";

export default function UserPopup(props) {
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
        <Card.Title>Customer Information</Card.Title>
        <BsXLg className="close" onClick={() => setPop(null)}></BsXLg>
      </Card.Body>

      <Container>
        <div style={{display: "flex", margin: "10px"}}>
          <Image
            className="avatar"
            src={props.user.userData.avatar}
            onError={({target}) => target.src = defaultAvatar}
            roundedCircle
          />
        </div>
        <div className="box">{props.user.userData.username}</div>
        <div className="box">{props.user.userData.email}</div>
      </Container>
    </Card>
  );
}
