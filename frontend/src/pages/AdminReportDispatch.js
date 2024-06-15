import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams, Link } from 'react-router-dom';
import "../styles/ReportDetails.css";

const AdminReportDispatch = () => {
    const [report, setReport] = useState(null);
    const [status, setStatus] = useState('');
    const { id } = useParams(); // Get the report ID from URL parameter
    const history = useHistory();

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/reports/${id}`);
                const responseData = response.data;
                setReport(responseData);
                setStatus(responseData.status); // Set initial status
            } catch (error) {
                console.error('Error fetching report details:', error);
            }
        };

        fetchReportDetails();
    }, [id]);

    const handleStatusChange = async () => {
        try {
            const response = await axios.put(`http://localhost:8800/reports/${id}`, { status });
            console.log(response.data);
            alert("Report status updated successfully.");
            // Redirect to admin dashboard or any other desired route
            history.push("/admindash");
        } catch (error) {
            console.error('Error updating report status:', error);
            alert("Error updating report status. Please try again.");
        }
    };

    if (!report) {
        return <div>Loading...</div>;
    }

    return (

        <div className='DetailedReport-container'>
            <Link to="/admindash" className="return-button">
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

                <div className="status-update">
                    <label htmlFor="status">Update Status:</label>
                    <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Waiting Dispatch">Waiting Dispatch</option>
                        <option value="Rescue Dispatched">Rescue Dispatched</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button onClick={handleStatusChange}>Update Status</button>
                </div>

            </div>
        </div>
    );
};

export default AdminReportDispatch;
