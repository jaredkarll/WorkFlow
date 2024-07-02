import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/SideMenu.css';
import AuthContext from '../AuthContext';

const SideMenu = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="side-menu">
            <nav>
                <ul>
                    <li><NavLink exact to="/userdashboard" activeClassName="active">Dashboard</NavLink></li>
                    <li><NavLink to="/userdashboard/announcements" activeClassName="active">Announcements</NavLink></li>
                    <li><NavLink to="/userdashboard/tasks" activeClassName="active">Tasks</NavLink></li>
                    <li><NavLink to="/userdashboard/projects" activeClassName="active">Projects</NavLink></li>
                    <li><NavLink to="/userdashboard/resources" activeClassName="active">Resources</NavLink></li>
                    {user && user.isAdmin && (
                        <>
                            <li><NavLink to="/admindashboard/users" activeClassName="active">Users</NavLink></li>
                            <li><NavLink to="/create-user" activeClassName="active">Create User</NavLink></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default SideMenu;
