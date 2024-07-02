import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../styles/Projects.modules.css';
import CreateProject from '../pages/CreateProject';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [showCreateProject, setShowCreateProject] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        axios.get('http://localhost:8800/projects')
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    };

    const handleCreateProject = () => {
        setShowCreateProject(true);
    };

    const handleCloseCreateProject = (newProject) => {
        setShowCreateProject(false);
        if (newProject) {
            setProjects([...projects, newProject]);
        }
    };

    const handleEditProject = (projectId) => {
        history.push(`/edit-project/${projectId}`);
    };

    const handleDeleteProject = (projectId) => {
        axios.delete(`http://localhost:8800/projects/${projectId}`)
            .then(() => {
                setProjects(projects.filter(project => project.id !== projectId));
            })
            .catch(error => {
                console.error('Error deleting project:', error);
            });
    };

    const handleViewProject = (projectId) => {
        history.push(`/project/${projectId}`);
    };

    return (
        <div className="project-page">
            <h2>PROJECTS</h2>
            <button className="create-project-button" onClick={handleCreateProject}>Create New Project</button>
            {showCreateProject && <CreateProject onClose={handleCloseCreateProject} />}
            <div className="project-list">
                <div className="project-header">
                    <div className="project-column">Project Name:</div>
                    <div className="members-column">Members:</div>
                    <div className="progress-column">Progress:</div>
                    <div className="actions-column">Actions:</div>
                </div>
                {projects.map(project => (
                    <div key={project.id} className="project-row">
                        <div className="project-column">{project.name}</div>
                        <div className="members-column">
                            {(project.members || []).map((member, index) => (
                                <div key={index}>{member.name}</div>
                            ))}
                        </div>
                        <div className="progress-column">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                            </div>
                            <span>{project.progress}%</span>
                        </div>
                        <div className="actions-column">
                            <button onClick={() => handleViewProject(project.id)}>View Project</button>
                            <button onClick={() => handleEditProject(project.id)}>Edit</button>
                            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
