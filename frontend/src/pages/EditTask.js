import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import '../styles/EditTask.css';

const EditTask = () => {
    const { id } = useParams();
    const history = useHistory();
    const [taskTitle, setTaskTitle] = useState('');
    const [assignedTo, setAssignedTo] = useState([]);
    const [dueDate, setDueDate] = useState('');
    const [projectId, setProjectId] = useState('');
    const [subtasks, setSubtasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8800/tasks/${id}`)
            .then(response => {
                const task = response.data;
                setTaskTitle(task.title);
                setAssignedTo(task.assigned_to.split(', '));
                setDueDate(task.due_date.split('T')[0]); // Adjusting date format
                setProjectId(task.project_id); // Set project ID
                setSubtasks(task.subtasks);
            })
            .catch(error => {
                console.error('Error fetching task:', error);
            });

        axios.get('http://localhost:8800/users')
            .then(response => {
                setUsers(response.data.map(user => `${user.first_name} ${user.last_name}`));
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
    }, [id]);

    const handleSubtaskChange = (index, value) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index].title = value;
        setSubtasks(newSubtasks);
    };

    const addSubtask = () => {
        setSubtasks([...subtasks, { title: '', completed: false }]);
    };

    const deleteSubtask = (index) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    };

    const handleMemberChange = (index, value) => {
        const newAssignedTo = [...assignedTo];
        newAssignedTo[index] = value;
        setAssignedTo(newAssignedTo);
    };

    const addMember = () => {
        setAssignedTo([...assignedTo, '']);
    };

    const deleteMember = (index) => {
        if (assignedTo.length > 1) {
            setAssignedTo(assignedTo.filter((_, i) => i !== index));
        } else {
            setError('There should be at least one assigned member.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8800/tasks/${id}`, {
                title: taskTitle,
                assigned_to: assignedTo.join(', '),
                due_date: dueDate,
                project_id: projectId,
                subtasks
            });

            if (response.status === 200) {
                alert('Task updated successfully');
                history.push('/userdashboard/tasks');
            } else {
                alert('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task');
        }
    };

    return (
        <div className="edit-task-container">
            <h2>Edit Task</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Task Title</label>
                    <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Assigned To</label>
                    {assignedTo.map((member, index) => (
                        <div key={index} className="member-group">
                            <select
                                value={member}
                                onChange={(e) => handleMemberChange(index, e.target.value)}
                                required
                            >
                                <option value="">Select a member</option>
                                {users.map((user, userIndex) => (
                                    <option key={userIndex} value={user}>
                                        {user}
                                    </option>
                                ))}
                            </select>
                            <button type="button" onClick={() => deleteMember(index)}>Delete</button>
                        </div>
                    ))}
                    <button type="button" onClick={addMember}>Add Member</button>
                </div>

                <div className="form-group">
                    <label>Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
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

                <div className="form-group">
                    <label>Subtasks</label>
                    {subtasks.map((subtask, index) => (
                        <div key={index} className="subtask-group">
                            <input
                                type="text"
                                value={subtask.title}
                                onChange={(e) => handleSubtaskChange(index, e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => deleteSubtask(index)}>Delete</button>
                        </div>
                    ))}
                    <button type="button" onClick={addSubtask}>Add Subtask</button>
                </div>

                <button className="updateTaskButton" type="submit">Update Task</button>
                <button type="button" onClick={() => history.push('/userdashboard/tasks')} className="return-button">Return to Tasks</button>
            </form>
        </div>
    );
};

export default EditTask;
