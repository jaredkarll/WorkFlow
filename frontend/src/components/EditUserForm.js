import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../AuthContext';

const EditUserForm = ({ userData }) => {
    const { user } = useContext(AuthContext); // Assuming you have AuthContext for user data
    const [firstName, setFirstName] = useState(userData.first_name);
    const [lastName, setLastName] = useState(userData.last_name);
    const [email, setEmail] = useState(userData.email);
    const [isAdmin, setIsAdmin] = useState(userData.isAdmin);

    useEffect(() => {
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setEmail(userData.email);
        setIsAdmin(userData.isAdmin);
    }, [userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8800/updateuser/${userData.id}`, {
                firstName,
                lastName,
                email,
                isAdmin,
                userId: user.id // Sending the admin's user ID for verification
            });
            alert('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
                <label>Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Admin</label>
                <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
            </div>
            <button type="submit">Update User</button>
        </form>
    );
};

export default EditUserForm;
