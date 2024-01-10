import React, { useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import Logo from "../../assets/images/Logo1.png";
import defaultAvatar from "../../assets/images/avatar.png";
import AuthContext from "../../contexts/AuthContext";
import "./Header.css";
import MyUserPopup from "../popups/MyUserPopup";
import { popContext } from "../../App";
import { Image } from "react-bootstrap";

const Header = () => {
  // states, contexts, and variables
  const { auth } = useContext(AuthContext);
  const setPop = useContext(popContext);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = auth.loggedIn;
  const user = auth.user;

  console.log("isLog in Header: ", isLoggedIn);
  const authPages =
    location.pathname === "/login-page" ||
    location.pathname === "/signup-page" ||
    location.pathname === "/password-recovery-page";

  //functions
  const handleNavigateToLogin = () => navigate("/login-page");
  const handleNavigateToSignup = () => navigate("/signup-page");

  if (authPages) {
    return null;
  }
  return (
    <Navbar
      className="navbar"
      expand="lg"
      style={{ backgroundColor: "#0C0D34" }}
    >
      <Container>
        <Navbar.Brand href="/">
          <img src={Logo} width="300" height="auto" alt="Logo" />
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link
            as={NavLink}
            to="/"
            className="me-5 text-white"
            style={{ fontSize: "1.2em" }}
          >
            Home
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/create-page"
            className="me-5 text-white"
            style={{ fontSize: "1.2em" }}
          >
            Create
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to={auth.user ? `/my-maps-page/${auth.user._id}` : "/login-page"}
            className="me-5 text-white"
            style={{ fontSize: "1.2em" }}
          >
            My Maps
          </Nav.Link>

          {user && user.userType === 1 && (
            <Nav.Link
              as={NavLink}
              to="/manage-user-page"
              className="me-5 text-white"
              style={{ fontSize: "1.2em" }}
            >
              Customers
            </Nav.Link>
          )}
        </Nav>
        {!isLoggedIn && (
          <>
            <Button
              onClick={handleNavigateToSignup}
              type="button"
              className="transparent-button btn  px-3 py-1 rounded-3 fw-bold ms-3"
            >
              Sign up
            </Button>
            <Button
              onClick={handleNavigateToLogin}
              type="button"
              className="btn transparent-button px-3 py-1 rounded-3 fw-bold ms-3"
            >
              Log in
            </Button>
          </>
        )}

        {isLoggedIn && (
          <>
            <Button
              onClick={() => setPop(<MyUserPopup user={auth.user} />)}
              type="button"
              className="btn btn-primary px-4 py-2 rounded-3 fw-bold mx-3"
              style={{ backgroundColor: "#4ACEFF" }}
            >
              {auth.user.username}
            </Button>
            <Image
              style={{ width: "45px", height: "45px" }}
              src={auth.user?.avatar}
              onError={({ target }) => (target.src = defaultAvatar)}
              roundedCircle
              alt="User Avatar"
            />
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
