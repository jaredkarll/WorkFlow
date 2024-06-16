import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import LoginBannerImage from "../assets/aid.jpg";
import "../styles/Sign-up.css"
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        axios.post('http://localhost:8800/loginsubmit', formData)
            .then(response => {
                console.log(response.data);
                alert('You have successfully logged in!');
                setIsLoggedIn(true);
                history.push('/userdash');
            })
            .catch(error => {
                console.error('Error logging in:', error);
                setError('Error logging in: ' + (error.response?.data?.message || 'Unknown error'));
            });
    };

    return (
        <div className="signup">
            <div className="splitContainer">
                <div className="leftPanel" style={{ backgroundImage: `url(${LoginBannerImage})` }}>
                    <h1>Rescue Starts Here</h1>
                    <div className="overlay"></div>
                </div>

                <div className="rightPanel">
                    <div className="formBox">
                        <form>
                            <h2>Log In</h2>

                            <div className="inputbox">
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

                            <div className="inputbox">
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

                            <div className="passwordreset">
                                <a href="/forgotpassword">Forgot Password</a>
                            </div>

                            {error && <div className="error">{error}</div>}

                            <button type="button" onClick={handleSubmit}>Log In</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
