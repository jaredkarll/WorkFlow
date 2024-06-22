const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8800;

app.use(cors());
app.use(bodyParser.json());

const connectDB = mysql.createPool({
    host: 'localhost',
    port: 3306,
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

// Fetch users
app.get('/users', (req, res) => {
    connectDB.query('SELECT * FROM users WHERE isAdmin = 0', (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        res.status(200).json(results);
    });
});

// User signup
app.post('/signupsubmit', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    connectDB.query(
        'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        [firstName, lastName, email, password],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database query failed' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        }
    );
});

// User login
app.post('/loginsubmit', (req, res) => {
    const { email, password } = req.body;
    connectDB.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database query failed' });
            }
            if (results.length > 0) {
                return res.status(200).json({ message: 'Login successful', user: results[0] });
            } else {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        }
    );
});

// Fetch announcements
app.get('/announcements', (req, res) => {
    connectDB.query('SELECT a.*, u.first_name, u.last_name FROM announcements a LEFT JOIN users u ON a.author_id = u.id ORDER BY date DESC', (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }
        res.status(200).json(results);
    });
});

// Create announcement
app.post('/announcements', (req, res) => {
    const { title, content, authorId } = req.body;

    connectDB.query(
        'INSERT INTO announcements (title, content, author_id) VALUES (?, ?, ?)',
        [title, content, authorId],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database query failed' });
            }
            res.status(201).json({ message: 'Announcement created successfully' });
        }
    );
});

// Forgot password
app.put('/forgotpassword', (req, res) => {
    const { email, password } = req.body;
    connectDB.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [password, email],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database query failed' });
            }
            if (results.affectedRows > 0) {
                return res.status(200).json({ message: 'Password updated successfully' });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        }
    );
});

// Fetch tasks with subtasks
app.get('/tasks', (req, res) => {
    const sql = `
        SELECT 
            t.id as task_id, t.title, t.assigned_to, t.due_date,
            s.id as subtask_id, s.title as subtask_title, s.completed
        FROM tasks t
        LEFT JOIN subtasks s ON t.id = s.task_id
    `;
    connectDB.query(sql, (error, results) => {
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
                    subtasks: row.subtask_id ? [{ id: row.subtask_id, title: row.subtask_title, completed: row.completed }] : []
                });
            } else {
                tasks[taskIndex].subtasks.push({ id: row.subtask_id, title: row.subtask_title, completed: row.completed });
            }
        });

        res.status(200).json(tasks);
    });
});

// Update subtask status
app.put('/subtasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    connectDB.query(
        'UPDATE subtasks SET completed = ? WHERE id = ?',
        [completed, id],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database query failed' });
            }
            res.status(200).json({ message: 'Subtask status updated successfully' });
        }
    );
});

// Create task with subtasks
app.post('/tasks', (req, res) => {
    const { title, assigned_to, subtasks } = req.body;

    connectDB.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Database connection failed' });
        }

        const taskQuery = 'INSERT INTO tasks (title, assigned_to, due_date) VALUES (?, ?, NOW())';
        connection.query(taskQuery, [title, assigned_to], (taskError, taskResults) => {
            if (taskError) {
                connection.release();
                return res.status(500).json({ message: 'Task creation failed' });
            }

            const taskId = taskResults.insertId;
            const subtaskQueries = subtasks.map(subtask => {
                return new Promise((resolve, reject) => {
                    const subtaskQuery = 'INSERT INTO subtasks (task_id, title) VALUES (?, ?)';
                    connection.query(subtaskQuery, [taskId, subtask], (subtaskError, subtaskResults) => {
                        if (subtaskError) {
                            reject(subtaskError);
                        } else {
                            resolve(subtaskResults);
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
                    res.status(500).json({ message: 'Subtask creation failed' });
                });
        });
    });
});

// Fetch projects
app.get('/projects', (req, res) => {
    const sql = `
        SELECT p.id, p.name, p.progress, p.goals, p.methodology, GROUP_CONCAT(u.first_name, ' ', u.last_name) AS members
        FROM projects p
        JOIN project_members pm ON p.id = pm.project_id
        JOIN users u ON pm.user_id = u.id
        GROUP BY p.id
    `;
    connectDB.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }

        const projects = results.map(project => ({
            id: project.id,
            name: project.name,
            progress: project.progress,
            goals: project.goals,
            methodology: project.methodology,
            members: project.members.split(',')
        }));

        res.status(200).json(projects);
    });
});

// Fetch project details
app.get('/projects/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT p.id, p.name, p.progress, p.goals, p.methodology, GROUP_CONCAT(u.first_name, ' ', u.last_name) AS members
        FROM projects p
        JOIN project_members pm ON p.id = pm.project_id
        JOIN users u ON pm.user_id = u.id
        WHERE p.id = ?
        GROUP BY p.id
    `;
    connectDB.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const project = results[0];
        project.members = project.members.split(',');

        res.status(200).json(project);
    });
});

// Create project
app.post('/projects', (req, res) => {
    const { name, progress, goals, methodology, members } = req.body;

    connectDB.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Database connection failed' });
        }

        const projectQuery = 'INSERT INTO projects (name, progress, goals, methodology) VALUES (?, ?, ?, ?)';
        connection.query(projectQuery, [name, progress, goals, methodology], (projectError, projectResults) => {
            if (projectError) {
                connection.release();
                return res.status(500).json({ message: 'Project creation failed' });
            }

            const projectId = projectResults.insertId;
            const memberQueries = members.map(member => {
                return new Promise((resolve, reject) => {
                    const memberQuery = 'INSERT INTO project_members (project_id, user_id) VALUES (?, ?)';
                    connection.query(memberQuery, [projectId, member], (memberError, memberResults) => {
                        if (memberError) {
                            reject(memberError);
                        } else {
                            resolve(memberResults);
                        }
                    });
                });
            });

            Promise.all(memberQueries)
                .then(() => {
                    connection.release();
                    res.status(201).json({ message: 'Project created successfully', id: projectId, name, progress, goals, methodology, members });
                })
                .catch(memberError => {
                    connection.release();
                    res.status(500).json({ message: 'Project member creation failed' });
                });
        });
    });
});

// Edit project
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
                        connection.query(memberQuery, [id, member], (memberError, memberResults) => {
                            if (memberError) {
                                reject(memberError);
                            } else {
                                resolve(memberResults);
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

// Delete project
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

// Update project
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
                        connection.query(memberQuery, [id, member], (memberError, memberResults) => {
                            if (memberError) {
                                reject(memberError);
                            } else {
                                resolve(memberResults);
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



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
