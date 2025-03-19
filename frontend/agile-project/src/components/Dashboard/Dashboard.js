import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ScrumDetails from '../Scrum Details/ScrumDetails';
import { UserContext } from '../../context/UserContext';

const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchScrums = async () => {
            try {
                const response = await axios.get('http://localhost:4000/scrums');
                setScrums(response.data);
            } catch (error) {
                console.error('Error fetching scrums:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchScrums();
        fetchUsers();
    }, []);

    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error('Error fetching scrum details:', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            scrumName: '',
            taskTitle: '',
            taskDescription: '',
            taskStatus: 'To Do',
            taskAssignedTo: '',
        },
        validationSchema: Yup.object({
            scrumName: Yup.string().required('Scrum name is required'),
            taskTitle: Yup.string().required('Task title is required'),
            taskDescription: Yup.string().required('Task description is required'),
            taskAssignedTo: Yup.string().required('Please assign a user'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const existingScrum = scrums.find(scrum => scrum.name.toLowerCase() === values.scrumName.toLowerCase());

                if (existingScrum) {
                    alert('Error: Scrum with this name already exists.');
                    return;
                }

                const newScrumResponse = await axios.post('http://localhost:4000/scrums', {
                    name: values.scrumName,
                });
                const newScrum = newScrumResponse.data;

                await axios.post('http://localhost:4000/tasks', {
                    title: values.taskTitle,
                    description: values.taskDescription,
                    status: values.taskStatus,
                    scrumId: newScrum.id,
                    assignedTo: values.taskAssignedTo,
                    history: [
                        {
                            status: values.taskStatus,
                            date: new Date().toISOString().split('T')[0],
                        },
                    ],
                });

                const updatedScrums = await axios.get('http://localhost:4000/scrums');
                setScrums(updatedScrums.data);
                setShowForm(false);
                alert('New Scrum created successfully.');
                resetForm();
            } catch (error) {
                console.error('Error adding scrum:', error);
            }
        },
    });

    return (
        <div>
            <h2>Scrum Teams</h2>

            {user?.role === 'admin' && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add New Scrum'}
                    </button>
                    {showForm && (
                        <form onSubmit={formik.handleSubmit}>
                            <div>
                                <label>Scrum Name:</label>
                                <input 
                                    type="text" 
                                    {...formik.getFieldProps('scrumName')}
                                    style={{
                                        borderColor: formik.touched.scrumName && formik.errors.scrumName ? 'red' : '',
                                        borderWidth: formik.touched.scrumName && formik.errors.scrumName ? '2px' : '',
                                    }} 
                                />
                                {formik.touched.scrumName && formik.errors.scrumName ? (
                                    <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.scrumName}</div>
                                ) : null}
                            </div>
                            
                            <div>
                                <label>Task Title:</label>
                                <input 
                                    type="text" 
                                    {...formik.getFieldProps('taskTitle')}
                                    style={{
                                        borderColor: formik.touched.taskTitle && formik.errors.taskTitle ? 'red' : '',
                                        borderWidth: formik.touched.taskTitle && formik.errors.taskTitle ? '2px' : '',
                                    }} 
                                />
                                {formik.touched.taskTitle && formik.errors.taskTitle ? (
                                    <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.taskTitle}</div>
                                ) : null}
                            </div>

                            <div>
                                <label>Task Description:</label>
                                <input 
                                    type="text" 
                                    {...formik.getFieldProps('taskDescription')}
                                    style={{
                                        borderColor: formik.touched.taskDescription && formik.errors.taskDescription ? 'red' : '',
                                        borderWidth: formik.touched.taskDescription && formik.errors.taskDescription ? '2px' : '',
                                    }} 
                                />
                                {formik.touched.taskDescription && formik.errors.taskDescription ? (
                                    <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.taskDescription}</div>
                                ) : null}
                            </div>

                            <div>
                                <label>Task Status:</label>
                                <select {...formik.getFieldProps('taskStatus')}>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>

                            <div>
                                <label>Assign To:</label>
                                <select 
                                    {...formik.getFieldProps('taskAssignedTo')}
                                    style={{
                                        borderColor: formik.touched.taskAssignedTo && formik.errors.taskAssignedTo ? 'red' : '',
                                        borderWidth: formik.touched.taskAssignedTo && formik.errors.taskAssignedTo ? '2px' : '',
                                    }} 
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.taskAssignedTo && formik.errors.taskAssignedTo ? (
                                    <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.taskAssignedTo}</div>
                                ) : null}
                            </div>

                            <button type="submit">Create Scrum</button>
                        </form>
                    )}
                </div>
            )}

            <ul style={{ marginLeft: '20px' }}>
                {scrums.map((scrum) => (
                    <li key={scrum.id}>
                        {scrum.name}
                        &nbsp;&nbsp;&nbsp;
                        <button onClick={() => handleGetDetails(scrum.id)}>Get Details</button>
                    </li>
                ))}
            </ul>

            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </div>
    );
};

export default Dashboard;
