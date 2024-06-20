import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserSubmitReport from "./pages/UserSubmitReport";
import UserDashboard from "./pages/UserDashboard";
import ViewDetailedReport from "./pages/ReportDetails";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReportDispatch from "./pages/AdminReportDispatch";
// import SideMenu from "./components/SideMenu";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export const AuthContext = React.createContext();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className="App">
            <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
                <Router>
                    <Navbar />
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/contact" exact component={Contact} />
                        <Route path="/signup" exact component={Signup} />
                        <Route path="/login" exact component={Login} />
                        <Route path="/forgotpassword" exact component={ForgotPassword} />
                        {/* User Side */}
                        <Route path="/report" exact component={UserSubmitReport} />
                        <Route path="/userdash" exact component={UserDashboard} />
                        <Route path="/report/:id" exact component={ViewDetailedReport} />
                        {/* Admin Side */}
                        <Route path="/admindash" exact component={AdminDashboard} />
                        <Route path="/reportdispatch/:id" exact component={AdminReportDispatch} />
                    </Switch>
                    <Footer />
                </Router>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
