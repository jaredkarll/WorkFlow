import React, { useState, useEffect } from 'react';
import { Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';

const UploadForm = ({ onSuccess }) => {
    const [uploadType, setUploadType] = useState('file');
    const [file, setFile] = useState(null);
    const [link, setLink] = useState('');
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');

    useEffect(() => {
        // Fetch projects to populate the dropdown
        axios.get('http://localhost:8800/projects')
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    }, []);

    const handleInputChange = (event) => {
        if (uploadType === 'file') {
            setFile(event.target.files[0]);
        } else {
            setLink(event.target.value);
        }
    };

    const handleUploadTypeChange = (event) => {
        setUploadType(event.target.value);
        setFile(null);
        setLink('');
    };

    const handleProjectChange = (event) => {
        setSelectedProjectId(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (uploadType === 'file' && file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('projectId', selectedProjectId);

            axios.post('http://localhost:8800/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    alert('File uploaded successfully');
                    onSuccess();
                    clearForm();
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                    alert('Error uploading file');
                });
        } else if (uploadType === 'link' && link) {
            axios.post('http://localhost:8800/upload', { link, projectId: selectedProjectId })
                .then(response => {
                    alert('Link submitted successfully');
                    onSuccess();
                    clearForm();
                })
                .catch(error => {
                    console.error('Error submitting link:', error);
                    alert('Error submitting link');
                });
        } else {
            alert('Please select a file or enter a link');
        }
    };

    const clearForm = () => {
        setFile(null);
        setLink('');
        setSelectedProjectId('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Upload Type</FormLabel>
                <RadioGroup aria-label="upload-type" name="upload-type" value={uploadType} onChange={handleUploadTypeChange} row>
                    <FormControlLabel value="file" control={<Radio />} label="Upload a File" />
                    <FormControlLabel value="link" control={<Radio />} label="Upload a Link" />
                </RadioGroup>
            </FormControl>
            <br />
            {uploadType === 'file' ? (
                <TextField
                    type="file"
                    variant="outlined"
                    fullWidth
                    onChange={handleInputChange}
                />
            ) : (
                <TextField
                    label="Enter Link"
                    variant="outlined"
                    fullWidth
                    value={link}
                    onChange={handleInputChange}
                />
            )}
            <br /><br />
            <FormControl variant="outlined" fullWidth>
                <FormLabel>Select Project</FormLabel>
                <Select value={selectedProjectId} onChange={handleProjectChange}>
                    <MenuItem value="" disabled>Select Project</MenuItem>
                    {projects.map(project => (
                        <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <br /><br />
            <Button className="fileUploadButton" variant="contained" color="primary" type="submit">
                Upload
            </Button>
        </form>
    );
};

export default UploadForm;
