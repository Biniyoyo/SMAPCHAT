import React, { useState, useContext } from "react";
import { Card, Container, Button } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";
import AuthContext from "../../contexts/AuthContext"; // Adjust the import path

function DeleteUserPopup({ onClose }) {
  const { auth, deleteUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleConfirmDelete = async () => {
    try {
      await deleteUser({ email, password, _id: auth.user._id });
      alert("User Information is deleted successfully!");
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

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
        <Card.Title>Delete Account</Card.Title>
        <BsXLg className="close" onClick={onClose}></BsXLg>
      </Card.Body>

      <Container>
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Container>
      <Button className="button" onClick={handleConfirmDelete}>
        Confirm Delete
      </Button>
    </Card>
  );
}

export default DeleteUserPopup;
