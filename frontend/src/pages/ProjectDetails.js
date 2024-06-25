import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import '../styles/ProjectDetails.css';

const ProjectDetails = () => {
    const { id } = useParams();
    const history = useHistory();
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

    const handleReturnToProjects = () => {
        history.push('/userdashboard/projects');
    };

    if (!project) {
        return <div>Loading...</div>;
    }

    return (
        <div className="project-details">
            <div className="button-container">
                <button className="return-button" onClick={handleReturnToProjects}>Return to Projects</button>
            </div>
            <h2>{project.name}</h2>
            <div className="section">
                <h3>Members:</h3>
                <ul className="members-list">
                    {project.members.map(member => (
                        <li key={member.id}>{member.name}</li>
                    ))}
                </ul>
            </div>
            <div className="section">
                <h3>Progress:</h3>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                </div>
                <span>{project.progress}%</span>
            </div>
            <div className="section">
                <h3>Goals:</h3>
                <p>{project.goals}</p>
            </div>
            <div className="section">
                <h3>Methodology:</h3>
                <p>{project.methodology}</p>
            </div>
        </div>
    );
};

export default ProjectDetails;
