import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../styles/ReportDetails.css";

const ReportDetails = ({ match }) => {
    const [report, setReport] = useState(null);
    const reportId = match.params.id; // Get the report ID from URL parameter

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/reports/${reportId}`); // Fetch report details by ID
                const responseData = response.data; // Access response data
                setReport(responseData);
            } catch (error) {
                console.error('Error fetching report details:', error);
            }
        };

        fetchReportDetails();
    }, [reportId]);

    if (!report) {
        return <div>Loading...</div>; // Show loading indicator while fetching report details
    }

    // Render detailed report information here
    return (

        <div className='DetailedReport-container'>
            <Link to="/userdash" className="return-button">
                Return
            </Link>

            <div className="report-details">
                <h2>{report.incidentTitle}</h2>
                <p>Status: {report.status}</p>
                <p>Date: {new Date(report.date).toLocaleString()}</p>
                <p>First Name: {report.firstName}</p>
                <p>Last Name: {report.lastName}</p>
                <p>Sex: {report.sex}</p>
                <p>Date of Birth: {report.dateOfBirth}</p>
                <p>Contact Number: {report.contactNumber}</p>
                <p>Email: {report.email}</p>
                <p>Anonymous Report: {report.reportAsAnonymous ? 'Yes' : 'No'}</p>
                <p>Lot Number: {report.lotNumber}</p>
                <p>Street 1: {report.street1}</p>
                <p>Street 2: {report.street2}</p>
                <p>Barangay: {report.barangay}</p>
                <p>Municipality: {report.municipality}</p>
                <p>Zip Code: {report.zipCode}</p>
                <p>Use Same Saved Address: {report.useSameSavedAddress ? 'Yes' : 'No'}</p>
                <p>Report Type: {report.reportType}</p>
                <p>Report Details: {report.reportDetails}</p>
            </div>
        </div>
    );
};

export default ReportDetails;
