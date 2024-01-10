import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import "./styles.css";
import Logo from "../../../assets/images/logo2.png";
import { AuthContext } from "../../../contexts/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [error, setError] = useState("");

  const { registerUser } = useContext(AuthContext);

  const handleRegisterUser = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    if (password !== passwordVerify) {
      setError("Passwords do not match");
      return;
    }

    setError(""); // Clear any existing errors
    const { success, error } = await registerUser({
      email,
      username,
      password,
    });
    if (success) {
      navigate("/"); // Redirect to home or other page as needed
    } else {
      console.log("we will show popUp error", error);
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
                Welcome to Smapchat!
              </Card.Title>
            </Card.Body>
          </Card>
          <Form className="login-form mb-4" onSubmit={handleRegisterUser}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            <Form.Group className="mb-4" controlId="formBasicRepeatPassword">
              <Form.Control
                type="password"
                placeholder="Repeat Password"
                value={passwordVerify}
                onChange={(e) => setPasswordVerify(e.target.value)}
              />
            </Form.Group>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <Button className="btn login-btn mx-auto" size="lg" type="submit">
              Register
            </Button>
          </Form>
          <div className="account-section">
            <div className="text-black">
              Already have an account:{" "}
              <Link to="/login-page" style={{ color: "blue" }}>
                Login
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
