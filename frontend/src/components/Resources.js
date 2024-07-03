import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Resources.css';
import UploadForm from '../pages/UploadForm';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [projects, setProjects] = useState([]);
    const [editResource, setEditResource] = useState(null);
    const [editFilename, setEditFilename] = useState('');
    const [editLink, setEditLink] = useState('');

    useEffect(() => {
        fetchResources();
        fetchProjects();
    }, []);

    const fetchResources = () => {
        axios.get('http://localhost:8800/resources')
            .then(response => {
                setResources(response.data);
            })
            .catch(error => {
                console.error('Error fetching resources:', error);
            });
    };

    const fetchProjects = () => {
        axios.get('http://localhost:8800/projects')
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    };

    const handleEdit = (resource) => {
        setEditResource(resource);
        setEditFilename(resource.filename || '');
        setEditLink(resource.link || '');
    };

    const handleUpdate = () => {
        const payload = {
            newFileName: editFilename,
            newLink: editLink
        };
        axios.put(`http://localhost:8800/resources/${editResource.id}`, payload)
            .then(response => {
                setEditResource(null);
                fetchResources();
            })
            .catch(error => {
                console.error('Error updating resource:', error);
            });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this resource? This action cannot be undone.");
        if (confirmDelete) {
            axios.delete(`http://localhost:8800/resources/${id}`)
                .then(() => {
                    fetchResources();
                })
                .catch(error => {
                    console.error('Error deleting resource:', error);
                });
        }
    };

    const handleUploadSuccess = () => {
        fetchResources();
    };

    return (
        <div className="resources-page">
            <h2>Resources</h2>
            <UploadForm
                onSuccess={handleUploadSuccess}
                projects={projects}
            />
            <div className="resources-list">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>File Name</th>
                            <th>Link</th>
                            <th>Project</th>
                            <th>Members</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map(resource => (
                            <tr key={resource.id}>
                                <td>{resource.id}</td>
                                <td>{resource.filename}</td>
                                <td>
                                    {resource.link ? (
                                        <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                            {resource.link}
                                        </a>
                                    ) : (
                                        <a href={`http://localhost:8800${resource.filepath}`} target="_blank" rel="noopener noreferrer">
                                            View File
                                        </a>
                                    )}
                                </td>
                                <td>{resource.project_name}</td>
                                <td>{resource.project_members}</td>
                                <td>
                                    <button className="editResourceButton" onClick={() => handleEdit(resource)}>Edit</button>
                                    <button className="deleteResourceButton" onClick={() => handleDelete(resource.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editResource && (
                <div className="edit-form">
                    <h3>Edit Resource</h3>
                    <div>
                        <label>Filename:</label>
                        <input
                            type="text"
                            value={editFilename}
                            onChange={(e) => setEditFilename(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Link:</label>
                        <input
                            type="text"
                            value={editLink}
                            onChange={(e) => setEditLink(e.target.value)}
                        />
                    </div>
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={() => setEditResource(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Resources;
