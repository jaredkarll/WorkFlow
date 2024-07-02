import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import AuthContext from '../AuthContext';
import styles from '../styles/CreateUser.module.css';

const CreateUser = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const { user } = useContext(AuthContext);
    const history = useHistory();

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
            history.push('/admindashboard/users'); // Redirect to users page after creation
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user');
        }
    };

    return (
        <div className={styles['create-user-page']}>
            <button className={styles['return-button']} onClick={() => history.push('/admindashboard/users')}>Return</button>
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
                    <button className={styles['createUserSubmitButton']} type="submit">Create User</button>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;
