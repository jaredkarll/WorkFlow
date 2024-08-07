const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8800;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connectDB = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'workflow'
});

connectDB.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
    connection.release();
});

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });


app.post('/upload', upload.single('file'), (req, res) => {
    const { projectId, link, uploaderId } = req.body;

    if (!projectId || !uploaderId) {
        return res.status(400).json({ message: 'Project ID and Uploader ID are required' });
    }

    if (link) {
        const query = 'INSERT INTO files (project_id, uploader_id, type, link) VALUES (?, ?, ?, ?)';
        connectDB.query(query, [projectId, uploaderId, 'link', link], (err, result) => {
            if (err) {
                console.error('Error storing link metadata in database:', err);
                return res.status(500).json({ message: 'Error storing link metadata' });
            }
            res.status(201).json({ message: 'Link submitted successfully' });
        });
    } else if (req.file) {
        const filePath = `/uploads/${req.file.filename}`;
        const filename = req.file.filename;

        const query = 'INSERT INTO files (project_id, uploader_id, type, filename, filepath) VALUES (?, ?, ?, ?, ?)';
        connectDB.query(query, [projectId, uploaderId, 'file', filename, filePath], (err, result) => {
            if (err) {
                console.error('Error storing file metadata in database:', err);
                return res.status(500).json({ message: 'Error storing file metadata' });
            }
            res.status(201).json({ filePath });
        });
    } else {
        res.status(400).json({ message: 'No file uploaded or link provided' });
    }
});

app.get('/resources', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const query = `
        SELECT f.id, f.filename, f.filepath, f.link, f.upload_date, p.name as project_name,
               GROUP_CONCAT(DISTINCT CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', ') as project_members,
               CONCAT(uploader.first_name, ' ', uploader.last_name) as uploader
        FROM files f
        JOIN projects p ON f.project_id = p.id
        JOIN project_members pm ON p.id = pm.project_id
        JOIN users u ON pm.user_id = u.id
        JOIN users uploader ON f.uploader_id = uploader.id
        WHERE p.id IN (
                    SELECT project_id FROM project_members WHERE user_id = ?
                )
        GROUP BY f.id, f.filename, f.filepath, f.link, f.upload_date, p.name, uploader.first_name, uploader.last_name;
    `;
    connectDB.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching resources:', err);
            return res.status(500).json({ message: 'Error fetching resources' });
        }
        console.log('Fetched resources:', results);
        res.status(200).json(results);
    });
});


app.delete('/resources/:id', (req, res) => {
    const fileId = req.params.id;
    console.log(`Deleting resource with ID: ${fileId}`);

    const getFileQuery = 'SELECT type, filepath FROM files WHERE id = ?';
    connectDB.query(getFileQuery, [fileId], (err, results) => {
        if (err) {
            console.error('Error fetching file:', err);
            return res.status(500).json({ message: 'Error fetching file' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        const { type, filepath } = results[0];
        if (type === 'file') {
            const filePath = path.join(__dirname, filepath);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({ message: 'Error deleting file' });
                }

                const deleteFileQuery = 'DELETE FROM files WHERE id = ?';
                connectDB.query(deleteFileQuery, [fileId], (err) => {
                    if (err) {
                        console.error('Error deleting file metadata:', err);
                        return res.status(500).json({ message: 'Error deleting file metadata' });
                    }
                    res.status(200).json({ message: 'File deleted successfully' });
                });
            });
        } else {
            const deleteFileQuery = 'DELETE FROM files WHERE id = ?';
            connectDB.query(deleteFileQuery, [fileId], (err) => {
                if (err) {
                    console.error('Error deleting link metadata:', err);
                    return res.status(500).json({ message: 'Error deleting link metadata' });
                }
                res.status(200).json({ message: 'Link deleted successfully' });
            });
        }
    });
});

app.put('/resources/:id', (req, res) => {
    const fileId = req.params.id;
    const { newFileName, newLink } = req.body;

    const getFileQuery = 'SELECT type, filename, filepath FROM files WHERE id = ?';
    connectDB.query(getFileQuery, [fileId], (err, results) => {
        if (err) {
            console.error('Error fetching file:', err);
            return res.status(500).json({ message: 'Error fetching file' });
        }

        const { type, filename, filepath } = results[0];
        if (type === 'file' && newFileName) {
            const oldFilePath = path.join(__dirname, filepath);
            const newFilePath = path.join(__dirname, 'uploads', newFileName);

            fs.rename(oldFilePath, newFilePath, (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                    return res.status(500).json({ message: 'Error renaming file' });
                }

                const updateFileQuery = 'UPDATE files SET filename = ?, filepath = ? WHERE id = ?';
                connectDB.query(updateFileQuery, [newFileName, `/uploads/${newFileName}`, fileId], (err) => {
                    if (err) {
                        console.error('Error updating file metadata:', err);
                        return res.status(500).json({ message: 'Error updating file metadata' });
                    }
                    res.status(200).json({ message: 'File renamed successfully' });
                });
            });
        } else if (type === 'link' && newLink) {
            const updateFileQuery = 'UPDATE files SET link = ? WHERE id = ?';
            connectDB.query(updateFileQuery, [newLink, fileId], (err) => {
                if (err) {
                    console.error('Error updating link metadata:', err);
                    return res.status(500).json({ message: 'Error updating link metadata' });
                }
                res.status(200).json({ message: 'Link updated successfully' });
            });
        } else {
            res.status(400).json({ message: 'Invalid update request' });
        }
    });
});

app.get('/projects/:id/members', (req, res) => {
    const projectId = req.params.id;

    const query = `
        SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name
        FROM project_members pm
        JOIN users u ON pm.user_id = u.id
        WHERE pm.project_id = ?;
    `;
    connectDB.query(query, [projectId], (err, results) => {
        if (err) {
            console.error('Error fetching project members:', err);
            return res.status(500).json({ message: 'Error fetching project members' });
        }
        res.status(200).json(results);
    });
});

// User signup endpoint
app.post('/signupsubmit', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    connectDB.query(query, [firstName, lastName, email, password], (error) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// User login endpoint
app.post('/loginsubmit', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    connectDB.query(query, [email, password], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        if (results.length > 0) {
            const user = results[0];
            return res.status(200).json({ message: 'Login successful', user });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

// Endpoint to fetch announcements
app.get('/announcements', (req, res) => {
    const query = 'SELECT a.*, u.first_name, u.last_name FROM announcements a LEFT JOIN users u ON a.author_id = u.id ORDER BY date DESC';
    connectDB.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        res.status(200).json(results);
    });
});

// Endpoint to create an announcement
app.post('/announcements', (req, res) => {
    const { title, content, authorId } = req.body;

    // First, verify if the user is an admin
    const checkAdminQuery = 'SELECT isAdmin FROM users WHERE id = ?';
    connectDB.query(checkAdminQuery, [authorId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        if (results[0].isAdmin) {
            const query = 'INSERT INTO announcements (title, content, author_id) VALUES (?, ?, ?)';
            connectDB.query(query, [title, content, authorId], (error) => {
                if (error) {
                    return res.status(500).json({ message: 'Database query failed' });
                }
                res.status(201).json({ message: 'Announcement created successfully' });
            });
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    });
});

// Endpoint to update an announcement
app.put('/announcements/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const query = 'UPDATE announcements SET title = ?, content = ? WHERE id = ?';
    connectDB.query(query, [title, content, id], (error, results) => {
        if (error) {
            console.error('Error updating announcement:', error);
            return res.status(500).json({ message: 'Error updating announcement' });
        }
        res.status(200).json({ message: 'Announcement updated successfully' });
    });
});

// Endpoint to delete an announcement
app.delete('/announcements/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM announcements WHERE id = ?';
    connectDB.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error deleting announcement:', error);
            return res.status(500).json({ message: 'Error deleting announcement' });
        }
        res.status(200).json({ message: 'Announcement deleted successfully' });
    });
});

// Endpoint to handle forgotten password
app.put('/forgotpassword', (req, res) => {
    const { email, password } = req.body;
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    connectDB.query(query, [password, email], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        if (results.affectedRows > 0) {
            return res.status(200).json({ message: 'Password updated successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    });
});

// Endpoint to fetch tasks with subtasks
app.get('/tasks', (req, res) => {
    const query = `
        SELECT t.id as task_id, t.title, t.assigned_to, t.due_date,
               s.id as subtask_id, s.title as subtask_title, s.completed,
               p.name as project_name
        FROM tasks t
        LEFT JOIN subtasks s ON t.id = s.task_id
        LEFT JOIN projects p ON t.project_id = p.id
    `;
    connectDB.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }

        const tasks = [];
        results.forEach(row => {
            const taskIndex = tasks.findIndex(task => task.id === row.task_id);
            if (taskIndex === -1) {
                tasks.push({
                    id: row.task_id,
                    title: row.title,
                    assigned_to: row.assigned_to,
                    due_date: row.due_date,
                    project_name: row.project_name,
                    subtasks: row.subtask_id ? [{ id: row.subtask_id, title: row.subtask_title, completed: row.completed }] : []
                });
            } else {
                tasks[taskIndex].subtasks.push({ id: row.subtask_id, title: row.subtask_title, completed: row.completed });
            }
        });

        res.status(200).json(tasks);
    });
});


// Add this endpoint to update a task by ID
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, assigned_to, project_id, due_date, subtasks } = req.body;

    const updateTaskQuery = 'UPDATE tasks SET title = ?, assigned_to = ?, project_id = ?, due_date = ? WHERE id = ?';
    connectDB.query(updateTaskQuery, [title, assigned_to, project_id, due_date, id], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ message: 'Error updating task' });
        }

        const deleteSubtasksQuery = 'DELETE FROM subtasks WHERE task_id = ?';
        connectDB.query(deleteSubtasksQuery, [id], (deleteErr) => {
            if (deleteErr) {
                console.error('Error deleting subtasks:', deleteErr);
                return res.status(500).json({ message: 'Error deleting subtasks' });
            }

            const insertSubtasksQuery = 'INSERT INTO subtasks (task_id, title, completed) VALUES ?';
            const subtasksData = subtasks.map(subtask => [id, subtask.title, subtask.completed]);

            connectDB.query(insertSubtasksQuery, [subtasksData], (insertErr) => {
                if (insertErr) {
                    console.error('Error inserting subtasks:', insertErr);
                    return res.status(500).json({ message: 'Error inserting subtasks' });
                }

                res.status(200).json({ message: 'Task updated successfully' });
            });
        });
    });
});

// Add this endpoint to fetch a task by ID
app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;

    const taskQuery = `
        SELECT t.id as task_id, t.title, t.assigned_to, t.due_date,
               s.id as subtask_id, s.title as subtask_title, s.completed
        FROM tasks t
        LEFT JOIN subtasks s ON t.id = s.task_id
        WHERE t.id = ?
    `;
    connectDB.query(taskQuery, [id], (err, results) => {
        if (err) {
            console.error('Error fetching task:', err);
            return res.status(500).json({ message: 'Error fetching task' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const task = {
            id: results[0].task_id,
            title: results[0].title,
            assigned_to: results[0].assigned_to,
            due_date: results[0].due_date,
            subtasks: results.filter(row => row.subtask_id).map(row => ({
                id: row.subtask_id,
                title: row.subtask_title,
                completed: row.completed
            }))
        };

        res.status(200).json(task);
    });
});

// Endpoint to update subtask status
app.put('/subtasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    const query = 'UPDATE subtasks SET completed = ? WHERE id = ?';
    connectDB.query(query, [completed, id], (error) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        res.status(200).json({ message: 'Subtask status updated successfully' });
    });
});

// Endpoint to create a task with subtasks
app.post('/tasks', (req, res) => {
    const { title, assigned_to, project_id, subtasks } = req.body;

    console.log('Received payload:', req.body); // Add logging to verify the received payload

    connectDB.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection failed:', err);
            return res.status(500).json({ message: 'Database connection failed' });
        }

        const taskQuery = 'INSERT INTO tasks (title, assigned_to, project_id, due_date) VALUES (?, ?, ?, NOW())';
        connection.query(taskQuery, [title, assigned_to, project_id], (taskError, taskResults) => {
            if (taskError) {
                connection.release();
                console.error('Task creation failed:', taskError);
                return res.status(500).json({ message: 'Task creation failed' });
            }

            const taskId = taskResults.insertId;
            const subtaskQueries = subtasks.map(subtask => {
                return new Promise((resolve, reject) => {
                    const subtaskQuery = 'INSERT INTO subtasks (task_id, title, completed) VALUES (?, ?, 0)';
                    connection.query(subtaskQuery, [taskId, subtask.title], (subtaskError) => {
                        if (subtaskError) {
                            reject(subtaskError);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            Promise.all(subtaskQueries)
                .then(() => {
                    connection.release();
                    res.status(201).json({ message: 'Task created successfully' });
                })
                .catch(subtaskError => {
                    connection.release();
                    console.error('Subtask creation failed:', subtaskError);
                    res.status(500).json({ message: 'Subtask creation failed' });
                });
        });
    });
});


// Endpoint to delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;

    const deleteSubtasksQuery = 'DELETE FROM subtasks WHERE task_id = ?';
    const deleteTaskQuery = 'DELETE FROM tasks WHERE id = ?';

    connectDB.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Database connection failed' });
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return res.status(500).json({ message: 'Transaction failed' });
            }

            connection.query(deleteSubtasksQuery, [id], (subtaskError) => {
                if (subtaskError) {
                    connection.rollback(() => {
                        connection.release();
                        return res.status(500).json({ message: 'Failed to delete subtasks' });
                    });
                } else {
                    connection.query(deleteTaskQuery, [id], (taskError) => {
                        if (taskError) {
                            connection.rollback(() => {
                                connection.release();
                                return res.status(500).json({ message: 'Failed to delete task' });
                            });
                        } else {
                            connection.commit((commitError) => {
                                if (commitError) {
                                    connection.rollback(() => {
                                        connection.release();
                                        return res.status(500).json({ message: 'Commit failed' });
                                    });
                                } else {
                                    connection.release();
                                    return res.status(200).json({ message: 'Task deleted successfully' });
                                }
                            });
                        }
                    });
                }
            });
        });
    });
});

// Endpoint to fetch projects
app.get('/projects', (req, res) => {
    const query = `
        SELECT p.id, p.name, p.progress,
               GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ';') as members
        FROM projects p
        LEFT JOIN project_members pm ON p.id = pm.project_id
        LEFT JOIN users u ON pm.user_id = u.id
        GROUP BY p.id;
    `;
    connectDB.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }

        const projects = results.map(project => ({
            id: project.id,
            name: project.name,
            progress: project.progress,
            members: project.members ? project.members.split(';').map(name => ({ name })) : []
        }));

        res.status(200).json(projects);
    });
});

// Endpoint to fetch project details
app.get('/projects/:id', (req, res) => {
    const { id } = req.params;

    const projectQuery = `
        SELECT p.id, p.name, p.progress, p.goals, p.methodology,
               GROUP_CONCAT(u.id, ',', u.first_name, ' ', u.last_name SEPARATOR ';') AS members
        FROM projects p
        LEFT JOIN project_members pm ON p.id = pm.project_id
        LEFT JOIN users u ON pm.user_id = u.id
        WHERE p.id = ?
        GROUP BY p.id
    `;

    connectDB.query(projectQuery, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const project = results[0];
        project.members = project.members ? project.members.split(';').map(member => {
            const [id, name] = member.split(',');
            return { id, name };
        }) : [];

        res.status(200).json(project);
    });
});

// Endpoint to fetch projects for a specific user
app.get('/user-projects', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        console.log('User ID is missing');
        return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Fetching projects for user ID:', userId);

    const query = `
        SELECT p.id, p.name
        FROM projects p
        JOIN project_members pm ON p.id = pm.project_id
        WHERE pm.user_id = ?
        GROUP BY p.id, p.name;
    `;
    connectDB.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching projects:', err);
            return res.status(500).json({ message: 'Error fetching projects' });
        }

        console.log('Fetched projects:', results);
        res.status(200).json(results);
    });
});


// Endpoint to edit a project
app.put('/projects/:id', (req, res) => {
    const { id } = req.params;
    const { name, progress, goals, methodology, members } = req.body;

    connectDB.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Database connection failed' });
        }

        const projectQuery = 'UPDATE projects SET name = ?, progress = ?, goals = ?, methodology = ? WHERE id = ?';
        connection.query(projectQuery, [name, progress, goals, methodology, id], (projectError) => {
            if (projectError) {
                connection.release();
                return res.status(500).json({ message: 'Project update failed' });
            }

            const deleteMembersQuery = 'DELETE FROM project_members WHERE project_id = ?';
            connection.query(deleteMembersQuery, [id], (deleteError) => {
                if (deleteError) {
                    connection.release();
                    return res.status(500).json({ message: 'Failed to delete old project members' });
                }

                const memberQueries = members.map(member => {
                    return new Promise((resolve, reject) => {
                        const memberQuery = 'INSERT INTO project_members (project_id, user_id) VALUES (?, ?)';
                        connection.query(memberQuery, [id, member], (memberError) => {
                            if (memberError) {
                                reject(memberError);
                            } else {
                                resolve();
                            }
                        });
                    });
                });

                Promise.all(memberQueries)
                    .then(() => {
                        connection.release();
                        res.status(200).json({ message: 'Project updated successfully' });
                    })
                    .catch(memberError => {
                        connection.release();
                        res.status(500).json({ message: 'Project member update failed' });
                    });
            });
        });
    });
});

// Endpoint to delete a project
app.delete('/projects/:id', (req, res) => {
    const { id } = req.params;

    connectDB.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Database connection failed' });
        }

        const deleteMembersQuery = 'DELETE FROM project_members WHERE project_id = ?';
        connection.query(deleteMembersQuery, [id], (deleteMembersError) => {
            if (deleteMembersError) {
                connection.release();
                return res.status(500).json({ message: 'Failed to delete project members' });
            }

            const deleteProjectQuery = 'DELETE FROM projects WHERE id = ?';
            connection.query(deleteProjectQuery, [id], (deleteProjectError) => {
                if (deleteProjectError) {
                    connection.release();
                    return res.status(500).json({ message: 'Project deletion failed' });
                }

                connection.release();
                res.status(200).json({ message: 'Project deleted successfully' });
            });
        });
    });
});

// Endpoint to fetch all users (excluding admin users if needed)
app.get('/users', (req, res) => {
    const query = 'SELECT id, first_name, last_name, email FROM users WHERE isAdmin = 0';
    connectDB.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        res.status(200).json(results);
    });
});

// Endpoint to create a new project
app.post('/projects', (req, res) => {
    const { name, progress, goals, methodology, members } = req.body;

    if (!name || !goals || !methodology || !Array.isArray(members)) {
        return res.status(400).json({ message: 'Invalid project data' });
    }

    connectDB.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection failed:', err);
            return res.status(500).json({ message: 'Database connection failed' });
        }

        const createProjectQuery = 'INSERT INTO projects (name, progress, goals, methodology) VALUES (?, ?, ?, ?)';
        connection.query(createProjectQuery, [name, progress, goals, methodology], (projectError, projectResults) => {
            if (projectError) {
                connection.release();
                console.error('Project creation failed:', projectError);
                return res.status(500).json({ message: 'Project creation failed' });
            }

            const projectId = projectResults.insertId;
            const memberQueries = members.map(memberId => {
                return new Promise((resolve, reject) => {
                    const addMemberQuery = 'INSERT INTO project_members (project_id, user_id) VALUES (?, ?)';
                    connection.query(addMemberQuery, [projectId, memberId], (memberError) => {
                        if (memberError) {
                            reject(memberError);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            Promise.all(memberQueries)
                .then(() => {
                    connection.release();
                    res.status(201).json({ id: projectId, name, progress, goals, methodology, members });
                })
                .catch(memberError => {
                    connection.release();
                    console.error('Project member addition failed:', memberError);
                    res.status(500).json({ message: 'Project member addition failed' });
                });
        });
    });
});


// Endpoint to create a new user (admin only)
app.post('/createuser', (req, res) => {
    const { firstName, lastName, email, password, isAdmin, userId } = req.body;

    // Verify if the user is an admin
    const checkAdminQuery = 'SELECT isAdmin FROM users WHERE id = ?';
    connectDB.query(checkAdminQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        if (results.length > 0 && results[0].isAdmin) {
            const query = 'INSERT INTO users (first_name, last_name, email, password, isAdmin) VALUES (?, ?, ?, ?, ?)';
            connectDB.query(query, [firstName, lastName, email, password, isAdmin], (error) => {
                if (error) {
                    return res.status(500).json({ message: 'Database query failed' });
                }
                res.status(201).json({ message: 'User created successfully' });
            });
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    });
});

// Endpoint to update a user (admin only)
app.put('/updateuser/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, password, isAdmin, userId } = req.body; // userId is the admin's user ID

    // Verify if the user is an admin
    const checkAdminQuery = 'SELECT isAdmin FROM users WHERE id = ?';
    connectDB.query(checkAdminQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        if (results.length > 0 && results[0].isAdmin) {
            const query = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ?, isAdmin = ? WHERE id = ?';
            connectDB.query(query, [firstName, lastName, email, password, isAdmin, id], (error) => {
                if (error) {
                    return res.status(500).json({ message: 'Database query failed' });
                }
                res.status(200).json({ message: 'User updated successfully' });
            });
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    });
});

// Endpoint to fetch all users
app.get('/users', (req, res) => {
    const query = 'SELECT id, first_name, last_name, email, isAdmin FROM users';
    connectDB.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        res.status(200).json(results);
    });
});

// Endpoint to delete a user (admin only)
app.delete('/deleteuser/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body; // Admin's user ID

    console.log('User ID to delete:', id); // Log user ID to delete
    console.log('Admin ID:', userId); // Log admin ID

    // Verify if the user is an admin
    const checkAdminQuery = 'SELECT isAdmin FROM users WHERE id = ?';
    connectDB.query(checkAdminQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error verifying admin status:', err); // Add detailed logging
            return res.status(500).json({ message: 'Database query failed' });
        }
        if (results.length > 0 && results[0].isAdmin) {
            const query = 'DELETE FROM users WHERE id = ?';
            connectDB.query(query, [id], (error) => {
                if (error) {
                    console.error('Error deleting user:', error); // Add detailed logging
                    return res.status(500).json({ message: 'Database query failed' });
                }
                res.status(200).json({ message: 'User deleted successfully' });
            });
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    });
});

// Updated backend code to handle user profile update without email
app.put('/updateprofile/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, password } = req.body;

    console.log(`Updating profile for user ID: ${id} with data:`, req.body);

    const query = 'UPDATE users SET first_name = ?, last_name = ?, password = ? WHERE id = ?';
    connectDB.query(query, [first_name, last_name, password, id], (error, results) => {
        if (error) {
            console.error('Error updating profile:', error);
            return res.status(500).json({ message: 'Database query failed' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const selectQuery = 'SELECT id, first_name, last_name, email FROM users WHERE id = ?';
        connectDB.query(selectQuery, [id], (selectError, selectResults) => {
            if (selectError) {
                return res.status(500).json({ message: 'Error fetching updated user data' });
            }
            res.status(200).json(selectResults[0]);
        });
    });
});




app.get('/analytics/tasks', (req, res) => {
    const { projectId } = req.query;
    
    if (!projectId) {
        console.error('Project ID is required');
        return res.status(400).json({ message: 'Project ID is required' });
    }

    const query = `
        SELECT t.id as task_id, t.title, COUNT(s.id) as total_subtasks, SUM(s.completed) as completed_subtasks
        FROM tasks t
        LEFT JOIN subtasks s ON t.id = s.task_id
        WHERE t.project_id = ?
        GROUP BY t.id;
    `;
    connectDB.query(query, [projectId], (error, results) => {
        if (error) {
            console.error('Error fetching tasks:', error);
            return res.status(500).json({ message: 'Database query failed' });
        }
        const tasks = results.map(task => ({
            ...task,
            completed: task.total_subtasks == task.completed_subtasks
        }));
        res.status(200).json(tasks);
    });
});



// Analytics endpoint for file uploads
app.get('/analytics/files', (req, res) => {
    const { projectId } = req.query;

    if (!projectId) {
        console.error('Project ID is required');
        return res.status(400).json({ message: 'Project ID is required' });
    }

    const query = `
        SELECT DATE(upload_date) as date, COUNT(*) as file_count
        FROM files
        WHERE project_id = ?
        GROUP BY DATE(upload_date)
        ORDER BY DATE(upload_date);
    `;
    connectDB.query(query, [projectId], (error, results) => {
        if (error) {
            console.error('Error fetching file analytics:', error);
            return res.status(500).json({ message: 'Database query failed' });
        }
        res.status(200).json(results);
    });
});



app.get('/analytics/subtasks', (req, res) => {
    const { projectId } = req.query;

    if (!projectId) {
        console.error('Project ID is required');
        return res.status(400).json({ message: 'Project ID is required' });
    }

    const query = `
        SELECT COUNT(s.id) as total_subtasks, SUM(s.completed) as completed_subtasks
        FROM tasks t
        LEFT JOIN subtasks s ON t.id = s.task_id
        WHERE t.project_id = ?;
    `;
    connectDB.query(query, [projectId], (error, results) => {
        if (error) {
            console.error('Error fetching subtasks analytics:', error);
            return res.status(500).json({ message: 'Database query failed' });
        }
        if (results.length > 0) {
            const total_subtasks = results[0].total_subtasks;
            const completed_subtasks = results[0].completed_subtasks || 0; // Handle case where there are no completed subtasks
            const pending_subtasks = total_subtasks - completed_subtasks;

            res.status(200).json({ completed: completed_subtasks, pending: pending_subtasks });
        } else {
            res.status(200).json({ completed: 0, pending: 0 });
        }
    });
});





// Serve files for download
app.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const file = path.join(__dirname, 'uploads', filename);
    res.download(file, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).json({ message: 'Error downloading file' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
