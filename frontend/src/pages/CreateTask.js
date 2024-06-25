import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/CreateTask.css';

const CreateTask = () => {
    const [taskName, setTaskName] = useState('');
    const [subTasks, setSubTasks] = useState(['']);
    const [assignedTo, setAssignedTo] = useState('');
    const [projectId, setProjectId] = useState('');
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:8800/users')
            .then(response => {
                setUsers(response.data.filter(user => !user.isAdmin)); // Assuming isAdmin is a boolean field
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

        axios.get('http://localhost:8800/projects')
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    }, []);

    const handleSubTaskChange = (index, value) => {
        const newSubTasks = [...subTasks];
        newSubTasks[index] = value;
        setSubTasks(newSubTasks);
    };

    const addSubTask = () => {
        setSubTasks([...subTasks, '']);
    };

    const deleteSubTask = (index) => {
        const newSubTasks = subTasks.filter((_, i) => i !== index);
        setSubTasks(newSubTasks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8800/tasks', {
                title: taskName,
                assigned_to: assignedTo,
                project_id: projectId,
                subtasks: subTasks
            });

            if (response.status === 201) {
                alert('Task created successfully');
                history.push('/userdashboard/tasks');
            } else {
                alert('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Error creating task');
        }
    };

    const handleReturn = () => {
        history.push('/userdashboard/tasks');
    };

    return (
        <div className="create-task-page">
            <div className="create-task-container">
                <h2>Create New Task</h2>
                <form onSubmit={handleSubmit}>
                    <button type="button" onClick={handleReturn} className="return-button">Return to Tasks</button>
                    <div className="form-group">
                        <label>Task Name</label>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Sub Tasks</label>
                        {subTasks.map((subTask, index) => (
                            <div key={index} className="subtask-group">
                                <input
                                    type="text"
                                    value={subTask}
                                    onChange={(e) => handleSubTaskChange(index, e.target.value)}
                                    required
                                />
                                <button type="button" onClick={() => deleteSubTask(index)}>Delete</button>
                            </div>
                        ))}
                        <button type="button" onClick={addSubTask}>Add Sub Task</button>
                    </div>

                    <div className="form-group">
                        <label>Assigned To</label>
                        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
                            <option value="" disabled>Select user</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{`${user.first_name} ${user.last_name}`}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Project</label>
                        <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
                            <option value="" disabled>Select project</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit">Create Task</button>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;
