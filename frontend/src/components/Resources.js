import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Resources.css';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [file, setFile] = useState(null);
    const [editFileId, setEditFileId] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');

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

    const handleFileChange = (e) => {
        console.log('File selected:', e.target.files[0]);
        setFile(e.target.files[0]);
    };

    const handleProjectChange = (e) => {
        setSelectedProjectId(e.target.value);
    };

    const handleUpload = () => {
        if (!file || !selectedProjectId) {
            console.error('File and project must be selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', selectedProjectId);

        console.log('Uploading file:', file);
        axios.post('http://localhost:8800/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log('File uploaded successfully:', response.data);
            fetchResources(); // Refresh the resource list
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    };

    const handleDelete = (resourceId) => {
        axios.delete(`http://localhost:8800/resources/${resourceId}`)
            .then(() => {
                fetchResources(); // Refresh the resource list
            })
            .catch(error => {
                console.error('Error deleting resource:', error);
            });
    };

    const handleRename = (resourceId) => {
        if (!newFileName) {
            console.error('New file name is required');
            return;
        }

        axios.put(`http://localhost:8800/resources/${resourceId}`, { newFileName })
            .then(() => {
                setEditFileId(null);
                setNewFileName('');
                fetchResources(); // Refresh the resource list
            })
            .catch(error => {
                console.error('Error renaming resource:', error);
            });
    };

    return (
        <div className="resources-page">
            <h2>Resources</h2>
            <div className="upload-section">
                <input type="file" onChange={handleFileChange} />
                <select onChange={handleProjectChange}>
                    <option value="">Select Project</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>
                <button onClick={handleUpload}>Upload</button>
            </div>
            <div className="resources-list">
                <table>
                    <thead>
                        <tr>
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
                                <td>
                                    {editFileId === resource.id ? (
                                        <input
                                            type="text"
                                            value={newFileName}
                                            onChange={(e) => setNewFileName(e.target.value)}
                                        />
                                    ) : (
                                        resource.filename
                                    )}
                                </td>
                                <td><a href={`http://localhost:8800${resource.filepath}`} target="_blank" rel="noopener noreferrer">View File</a></td>
                                <td>{resource.project_name}</td>
                                <td>{resource.project_members}</td>
                                <td>
                                    {editFileId === resource.id ? (
                                        <>
                                            <button onClick={() => handleRename(resource.id)}>Save</button>
                                            <button onClick={() => setEditFileId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => {
                                                setEditFileId(resource.id);
                                                setNewFileName(resource.filename); // Set the initial value of the input
                                            }}>Edit</button>
                                            <button onClick={() => handleDelete(resource.id)}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Resources;
