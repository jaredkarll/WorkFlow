import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App';
import LoginBannerImage from "../assets/teamwork-login.png";
import styles from "../styles/Login.module.css"; // Ensure this path is correct and points to the correct CSS file
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const history = useHistory();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (isLoggedIn) {
            history.push('/userdashboard');
        }
    }, [isLoggedIn, history]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        axios.post('http://localhost:8800/loginsubmit', formData)
            .then(response => {
                console.log(response.data);
                alert('You have successfully logged in!');
                setIsLoggedIn(true);
                history.push('/userdashboard');
            })
            .catch(error => {
                console.error('Error logging in:', error);
                setError('Error logging in: ' + (error.response?.data?.message || 'Unknown error'));
            });
    };

    return (
        <div className={styles.signup}>
            <div className={styles.splitContainer}>
                <div className={styles.leftPanel}>
                    <div className={styles.overlay}></div>
                    <img src={LoginBannerImage} alt="Login Banner" />
                    <h1>Rescue Starts Here</h1>
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.formBox}>
                        <form>
                            <h2>Log In</h2>

                            <div className={styles.inputbox}>
                                <label>Email</label>
                                <br />
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.inputbox}>
                                <label>Password</label>
                                <br />
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter password"
                                    id="inputPass"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.passwordreset}>
                                <a href="/forgotpassword">Forgot Password</a>
                            </div>

                            {error && <div className={styles.error}>{error}</div>}

                            <button type="button" onClick={handleSubmit}>Log In</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
