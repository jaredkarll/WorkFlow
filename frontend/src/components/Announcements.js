import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext'; // // Import the context to use the logged-in user's info
import '../styles/Announcements.css';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const { user } = useContext(AuthContext); // Assume AuthContext provides user info

    useEffect(() => {
        axios.get('http://localhost:8800/announcements')
            .then(response => {
                setAnnouncements(response.data);
            })
            .catch(error => {
                console.error('Error fetching announcements:', error);
            });
    }, []);

    return (
        <div className="announcements-container">
            {user && user.isAdmin && ( // Only show the button if user is an admin
                <Link to="/create-announcement" className="create-announcement-button">Create New Announcement</Link>
            )}
            {announcements.map(announcement => (
                <div key={announcement.id} className="announcement">
                    <h2>{announcement.title}</h2>
                    <p><em>by: {announcement.first_name} {announcement.last_name} | {new Date(announcement.date).toLocaleDateString()}</em></p>
                    <p>{announcement.content}</p>
                </div>
            ))}
        </div>
    );
};

export default Announcements;
