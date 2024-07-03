import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/CreateAnnouncement.module.css'; // Import CSS module
import AuthContext from '../AuthContext';

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
        <div className={styles['create-announcement-container']}>
            <button className={styles['return-button']} onClick={() => history.push('/userdashboard/announcements')}>Return</button>
            <form onSubmit={handleSubmit} className={styles['create-announcement-form']}>
                <h2>Create Announcement</h2>

                <div className={styles['input-box']}>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles['input-box']}>
                    <label>Content</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <div className={styles['error']}>{error}</div>}

                <button className={styles['createAnnouncementButton']} type="submit">Create Announcement</button>
            </form>
        </div>
    );
};

export default CreateAnnouncement;
