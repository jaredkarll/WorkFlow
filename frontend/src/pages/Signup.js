import React, { useState } from 'react';
import SignUpBannerImage from "../assets/teamwork-login.png";
import styles from "../styles/Signup.module.css";
import axios from 'axios';

function Signup() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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
        if (formData.firstName.trim() === '' || formData.lastName.trim() === '' || formData.email.trim() === '' || formData.password.trim() === '' || formData.confirmPassword.trim() === '') {
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
            setError('Failed to sign up. Please try again later.');
        }
    };

    return (
        <div className={styles.signup}>
            <div className={styles.splitContainer}>
                <div className={styles.leftPanel}>
                    <div className={styles.overlay}></div>
                    <img src={SignUpBannerImage} alt="Sign Up Banner" />
                    <h1>Achieving Great Things</h1>
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.formBox}>
                        <form>
                            <h2>Sign Up</h2>
                            <div className={styles.inputbox}>
                                <label>First Name</label>
                                <input type="text" required placeholder="Enter First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                            </div>

                            <div className={styles.inputbox}>
                                <label>Last Name</label>
                                <input type="text" required placeholder="Enter Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                            </div>

                            <div className={styles.inputbox}>
                                <label>Email</label>
                                <input type="email" required placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className={styles.inputbox}>
                                <label>Password</label>
                                <input type="password" required placeholder="Enter password" name="password" value={formData.password} onChange={handleChange} />
                            </div>

                            <div className={styles.inputbox}>
                                <label>Confirm Password</label>
                                <input type="password" required placeholder="Confirm password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                            </div>

                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.loginhere}>
                                <p>
                                    Already have an account? <a href="/login">Log in</a>
                                </p>
                            </div>

                            <button className="createAccountButton" type="button" onClick={handleSubmit}>Create Account</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
