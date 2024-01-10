import { Button, Card, Container, Image, Form, Col } from "react-bootstrap";
import { useContext, useState } from "react";
import "./UserPopup.css";
import "./CommonPopup.css";
import { BsXLg } from "react-icons/bs";
import { popContext } from "../../App";
import AuthContext from "../../contexts/AuthContext";
import defaultAvatar from "../../assets/images/avatar.png";
import DeleteUserPopup from "./DeleteUserPopup";
import { updateUserProfile } from "../../util/userUtil";
import { Spinner } from "react-bootstrap";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import app from "../../config/firebase";

export default function UserPopup(props) {
  const { auth, logoutUser } = useContext(AuthContext);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const setPop = useContext(popContext);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(auth.user.username);
  const [email, setEmail] = useState(auth.user.email);
  const [avatar, setAvatar] = useState(auth.user.avatar);
  const [waiting, setWaiting] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    setWaiting(true);

    var newUser = auth.user;
    newUser.username = username;
    newUser.email = email;
    newUser.avatar = avatar;
    await updateUserProfile(newUser);
    setWaiting(false);
  };

  const handleLogout = () => {
    setPop(null);
    logoutUser();
  };

  const uploadImageToFirebase = async (file) => {
    if (!file) return null;

    const storage = getStorage(app);
    const storageRef = ref(storage, `avatars/${file.name}`);
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
        },
      );
    });
  };

  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const downloadURL = await uploadImageToFirebase(file);
      if (downloadURL) {
        setAvatar(downloadURL);
      }
    }
  };

  if (waiting) {
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
        <Card.Title>Personal Information</Card.Title>
        <BsXLg className="close" onClick={() => setPop(null)}></BsXLg>
      </Card.Body>
      <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "300px" }}>   
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only"></span>
          </Spinner>
          <p className="ml-2 mt-2">Updating...</p>
        </div>
      </div>
    </Card>
    )
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
        <Card.Title>Personal Information</Card.Title>
        <BsXLg className="close" onClick={() => setPop(null)}></BsXLg>
      </Card.Body>
      <Container>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            disabled={!isEditing}
          />
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
          />
        </Form.Group>

        <div className="delete-button-container">
          <Button variant="danger" onClick={() => setShowDeletePopup(true)}>
            Delete Account
          </Button>
        </div>

        {/* Avatar and image buttons */}
        <Col>

        <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id={`upload`}
              onChange={handleFileInput}
              disabled={!isEditing}
            />
            <label
              htmlFor={`upload`}
              style={{display: "flex" }}
            >
              <Image
                className="avatar"
                src={avatar}
                onError={({target}) => target.src = defaultAvatar}
                roundedCircle
              />
            </label>


        </Col>
        <div className="text-end mt-3">
          {isEditing && <Button className="m-3">Password</Button>}
          {isEditing && <Button onClick={() => setAvatar("")}>Delete Image</Button>}
          <Button
            onClick={isEditing ? handleSaveClick : handleEditClick}
            className="m-3"
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </Container>

      {showDeletePopup && (
        <DeleteUserPopup onClose={() => setShowDeletePopup(false)} />
      )}
    </Card>
  );
}
