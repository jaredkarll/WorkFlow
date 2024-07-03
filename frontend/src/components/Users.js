import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../AuthContext';
import CreateUserForm from '../pages/CreateUser';
import EditUserForm from './EditUserForm';
import SideMenu from './SideMenu';
import styles from '../styles/Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [showEditUserForm, setShowEditUserForm] = useState(false);
    const [editUserData, setEditUserData] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('http://localhost:8800/users');
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const toggleCreateUserForm = () => {
        setShowCreateUserForm(!showCreateUserForm);
    };

    const toggleEditUserForm = (userData) => {
        setEditUserData(userData);
        setShowEditUserForm(!showEditUserForm);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8800/deleteuser/${userId}`, { data: { userId: user.id } });
            alert('User deleted successfully');
            setUsers(users.filter(user => user.id !== userId)); // Remove user from the list
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    return (
        <div className="main-layout">
            <SideMenu />
            <div className="content">
                <h2 className="page-title">Users</h2>
                {user && user.isAdmin && (
                    <div>
                        <button className="createNewUserButton" onClick={toggleCreateUserForm}>Create New User</button>
                        {showCreateUserForm && <CreateUserForm closeForm={toggleCreateUserForm} />}
                    </div>
                )}
                {showEditUserForm && <EditUserForm userData={editUserData} />}
                <table className={styles['user-table']}>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            {user && user.isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.first_name}</td>
                                <td>{u.last_name}</td>
                                <td>{u.email}</td>
                                <td>{u.isAdmin ? 'Yes' : 'No'}</td>
                                {user && user.isAdmin && (
                                    <td>
                                        <button className="edit-btn" onClick={() => toggleEditUserForm(u)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
