import React, { useContext, useState } from "react";
import {
  Image,
  Card,
  Container,
  Button,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import { popContext } from "../../App";
import "./Customer.css";
import UserPopup from "../popups/UserPopup";
import defaultAvatar from "../../assets/images/avatar.png";
import { deleteUser, updateUserProfile } from "../../util/userUtil";
import ConfirmationDialog from "../popups/ConfirmationDialog";
import { useNavigate } from "react-router-dom";

export default function Customer(props) {

  const setPop = useContext(popContext);
  const navigate = useNavigate();

  const [, setIsBanned] = useState(props.userData.isActive);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [admin, setAdmin] = useState(props.userData.userType === 1);
  const [loading, setLoading] = useState(false);
  
  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    console.log(`Deleting user: ${props.userData.username}`);
    await deleteUser(props.userData._id);
    setShowConfirmation(false);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleBan = () => {
    console.log(`Deactivating user: ${props.userData.username}`);
    setLoading(true);
    var newProf = props.userData;
    newProf.isActive = false;

    updateUserProfile(newProf).then(() => {
      setLoading(false);
      setIsBanned(true);
    });
  };

  const handleActivate = () => {
    console.log(`Activating user: ${props.userData.username}`);
    setLoading(true);
    var newProf = props.userData;
    newProf.isActive = true;

    updateUserProfile(newProf).then(() => {
      setLoading(false);
      setIsBanned(false);
    });
  };

  const handleToggleAdmin = () => {
    setLoading(true);
    var newProf = props.userData;
    newProf.userType = newProf.userType === 1 ? 0 : 1;

    updateUserProfile(newProf).then(() => {
      setLoading(false);
      setAdmin(newProf.userType === 1);
    });
  };

  const spinner = loading ? <Spinner style={{margin: "10px"}}/> : <></>;

  return (
    <Card className="my-2" style={{ width: "80%", margin: "auto" }}>
      <Card.Body
        style={{
          backgroundColor: "#0C0D34",
          color: "white",
          height: "40px",
          padding: "5px",
        }}
      >
        <Card.Title>{props.userData.username ?? "Loading..."}</Card.Title>
      </Card.Body>

      <Container className="d-flex align-items-center">
        <Image
          className="Avatar"
          src={props.userData.avatar}
          onError={({ target }) => (target.src = defaultAvatar)}
          roundedCircle
        />
        <Button
          className="button"
          onClick={() => setPop(<UserPopup user={props} />)}
        >
          View Profile
        </Button>
        
        <Button 
          className="button"
          onClick={() => navigate(`/my-maps-page/${props.userData._id}`)}>
          View Maps
        </Button>

        <Dropdown className="mr-2">
          <Dropdown.Toggle
            variant="danger"
            id="dropdown-basic"
            style={{ width: "fit-content", marginLeft:"10px" }}
          >
            Status
          </Dropdown.Toggle>

          <Dropdown.Menu style={{padding: "10px"}}>
            <Dropdown.Item
              onClick={handleDelete}
              style={{ width: "fit-content" }}
              className="redButton mb-2 rounded-3 text-white"
            >
              Delete
            </Dropdown.Item>
            {!props.userData.isActive ? (
              <Dropdown.Item
                onClick={handleActivate}
                style={{ width: "fit-content", textAlign: "center" }}
                className="greenButton text-white rounded-2 mb-2 text-white"
              >
                Activate
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                onClick={handleBan}
                className="redButton rounded-2 mb-2 text-white"
                style={{ width: "fit-content" }}
              >
                Deactivate
              </Dropdown.Item>
            )}
            <Dropdown.Item
              onClick={handleToggleAdmin}
              style={{ width: "fit-content" }}
              className={ (!admin ? "greenButton rounded-2 text-white" : "redButton rounded-2 text-white")}
            >
              {!admin ? "Make Admin" : "Revoke Admin"}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {spinner}
      </Container>
      <ConfirmationDialog
        show={showConfirmation}
        onHide={handleCloseConfirmation}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete ${props.userData.username}?`}
      />
    </Card>
  );
}