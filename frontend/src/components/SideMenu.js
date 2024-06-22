import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/SideMenu.css';

const SideMenu = () => {
    return (
        <div className="side-menu">
            <nav>
                <ul>
                    <li><NavLink exact to="/userdashboard" activeClassName="active">Dashboard</NavLink></li>
                    <li><NavLink to="/userdashboard/announcements" activeClassName="active">Announcements</NavLink></li>
                    <li><NavLink to="/userdashboard/tasks" activeClassName="active">Tasks</NavLink></li>
                    <li><NavLink to="/userdashboard/projects" activeClassName="active">Projects</NavLink></li>
                    <li><NavLink to="/userdashboard/resources" activeClassName="active">Resources</NavLink></li>
                </ul>
            </nav>
        </div>
    );
};

export default SideMenu;
