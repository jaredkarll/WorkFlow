import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import LoginBannerImage from "../assets/aid.jpg";
import "../styles/Sign-up.css"
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Import useHistory

function Login() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const history = useHistory(); // Use useHistory
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
                // Handle success, e.g., show a success message to the user
                alert('You have successfully logged in!');
                setIsLoggedIn(true); // Set isLoggedIn to true
                history.push('/userdash'); // Redirect to the user dashboard using history.push()
            })
            .catch(error => {
                console.error('Error logging in:', error);
                // Handle error, e.g., show an error message to the user
                setError('Error logging in: ' + error.response.data.message);
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
                                <label>Email</label> <br></br>
                                <input type="email" required placeholder="Enter email" name="email" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className="inputbox">
                                <label>Password</label> <br></br>
                                <input type="password" required placeholder="Enter password" id="inputPass" name="password" value={formData.password} onChange={handleChange} />
                                {/* <i id="hide" className="bi bi-eye-slash" onClick={passFunction}></i>
                                <i id="show" className="bi bi-eye" onClick={passFunction}></i> */}
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
