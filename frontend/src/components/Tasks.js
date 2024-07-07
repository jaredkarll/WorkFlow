import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/Tasks.css';
import threeDotsIcon from '../assets/three-dots-icon.png'; // Update the path as necessary

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [showOptions, setShowOptions] = useState({});

    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:8800/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }, []);

    const handleSubtaskToggle = (taskId, subtaskId, completed) => {
        axios.put(`http://localhost:8800/subtasks/${subtaskId}`, { completed: !completed })
            .then(() => {
                setTasks(tasks.map(task => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            subtasks: task.subtasks.map(subtask =>
                                subtask.id === subtaskId ? { ...subtask, completed: !completed } : subtask
                            )
                        };
                    }
                    return task;
                }));
            })
            .catch(error => {
                console.error('Error updating subtask:', error);
            });
    };

    const allSubtasksCompleted = (subtasks) => {
        return subtasks.every(subtask => subtask.completed);
    };

    const handleEditTask = (taskId) => {
        history.push(`/edit-task/${taskId}`);
    };

    const handleDeleteTask = (taskId) => {
        axios.delete(`http://localhost:8800/tasks/${taskId}`)
            .then(() => {
                setTasks(tasks.filter(task => task.id !== taskId));
            })
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    };

    const toggleOptions = (taskId) => {
        setShowOptions({ ...showOptions, [taskId]: !showOptions[taskId] });
    };

    return (
        <div className="tasks-container">
            <h2>Tasks</h2>
            <button className="create-task-button" onClick={() => history.push('/createtask')}>Create New Task</button>
            <div className="tasks-list">
                {tasks.map(task => (
                    <div key={task.id} className="task-card">
                        <div className="task-header">
                            <div className="task-header-info">
                                <h3>{task.title}</h3>
                                <p>Assigned to: {task.assigned_to}</p>
                                <p>Project: {task.project_name}</p>
                                <p>{new Date(task.due_date).toLocaleDateString()}</p>
                            </div>
                            <img
                                src={threeDotsIcon}
                                alt="Options"
                                className="three-dots-icon"
                                onClick={() => toggleOptions(task.id)}
                            />
                            {showOptions[task.id] && (
                                <div className="task-options">
                                    <button onClick={() => handleEditTask(task.id)}>Edit</button>
                                    <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                        <div className="subtasks-list">
                            {task.subtasks.map(subtask => (
                                <div key={subtask.id} className="subtask">
                                    <input
                                        type="checkbox"
                                        checked={subtask.completed}
                                        onChange={() => handleSubtaskToggle(task.id, subtask.id, subtask.completed)}
                                    />
                                    <label>{subtask.title}</label>
                                </div>
                            ))}
                        </div>
                        <div className="task-buttons">
                            <button className={`task-button ${allSubtasksCompleted(task.subtasks) ? 'accomplished' : 'unaccomplished'}`}>
                                {allSubtasksCompleted(task.subtasks) ? 'Accomplished' : 'Unaccomplished'}
                            </button>
                            <button className="task-button view-file">View File</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
