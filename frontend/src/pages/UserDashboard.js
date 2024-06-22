import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import "../styles/UserDashboard.css";
import SideMenu from '../components/SideMenu';
import Announcements from '../components/Announcements';
import Tasks from '../components/Tasks';

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
                    {/* Add more routes as needed */}
                </Switch>
            </div>
        </div>
    );
};

export default UserDashboard;
