import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import Logo from "../../../assets/images/logo2.png";
import "./styles.css";
import { AuthContext } from "../../../contexts/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setError] = useState("");

  const { loginUser } = useContext(AuthContext);

  const handleRouteToHome = () => navigate("/");
  const handleRouteToSignup = () => navigate("/signup-page");
  const handleRouteToRecoveryPassword = () =>
    navigate("/password-recovery-page");

  const handleLoginUser = async (e) => {
    e.preventDefault();
    setError("");

    const { success, error } = await loginUser({ email, password });
    if (success) {
      handleRouteToHome();
    } else {
      setError(error);
    }
  };

  return (
    <Container className="d-flex vh-100">
      <Row className="m-auto align-self-center w-100">
        <Col md={6} className="mx-auto text-center">
          <div className="text-center">
            <img src={Logo} alt="Logo" width="220" />
          </div>
          <Card
            className="login-card text-center mx-auto my-4"
            style={{
              backgroundColor: "white",
              borderRadius: "14px",
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
          <Form
            className="login-form"
            onSubmit={handleLoginUser}
            style={{ maxWidth: "50%" }}
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className=" d-grid gap-2 ">
              <Button
                className="btn login-btn mx-auto mb-5"
                size="lg"
                type="submit"
              >
                Login
              </Button>
              <Button
                className="btn-secondary"
                size="lg"
                type="button"
                onClick={handleRouteToSignup}
              >
                Register
              </Button>
              <Button
                className="btn-secondary"
                size="lg"
                type="button"
                onClick={handleRouteToRecoveryPassword}
              >
                Forgot Password/username?
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
