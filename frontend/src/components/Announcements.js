import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext';
import '../styles/Announcements.css';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [editAnnouncement, setEditAnnouncement] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = () => {
        axios.get('http://localhost:8800/announcements')
            .then(response => {
                setAnnouncements(response.data);
            })
            .catch(error => {
                console.error('Error fetching announcements:', error);
            });
    };

    const handleEdit = (announcement) => {
        setEditAnnouncement(announcement);
        setTitle(announcement.title);
        setContent(announcement.content);
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:8800/announcements/${editAnnouncement.id}`, { title, content })
            .then(response => {
                setEditAnnouncement(null);
                fetchAnnouncements();
            })
            .catch(error => {
                console.error('Error updating announcement:', error);
            });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this announcement? This action cannot be undone.");
        if (confirmDelete) {
            axios.delete(`http://localhost:8800/announcements/${id}`)
                .then(() => {
                    fetchAnnouncements();
                })
                .catch(error => {
                    console.error('Error deleting announcement:', error);
                });
        }
    };

    return (
        <div className="announcements-page">
            {user && user.isAdmin && (
                <Link to="/create-announcement" className="create-announcement-button">
                    Create New Announcement
                </Link>
            )}
            <div className="announcements-container">
                {announcements.map(announcement => (
                    <div key={announcement.id} className="announcement">
                        <h2>{announcement.title}</h2>
                        <p>
                            <em>
                                by: {announcement.first_name} {announcement.last_name} |
                                {new Date(announcement.date).toLocaleDateString()}
                            </em>
                        </p>
                        <p>{announcement.content}</p>
                        {user && user.isAdmin && (
                            <div className="announcement-actions">
                                <button onClick={() => handleEdit(announcement)}>Edit</button>
                                <button onClick={() => handleDelete(announcement.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {editAnnouncement && (
                <div className="edit-form">
                    <h3>Edit Announcement</h3>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Content:</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={() => setEditAnnouncement(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Announcements;