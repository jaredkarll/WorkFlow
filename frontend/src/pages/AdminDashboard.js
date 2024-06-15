import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
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

    // Function to count reports based on status
    const countReportsByStatus = (status) => {
        return reports.filter(report => report.status === status).length;
    };

    return (
        <div className="admin-dashboard-container">
            <div className="admin-reports-container">
                {reports.map((report, index) => (
                    <Link key={index} to={`/reportdispatch/${report.UserID}`} className="report-link">
                        <div className="admin-report-card">
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
            <div className="admin-report-counter-container">
                {/* Counts the Total Number of Reports */}
                <div className="report-counter">
                    TOTAL NUMBER OF REPORTS: {reports.length}
                </div>

                {/* Breakdown of report statuses */}
                <div className="status-breakdown">
                    <div className="waiting-dispatch">
                        Waiting Dispatch: {countReportsByStatus("Waiting Dispatch")}
                    </div>
                    <div className="rescue-dispatched">
                        Rescue Dispatched: {countReportsByStatus("Rescue Dispatched")}
                    </div>
                    <div className="completed">
                        Completed: {countReportsByStatus("Completed")}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
