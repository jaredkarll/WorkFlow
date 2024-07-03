import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../styles/AdminAnalytics.css';

const AdminAnalytics = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [tasksData, setTasksData] = useState({ completed: 0, pending: 0 });
    const [fileUploadData, setFileUploadData] = useState([]);

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
                    const completed = tasks.filter(task => task.completed_subtasks === task.total_subtasks).length;
                    const pending = tasks.length - completed;
                    setTasksData({ completed, pending });
                })
                .catch(error => {
                    console.error('Error fetching tasks:', error);
                });

            axios.get(`http://localhost:8800/analytics/files?projectId=${selectedProject}`)
                .then(response => {
                    const uploads = response.data;
                    setFileUploadData(uploads);
                })
                .catch(error => {
                    console.error('Error fetching file uploads:', error);
                });
        }
    }, [selectedProject]);

    const handleProjectChange = (event) => {
        setSelectedProject(event.target.value);
    };

    const pieData = {
        labels: ['Completed Tasks', 'Pending Tasks'],
        datasets: [
            {
                data: [tasksData.completed, tasksData.pending],
                backgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    const lineData = {
        labels: fileUploadData.map(file => new Date(file.upload_date).toLocaleDateString()),
        datasets: [
            {
                label: 'Files Uploaded',
                data: fileUploadData.map((_, index) => index + 1),
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    return (
        <div className={styles.analyticsContainer}>
            <h3>Project Analytics</h3>
            <div className={styles.dropdownContainer}>
                <label htmlFor="projectSelect">Select Project: </label>
                <select id="projectSelect" value={selectedProject} onChange={handleProjectChange}>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.chartsContainer}>
                <div className={styles.chart}>
                    <h4>Task Completion Status</h4>
                    <div style={{ width: '400px', height: '400px' }}>
                        <Pie data={pieData} />
                    </div>
                </div>
                <div className={styles.chart}>
                    <h4>File Upload History</h4>
                    <div style={{ width: '400px', height: '400px' }}>
                        <Line data={lineData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
