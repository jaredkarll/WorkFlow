// src/pages/UserDashboard.js
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import "../styles/UserDashboard.css";
import SideMenu from '../components/SideMenu';
import Announcements from '../components/Announcements';
import Tasks from '../components/Tasks';
import Projects from '../components/Projects';
import Resources from '../components/Resources'; // Import the Resources component
//import UploadForm from './UploadForm';


const UserDashboard = () => {
    const { path } = useRouteMatch();

    return (
        <div className="main-layout">
            <SideMenu />
            <div className="content">
                <Switch>
                    <Route exact path={path}>
                        <h2>Welcome to the Dashboard</h2>
                    </Route>
                    <Route path={`${path}/announcements`} component={Announcements} />
                    <Route path={`${path}/tasks`} component={Tasks} />
                    <Route path={`${path}/projects`} component={Projects} />
                    <Route path={`${path}/resources`} component={Resources} />
                </Switch>
            </div>
        </div>
    );
};

export default UserDashboard;
