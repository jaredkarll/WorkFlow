import React, { useState, useEffect, useContext } from 'react';
import '../styles/ProfilePage.css';
import AuthContext from '../AuthContext'; // Import AuthContext

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        password: ''
    });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                password: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUser({ ...user, ...formData });
            setEditMode(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page-container">
            <h2 className="ProfilePageTitle">User Profile</h2>
            {!editMode ? (
                <div className="profile-details">
                    <p><strong>First Name:</strong> {user.first_name}</p>
                    <p><strong>Last Name:</strong> {user.last_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <button className="editProfileButton" onClick={() => setEditMode(true)}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="profile-edit-form">
                    <div className="input-box">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="button-group">
                        <button className='saveProfileChangesButton' type="submit">Save Changes</button>
                        <button className='cancelProfileButton' type="button" onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProfilePage;
