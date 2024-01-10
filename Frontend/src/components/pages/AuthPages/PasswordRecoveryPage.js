import React, { useState, useContext } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import Logo from "../../../assets/images/logo2.png";
import { AuthContext } from "../../../contexts/AuthContext";
import CodeVerificationForm from "./Component/CodeVerificationForm";

const PasswordRecoveryPage = () => {
  const { resetPassword, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [verified, setVerified] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { success, error } = await resetPassword(email);
    if (success) {
      setFeedback(
        `Instructions to reset your password have been sent to your email: ${email}.`
      );
      setVerified(true);
      // Optionally navigate to a different page or show a message
    } else {
      setFeedback(
        error || "An error occurred while trying to reset the password."
      );
      setVerified(false);
    }
  };

  return (
    <Container className="d-flex vh-100">
      <Row className="m-auto align-self-center w-100">
        <Col md={7} className="mx-auto text-center">
          <div className="text-center">
            <img src={Logo} alt="Logo" width="220" />
          </div>
          <Card
            className="login-card text-center mx-auto my-4"
            style={{
              backgroundColor: "white",
              borderRadius: "14px",
              maxWidth: "90%",
            }}
          >
            <Card.Body>
              <Card.Title
                className="p-0 m-0"
                style={{
                  color: "#0C0D34",
                  fontSize: "32px",
                  fontWeight: "900",
                }}
              >
                Welcome Back!
              </Card.Title>
            </Card.Body>
          </Card>
          {!verified ? (
            <>
              <div className="mb-4">
                Forgot your password? Don’t worry, it happens to the best of us.
                Just enter your registered email address below, and we'll send
                you instructions on how to reset it.
              </div>
              <Form
                className="login-form"
                onSubmit={handleResetPassword}
                style={{ maxWidth: "40%" }}
              >
                <Form.Group className="mb-3" controlId="formBasicRecoveryEmail">
                  <Form.Control
                    type="email"
                    placeholder="Recovery E-Mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Button
                  className="btn btn-2 mx-auto mb-5"
                  size="lg"
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="ms-2">Loading...</span>
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>
              </Form>
            </>
          ) : email ? (
            <CodeVerificationForm email={email} />
          ) : (
            <p>asffafaww</p>
          )}
          {feedback && <div className="feedback-message">{feedback}</div>}
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordRecoveryPage;
