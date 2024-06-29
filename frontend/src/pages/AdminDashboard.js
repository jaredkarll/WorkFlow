import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/AdminDashboard.css";
import SideMenu from '../components/SideMenu';
import Announcements from '../components/Announcements';
import CreateUserForm from '../components/CreateUserForm';
import EditUserForm from '../components/EditUserForm';
import AuthContext from '../AuthContext'; // // Import AuthContext

const AdminDashboard = () => {
    const [reports, setReports] = useState([]);
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [showEditUserForm, setShowEditUserForm] = useState(false);
    const [editUserData, setEditUserData] = useState(null);
    const { user } = useContext(AuthContext); // Use AuthContext

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await axios.get('http://localhost:8800/reports');
                setReports(data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, []);

    const toggleCreateUserForm = () => {
        setShowCreateUserForm(!showCreateUserForm);
    };

    const toggleEditUserForm = (userData) => {
        setEditUserData(userData);
        setShowEditUserForm(!showEditUserForm);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8800/deleteuser/${userId}`, { data: { userId: user.id } });
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    return (
        <div className="main-layout">
            <SideMenu />
            <div className="content">
                <div className="announcements-section">
                    <h2>Announcements</h2>
                    <Announcements showCreateButton={true} />
                </div>
                {user && user.isAdmin && ( // Check if user is admin
                    <div>
                        <button onClick={toggleCreateUserForm}>Create User</button>
                        {showCreateUserForm && <CreateUserForm />}
                    </div>
                )}
                {showEditUserForm && <EditUserForm userData={editUserData} />}
                <div className="reports-container">
                    {reports.map((report, index) => (
                        <Link key={index} to={`/report/${report.UserID}`} className="report-link">
                            <div className="report-card">
                                <div className="report-header">
                                    <h3>{report.incidentTitle}</h3>
                                    <span className={`status-tag ${report.status ? report.status.toLowerCase() : 'default'}`}>
                                        {report.status || 'Default Status'}
                                    </span>
                                </div>
                                <p>
                                    Address: {report.street1}, {report.barangay}, {report.municipality}<br />
                                    Report Type: {report.reportType}<br />
                                    Date: {new Date(report.date).toLocaleString()}
                                </p>
                                {user && user.isAdmin && ( // Check if user is admin
                                    <div>
                                        <button onClick={() => toggleEditUserForm(report)}>Edit</button>
                                        <button onClick={() => handleDeleteUser(report.UserID)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
