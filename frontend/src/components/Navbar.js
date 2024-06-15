import React, { useState, useContext } from "react";
import { AuthContext } from "../App";
import Logo from "../assets/WorkFlow Logo.svg";
import { Link, useLocation, useHistory } from "react-router-dom";
import ReorderIcon from "@material-ui/icons/Reorder";
import "../styles/Navbar.css";

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      // Log out the user
      setIsLoggedIn(false);
      history.push("/");
    } else {
      history.push(location.pathname === "/signup" ? "/login" : "/signup");
    }
  };

  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <img src={Logo} alt="SafeZone Logo" />
        <div className="hiddenLinks">
          <Link to="/"> Home </Link>
          {/* <Link to="/menu"> Menu </Link>
          <Link to="/about"> About </Link> */}
          <Link to="/contact"> Contact </Link>
          <button className={isLoggedIn ? "loggedInButton" : "signupButton"} onClick={handleAuthButtonClick}>
            {isLoggedIn ? "Logout" : location.pathname === "/signup" && !isLoggedIn ? "Login" : "Signup"}
          </button>
        </div>
      </div>
      <div className="rightSide">
        <Link to="/"> Home </Link>
        {/* <Link to="/menu"> Menu </Link>
        <Link to="/about"> About </Link> */}
        <Link to="/contact"> Contact </Link>
        <button className={isLoggedIn ? "loggedInButton" : "signupButton"} onClick={handleAuthButtonClick}>
          {isLoggedIn ? "Logout" : location.pathname === "/signup" && !isLoggedIn ? "Login" : "Signup"}
        </button>
        <button onClick={toggleNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
