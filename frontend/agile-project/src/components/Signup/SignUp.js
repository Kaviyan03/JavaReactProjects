import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignUp = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        validateOnChange: false,
        validateOnBlur: false,   
        onSubmit: async (values) => {
            try {
                const response = await axios.get(`http://localhost:4000/users?email=${values.email}`);

                if (response.data.length > 0) {
                    alert('Email already exists. Please use a different email .');
                } else {
              
                    await axios.post('http://localhost:4000/users', {
                        name: values.name,
                        email: values.email,
                        password: values.password,
                        role: 'employee',
                    });

                    alert('Signed up successfully!');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error signing up:', error);
                alert('An error occurred. Please try again.');
            }
        },
    });

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={formik.handleSubmit}>
                <label>
                    Name:
                    <input type="text" {...formik.getFieldProps('name')} required />
                </label>
                {formik.submitCount > 0 && formik.errors.name && alert(formik.errors.name)}
                &nbsp;
                <label>
                    Email:
                    <input type="email" {...formik.getFieldProps('email')} required />
                </label>
                {formik.submitCount > 0 && formik.errors.email && alert(formik.errors.email)}
                &nbsp;
                <label>
                    Password:
                    <input type="password" {...formik.getFieldProps('password')} required />
                </label>
                {formik.submitCount > 0 && formik.errors.password && alert(formik.errors.password)}

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;

