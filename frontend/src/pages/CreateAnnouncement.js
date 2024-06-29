import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../AuthContext'; //
import { useHistory } from 'react-router-dom';
import '../styles/CreateAnnouncement.css';

const CreateAnnouncement = () => {
    const { user } = useContext(AuthContext);
    const history = useHistory();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        authorId: user ? user.id : null
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8800/announcements', formData)
            .then(response => {
                alert('Announcement created successfully!');
                history.push('/admindashboard');
            })
            .catch(error => {
                console.error('Error creating announcement:', error);
                setError('Error creating announcement: ' + (error.response?.data?.message || 'Unknown error'));
            });
    };

    return (
        <div className="create-announcement-container">
            <form onSubmit={handleSubmit}>
                <h2>Create Announcement</h2>

                <div className="input-box">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-box">
                    <label>Content</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <div className="error">{error}</div>}

                <button type="submit">Create Announcement</button>
            </form>
        </div>
    );
};

export default CreateAnnouncement;
