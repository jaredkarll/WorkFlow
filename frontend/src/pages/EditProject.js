import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import '../styles/EditProject.css';

const EditProject = () => {
    const { id } = useParams();
    const history = useHistory();
    const [projectName, setProjectName] = useState('');
    const [progress, setProgress] = useState(0);
    const [goals, setGoals] = useState('');
    const [methodology, setMethodology] = useState('');
    const [members, setMembers] = useState([]);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        // Fetch project details
        axios.get(`http://localhost:8800/projects/${id}`)
            .then(response => {
                const project = response.data;
                setProjectName(project.name);
                setProgress(project.progress);
                setGoals(project.goals);
                setMethodology(project.methodology);
                setMembers(project.members.map(member => ({ id: member.id, name: member.name })));
                console.log('Project fetched:', project);
            })
            .catch(error => {
                console.error('Error fetching project:', error);
            });

        // Fetch user list
        axios.get('http://localhost:8800/users')
            .then(response => {
                setUserList(response.data);
                console.log('Users fetched:', response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, [id]);

    const handleMemberChange = (index, value) => {
        const newMembers = [...members];
        newMembers[index] = value;
        setMembers(newMembers);
    };

    const addMember = () => {
        setMembers([...members, { id: '', name: '' }]);
    };

    const deleteMember = (index) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8800/projects/${id}`, {
                name: projectName,
                progress,
                goals,
                methodology,
                members: members.map(member => member.id)
            });

            if (response.status === 200) {
                alert('Project updated successfully');
                history.push('/userdashboard/projects');
            } else {
                alert('Failed to update project');
            }
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Error updating project');
        }
    };

    return (
        <div className="edit-project-container">
            <h2>Edit Project</h2>
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
                                value={member.id}
                                onChange={(e) => handleMemberChange(index, { id: e.target.value, name: e.target.selectedOptions[0].text })}
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

                <button type="submit">Update Project</button>
                <button type="button" onClick={() => history.push('/userdashboard')} className="return-button">Return to Projects</button>
            </form>
        </div>
    );
};

export default EditProject;
