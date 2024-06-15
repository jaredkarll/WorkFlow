import React, { useState } from 'react';
import SignUpBannerImage from "../assets/aid.jpg";
import "../styles/Sign-up.css";
import axios from 'axios';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
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
        if (formData.name.trim() === '' || formData.email.trim() === '' || formData.password.trim() === '' || formData.confirmPassword.trim() === '') {
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
            // Check if email already exists
            const response = await axios.get(`http://localhost:8800/users?email=${formData.email}`);
            if (response.data.length > 0) {
                setError('User already has an account! Please log in.');
                return;
            }

            // If email doesn't exist, proceed with signup
            await axios.post('http://localhost:8800/signupsubmit', formData);

            // Handle success
            alert('You have successfully signed up!');
            window.location.href = '/login';
        } catch (error) {
            console.error('Error signing up:', error);
            // Handle error, e.g., show an error message to the user
        }
    };


    return (
        <div className="signup">
            <div className="splitContainer">
                <div className="leftPanel" style={{ backgroundImage: `url(${SignUpBannerImage})` }}>
                    <h1>Rescue Starts Here</h1>
                    <div className="overlay"></div>
                </div>

                <div className="rightPanel">
                    <div className="formBox">
                        <form>
                            <h2>Sign Up</h2>
                            <div className="inputbox">
                                <label>Name</label> <br></br>
                                <input type="text" required placeholder="Enter Name" name="name" value={formData.name} onChange={handleChange} />
                            </div>

                            <div className="inputbox">
                                <label>Email</label> <br></br>
                                <input type="email" required placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className="inputbox">
                                <label>Password</label> <br></br>
                                <input type="password" required placeholder="Enter password" name="password" value={formData.password} onChange={handleChange} />
                            </div>

                            <div className="inputbox">
                                <label>Confirm Password</label> <br></br>
                                <input type="password" required placeholder="Confirm password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                            </div>

                            {error && <div className="error">{error}</div>}

                            <div className="loginhere">
                                <p>
                                    Already have an account? <a href="/login">Log in</a>
                                </p>
                            </div>

                            <button type="button" onClick={handleSubmit}>Create Account</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
