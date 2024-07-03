import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../AuthContext';
import styles from '../styles/CreateUser.module.css';

const CreateUser = ({ closeForm }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8800/createuser', {
                firstName,
                lastName,
                email,
                password,
                isAdmin,
                userId: user.id // Passing the admin's user ID for authorization
            });
            alert('User created successfully');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setIsAdmin(false);
            closeForm(); // Close the form after user creation
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user');
        }
    };

    return (
        <div className={styles['create-user-page']}>
            <div className={styles['profile-page-container']}>
                <h2 className={styles['createUserHeader']}>Create User</h2>
                <form onSubmit={handleSubmit} className={styles['profile-edit-form']}>
                    <div className={styles['input-box']}>
                        <label>First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className={styles['input-box']}>
                        <label>Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                    <div className={styles['input-box']}>
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className={styles['input-box']}>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className={styles['input-box']}>
                        <label>Admin</label>
                        <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
                    </div>
                    <div className={styles['button-container']}>
                        <button className={styles['createUserSubmitButton']} type="submit">Create User</button>
                        <button className={styles['cancelButton']} type="button" onClick={closeForm}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;
