import React, { useState, } from 'react';
import "../styles/AdminDashboard.css";
import SideMenu from '../components/SideMenu';
import Announcements from '../components/Announcements';
import EditUserForm from '../components/EditUserForm';


const AdminDashboard = () => {
    const [showEditUserForm] = useState(false);
    const [editUserData] = useState(null);




    return (
        <div className="main-layout">
            <SideMenu />
            <div className="content">
                <div className="announcements-section">
                    <h2>Announcements</h2>
                    <Announcements showCreateButton={true} />
                </div>
                {showEditUserForm && <EditUserForm userData={editUserData} />}
                <div className="reports-container">
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
