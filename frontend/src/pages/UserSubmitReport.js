import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import '../styles/UserSubmitReport.css';

const ReportForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        sex: 'Male',
        dateOfBirth: '',
        contactNumber: '',
        email: '',
        reportAsAnonymous: false,
        lotNumber: '',
        street1: '',
        street2: '',
        barangay: '',
        municipality: '',
        zipCode: '',
        useSameSavedAddress: false,
        reportType: '',
        reportDetails: '',
        incidentTitle: ''
    });

    const history = useHistory(); // Initialize useHistory

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if any fields are empty
        const emptyFields = Object.values(formData).some(value => value === '');
        if (emptyFields) {
            window.alert('Please fill out all fields');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8800/submitreport', formData);
            console.log(response.data);
            window.alert("Report submitted successfully!");
            history.push("/userdash");
        } catch (error) {
            console.error('Error submitting report:', error);
            window.alert("Failed to submit report. Please try again later.");
        }
    };

    return (
        <div className='userdashbaord-container'>
            <Link to="/userdash" className="return-button">
                Return
            </Link>


            <form onSubmit={handleSubmit} className="form-container">
                {/* USER INFORMATION SECTION */}
                <div className="form-section">
                    <h2>I. USER INFORMATION</h2>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input id="firstName" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input id="lastName" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sex">Sex</label>
                        <select id="sex" name="sex" value={formData.sex} onChange={handleChange}>
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number</label>
                        <input id="contactNumber" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail Address</label>
                        <input id="email" name="email" placeholder="E-mail Address" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="reportAsAnonymous" checked={formData.reportAsAnonymous} onChange={handleChange} />
                            Report as Anonymous?
                        </label>
                    </div>
                </div>

                {/* INCIDENT ADDRESS INFORMATION SECTION */}
                <div className="form-section">
                    <h2>II. INCIDENT ADDRESS INFORMATION</h2>
                    <div className="form-group">
                        <label htmlFor="lotNumber">Lot Number</label>
                        <input id="lotNumber" name="lotNumber" placeholder="Lot Number" value={formData.lotNumber} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="street1">Street/Village Address 1</label>
                        <input id="street1" name="street1" placeholder="Street/Village Address 1" value={formData.street1} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="street2">Street/Village Address 2</label>
                        <input id="street2" name="street2" placeholder="Street/Village Address 2" value={formData.street2} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="barangay">Barangay</label>
                        <input id="barangay" name="barangay" placeholder="Barangay" value={formData.barangay} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="municipality">Municipality</label>
                        <input id="municipality" name="municipality" placeholder="Municipality" value={formData.municipality} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="zipCode">Zip Code</label>
                        <input id="zipCode" name="zipCode" placeholder="Zip Code" value={formData.zipCode} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="useSameSavedAddress" checked={formData.useSameSavedAddress} onChange={handleChange} />
                            Use Same Saved Address?
                        </label>
                    </div>
                </div>

                {/* INCIDENT INFORMATION SECTION */}
                <div className="form-section">
                    <h2>III. INCIDENT INFORMATION</h2>
                    <div className="form-group">

                        <div className="form-group">
                            <label htmlFor="incidentTitle">Incident Title</label>
                            <input id="incidentTitle" name="incidentTitle" placeholder="Incident Title" value={formData.incidentTitle} onChange={handleChange} />
                        </div>

                        <label htmlFor="reportType">Report Type</label>
                        <select id="reportType" name="reportType" value={formData.reportType} onChange={handleChange}>
                            <option value="">Select Report Type</option>
                            {/* Assuming some options for reportType */}
                            <option value="Incident">Incident</option>
                            <option value="Accident">Accident</option>
                            {/* ... other options */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reportDetails">Report Details</label>
                        <textarea id="reportDetails" name="reportDetails" placeholder="Please type report details here" value={formData.reportDetails} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <button type="submit">Submit Report</button>
                </div>
            </form>
        </div>
    );
};

export default ReportForm;
