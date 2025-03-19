import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../../context/UserContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Enter a valid email address')
                .required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        validateOnChange: false,
        validateOnBlur: true, // Ensure errors appear only after the field is blurred
        onSubmit: async (values) => {
            try {
                const response = await axios.get(`http://localhost:4000/users?email=${values.email}`);

                if (response.data.length === 0) {
                    alert('Email ID does not exist. Please sign up.');
                } else {
                    const user = response.data[0];
                    if (user.password !== values.password) {
                        alert('Incorrect password. Please try again.');
                    } else {
                        login(user);
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('An error occurred. Please try again.');
            }
        },
    });

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        {...formik.getFieldProps('email')}
                        required
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div style={{ color: 'red', fontSize: '14px' }}>{formik.errors.email}</div>
                    )}
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        {...formik.getFieldProps('password')}
                        required
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div style={{ color: 'red', fontSize: '14px' }}>{formik.errors.password}</div>
                    )}
                </div>

                <button type="submit">Login</button>
            </form>

            <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
    );
};

export default Login;
