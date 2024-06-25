import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
import CreateTask from "./pages/CreateTask";
import EditProject from "./pages/EditProject";
import ProjectDetails from "./pages/ProjectDetails";
import Resources from "./components/Resources";
import EditTask from "./pages/EditTask";

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
                        <Route path="/userdashboard" component={UserDashboard} />
                        <Route path="/report" exact component={UserSubmitReport} />
                        <Route path="/report/:id" exact component={ViewDetailedReport} />
                        <Route path="/admindashboard" exact component={AdminDashboard} />
                        <Route path="/reportdispatch/:id" exact component={AdminReportDispatch} />
                        <Route path="/createtask" exact component={CreateTask} />
                        <Route path="/project/:id" exact component={ProjectDetails} />
                        <Route path="/edit-project/:id" exact component={EditProject} />
                        <Route path="/resources" exact component={Resources} />
                        <Route path="/edit-task/:id" exact component={EditTask} /> {/* New route */}
                    </Switch>
                    <Footer />
                </Router>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
