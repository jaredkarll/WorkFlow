// src/pages/CreateProject.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CreateProject.css';

const CreateProject = ({ onClose }) => {
    const [projectName, setProjectName] = useState('');
    const [progress, setProgress] = useState(0);
    const [goals, setGoals] = useState('');
    const [methodology, setMethodology] = useState('');
    const [members, setMembers] = useState([]);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8800/users')
            .then(response => {
                setUserList(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const addMember = () => {
        setMembers([...members, '']);
    };

    const handleMemberChange = (index, value) => {
        const newMembers = [...members];
        newMembers[index] = value;
        setMembers(newMembers);
    };

    const deleteMember = (index) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8800/projects', {
                name: projectName,
                progress,
                goals,
                methodology,
                members
            });

            if (response.status === 201) {
                alert('Project created successfully');
                onClose(response.data); // Pass the new project data back to Projects component
            } else {
                alert('Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Error creating project');
        }
    };

    return (
        <div className="create-project-container">
            <h2>Create New Project</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Project Name</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Progress</label>
                    <input
                        type="number"
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Goals and Objectives</label>
                    <textarea
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Methodology</label>
                    <input
                        type="text"
                        value={methodology}
                        onChange={(e) => setMethodology(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Members</label>
                    {members.map((member, index) => (
                        <div key={index} className="member-group">
                            <select
                                value={member}
                                onChange={(e) => handleMemberChange(index, e.target.value)}
                                required
                            >
                                <option value="" disabled>Select user</option>
                                {userList.map(user => (
                                    <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
                                ))}
                            </select>
                            <button type="button" onClick={() => deleteMember(index)}>Delete</button>
                        </div>
                    ))}
                    <button type="button" onClick={addMember}>Add Member</button>
                </div>

                <button type="submit">Create Project</button>
                <button type="button" onClick={() => onClose(null)} className="return-button">Return to Projects</button>
            </form>
        </div>
    );
};

export default CreateProject;
