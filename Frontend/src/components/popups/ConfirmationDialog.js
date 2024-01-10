import React from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmationDialog = ({ show, onHide, onConfirm, message }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button className="redButton" variant="danger" onClick={onConfirm}>
          Confirm Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationDialog;
