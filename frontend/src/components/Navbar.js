import React, { useState, useContext } from "react";
import AuthContext from '../AuthContext';
import Logo from "../assets/WorkFlow Logo-2.svg";
import { Link, useLocation, useHistory } from "react-router-dom";
import ReorderIcon from "@material-ui/icons/Reorder";
import "../styles/Navbar.css";

function Navbar() {
    const [openLinks, setOpenLinks] = useState(false);
    const { isLoggedIn, logout } = useContext(AuthContext);
    const location = useLocation();
    const history = useHistory();

    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
    };

    const handleAuthButtonClick = () => {
        if (isLoggedIn) {
            logout();
            history.push("/");
        } else {
            history.push(location.pathname === "/login" ? "/signup" : "/login");
        }
    };

    return (
        <div className="navbar">
            <div className="leftSide" id={openLinks ? "open" : "close"}>
                <img src={Logo} alt="WorkFlow Logo" />
                <div className="hiddenLinks">
                    <Link to="/"> Home </Link>
                    {isLoggedIn && <Link to="/userdashboard"> Dashboard </Link>}
                    {isLoggedIn && <Link to="/profile"> Profile </Link>}
                    {location.pathname !== "/login" && (
                        <button
                            className={isLoggedIn ? "loggedInButton" : "signupButton"}
                            onClick={handleAuthButtonClick}
                        >
                            {isLoggedIn ? "Logout" : location.pathname === "/login" ? "Signup" : "Login"}
                        </button>
                    )}
                </div>
            </div>
            <div className="rightSide">
                <Link to="/"> Home </Link>
                {isLoggedIn && <Link to="/userdashboard"> Dashboard </Link>}
                {isLoggedIn && <Link to="/profile"> Profile </Link>}
                {location.pathname !== "/login" && (
                    <button
                        className={isLoggedIn ? "loggedInButton" : "signupButton"}
                        onClick={handleAuthButtonClick}
                    >
                        {isLoggedIn ? "Logout" : location.pathname === "/login" ? "Signup" : "Login"}
                    </button>
                )}
                <button onClick={toggleNavbar}>
                    <ReorderIcon />
                </button>
            </div>
        </div>
    );
}

export default Navbar;
