// src/pages/ProjectDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/ProjectDetails.css';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8800/projects/${id}`)
            .then(response => {
                setProject(response.data);
            })
            .catch(error => {
                console.error('Error fetching project details:', error);
            });
    }, [id]);

    if (!project) return <div>Loading...</div>;

    return (
        <div className="project-details">
            <h2>{project.name}</h2>
            <div className="section">
                <h3>Goals and Objectives</h3>
                <p>{project.goals}</p>
            </div>
            <div className="section">
                <h3>Methodology</h3>
                <p>{project.methodology}</p>
            </div>
            <div className="section">
                <h3>Members</h3>
                <ul>
                    {project.members.map((member, index) => (
                        <li key={index}>{member}</li>
                    ))}
                </ul>
            </div>
            <div className="section">
                <h3>Progress</h3>
                <p>{project.progress}%</p>
            </div>
        </div>
    );
};

export default ProjectDetails;
