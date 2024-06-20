import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/UserDashboard.css";
import SideMenu from '../components/SideMenu';
import Announcements from '../components/Announcements';

const UserDashboard = () => {
    const [reports, setReports] = useState([]);

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

    return (
        <div className="main-layout">
            <SideMenu />
            <div className="content">
                <div className="announcements-section">
                    <h2>Announcements</h2>
                    <Announcements />
                </div>
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
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="button-container">
                    <Link to="/report" className="report-button">
                        Submit Report
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
