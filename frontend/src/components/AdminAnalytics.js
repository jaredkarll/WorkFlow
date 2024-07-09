import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/AdminAnalytics.css'; // Ensure the path is correct

const AdminAnalytics = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [tasksData, setTasksData] = useState({ completed: 0, pending: 0 });
    const [fileData, setFileData] = useState({ labels: [], datasets: [] });
    const [subtasksData, setSubtasksData] = useState({ completed: 0, pending: 0 });

    useEffect(() => {
        axios.get('http://localhost:8800/projects')
            .then(response => {
                setProjects(response.data);
                if (response.data.length > 0) {
                    setSelectedProject(response.data[0].id);
                }
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    }, []);

    useEffect(() => {
        if (selectedProject) {
            axios.get(`http://localhost:8800/analytics/tasks?projectId=${selectedProject}`)
                .then(response => {
                    const tasks = response.data;
                    const completed = tasks.filter(task => task.completed).length;
                    const pending = tasks.length - completed;
                    setTasksData({ completed, pending });
                })
                .catch(error => {
                    console.error('Error fetching tasks:', error);
                });

            axios.get(`http://localhost:8800/analytics/files?projectId=${selectedProject}`)
                .then(response => {
                    const files = response.data;
                    const labels = files.map(file => file.date);
                    const data = files.map(file => file.file_count);

                    setFileData({
                        labels,
                        datasets: [
                            {
                                label: 'Files Uploaded',
                                data,
                                fill: false,
                                backgroundColor: 'rgb(75, 192, 192)',
                                borderColor: 'rgba(75, 192, 192, 0.2)',
                            }
                        ],
                    });
                })
                .catch(error => {
                    console.error('Error fetching file analytics:', error);
                });

            axios.get(`http://localhost:8800/analytics/subtasks?projectId=${selectedProject}`)
                .then(response => {
                    setSubtasksData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching subtasks analytics:', error);
                });
        }
    }, [selectedProject]);

    const handleProjectChange = (event) => {
        setSelectedProject(event.target.value);
    };

    const tasksPieData = {
        labels: ['Completed Tasks', 'Pending Tasks'],
        datasets: [
            {
                data: [tasksData.completed, tasksData.pending],
                backgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    const subtasksPieData = {
        labels: ['Completed Subtasks', 'Pending Subtasks'],
        datasets: [
            {
                data: [subtasksData.completed, subtasksData.pending],
                backgroundColor: ['#36A2EB', '#FFCE56'],
            },
        ],
    };

    return (
        <div className="analyticsContainerCustom">
            <h3>Project Analytics</h3>
            <div className="dropdownContainerCustom">
                <label htmlFor="projectSelect">Select Project: </label>
                <select id="projectSelect" value={selectedProject} onChange={handleProjectChange}>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>
            <table className="chartsTableCustom">
                <tbody>
                    <tr>
                        <td>
                            <h4>Task Completion Status</h4>
                            <div style={{ width: '400px', height: '400px' }}>
                                <Pie data={tasksPieData} />
                            </div>
                        </td>
                        <td>
                            <h4>File Upload Status</h4>
                            <div style={{ width: '400px', height: '200px' }}>
                                <Line data={fileData} />
                            </div>
                        </td>
                        <td>
                            <h4>Subtasks Completion Status</h4>
                            <div style={{ width: '400px', height: '400px' }}>
                                <Pie data={subtasksPieData} />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminAnalytics;
