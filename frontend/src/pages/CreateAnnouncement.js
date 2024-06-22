import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreateAnnouncement.css';

const CreateAnnouncement = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { title, content } = formData;
            const authorId = 1; // Replace with actual logged-in admin ID
            await axios.post('http://localhost:8800/announcements', { title, content, authorId });
            alert('Announcement created successfully!');
            window.location.href = '/admindash';
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Failed to create announcement.');
        }
    };

    return (
        <div>
            <h2>Create Announcement</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Content</label>
                    <textarea name="content" value={formData.content} onChange={handleChange} required />
                </div>
                <button type="submit">Create Announcement</button>
            </form>
        </div>
    );
};

export default CreateAnnouncement;
