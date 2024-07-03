import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/ProfilePage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTask from "./pages/CreateTask";
import EditProject from "./pages/EditProject";
import ProjectDetails from "./pages/ProjectDetails";
import Resources from "./components/Resources";
import EditTask from "./pages/EditTask";
import CreateAnnouncement from "./pages/CreateAnnouncement";
import CreateUser from "./pages/CreateUser"; // Import CreateUser
import EditUserForm from "./components/EditUserForm";
import Users from "./components/Users";
import { AuthProvider } from './AuthContext';

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <Router>
                    <Navbar />
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/profile" exact component={Profile} />
                        <Route path="/signup" exact component={Signup} />
                        <Route path="/login" exact component={Login} />
                        <Route path="/forgotpassword" exact component={ForgotPassword} />
                        <Route path="/userdashboard" component={UserDashboard} />
                        <Route path="/admindashboard" exact component={AdminDashboard} />
                        <Route path="/createtask" exact component={CreateTask} />
                        <Route path="/project/:id" exact component={ProjectDetails} />
                        <Route path="/edit-project/:id" exact component={EditProject} />
                        <Route path="/resources" exact component={Resources} />
                        <Route path="/edit-task/:id" exact component={EditTask} />
                        <Route path="/create-announcement" exact component={CreateAnnouncement} />
                        <Route path="/create-user" exact component={CreateUser} />
                        <Route path="/edit-user/:id" exact component={EditUserForm} />
                        <Route path="/admindashboard/users" exact component={Users} />
                    </Switch>
                    <Footer />
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
