// src/pages/UserDashboard.js
import React, { useContext } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import "../styles/UserDashboard.css";
import SideMenu from '../components/SideMenu';
import Announcements from '../components/Announcements';
import Tasks from '../components/Tasks';
import Projects from '../components/Projects';
import Resources from '../components/Resources';
import AdminAnalytics from '../components/AdminAnalytics';
import AuthContext from '../AuthContext';

const UserDashboard = () => {
    const { path } = useRouteMatch();
    const { user } = useContext(AuthContext);

    return (
        <div className="main-layout">
            <SideMenu />
            <div className="content">
                <Switch>
                    <Route exact path={path}>
                        <h2>Welcome to the Dashboard</h2>
                        {user && user.isAdmin && (
                            <AdminAnalytics />
                        )}
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
