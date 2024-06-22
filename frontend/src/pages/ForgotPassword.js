import React, { useState } from 'react';
import SignUpBannerImage from "../assets/aid.jpg";
import "../styles/ForgotPassword.css";
import axios from 'axios';

function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async () => {
        if (formData.email.trim() === '' || formData.password.trim() === '' || formData.confirmPassword.trim() === '') {
            setError('Please fill out all fields.');
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('The email is invalid. Please re-enter email address');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('The passwords do not match. Please re-enter password.');
            return;
        }

        try {
            // Check if email exists
            const response = await axios.get(`http://localhost:8800/users?email=${formData.email}`);
            if (response.data.length === 0) {
                setError('User not found.');
                return;
            }

            // Update password
            await axios.put('http://localhost:8800/forgotpassword', {
                email: formData.email,
                password: formData.password
            });

            // Handle success
            alert('Password updated successfully!');
            window.location.href = '/login';
        } catch (error) {
            console.error('Error updating password:', error);
            setError('Failed to update password. Please try again later.');
        }
    };

    return (
        <div className="forgot-password">
            <div className="splitContainer">
                <div className="leftPanel" style={{ backgroundImage: `url(${SignUpBannerImage})` }}>
                    <h1>Rescue Starts Here</h1>
                    <div className="overlay"></div>
                </div>

                <div className="rightPanel">
                    <div className="formBox">
                        <form>
                            <h2>Forgot Password</h2>

                            <div className="inputbox">
                                <label>Email</label> <br />
                                <input type="email" required placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className="inputbox">
                                <label>New Password</label> <br />
                                <input type="password" required placeholder="Enter password" name="password" value={formData.password} onChange={handleChange} />
                            </div>

                            <div className="inputbox">
                                <label>Confirm New Password</label> <br />
                                <input type="password" required placeholder="Confirm password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                            </div>

                            {error && <div className="error">{error}</div>}

                            <div className="loginhere">
                                <p>
                                    Already have an account? <a href="/login">Log in</a>
                                </p>
                            </div>

                            <button type="button" onClick={handleSubmit}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
