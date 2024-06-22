import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/Tasks.css';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
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

    return (
        <div className="tasks-container">
            <h2>Tasks</h2>
            <button className="create-task-button" onClick={() => history.push('/createtask')}>Create New Task</button>
            <div className="tasks-list">
                {tasks.map(task => (
                    <div key={task.id} className="task-card">
                        <div className="task-header">
                            <h3>{task.title}</h3>
                            <p>Assigned to: {task.assigned_to}</p>
                            <p>{new Date(task.due_date).toLocaleDateString()}</p>
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
