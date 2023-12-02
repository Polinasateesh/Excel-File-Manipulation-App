import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Card, Button, TextField, Grid, CircularProgress, InputAdornment } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'



const defaultValues = {
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    showPassword: false,

};

const Register = () => {
    const [value, setValue] = useState(defaultValues);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  
   
    const isUserRegistered = JSON.parse(window.localStorage.getItem('userInfo'))
    const isLogin=window.localStorage.getItem('isLogedIn')

    useEffect(() => {
        const isUserRegistered = JSON.parse(window.localStorage.getItem('userInfo'))
        const isLogin=window.localStorage.getItem('isLogedIn')
        console.log('isUserRegistered',isUserRegistered);
        if (isUserRegistered!==null) {
           navigate('/Login');
        }else if (isLogin){
            navigate('/Home')
        }else{
                
        }
    }, [isUserRegistered,isLogin]);

    const handleClose = () => {
        setValue(defaultValues)
    };
    
    // Handle input on change
    const handleChange = (event) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        setValue({ ...value, [inputName]: inputValue });

    };

    const handleClickShowPassword = () => {
        setValue({ ...value, showPassword: !value.showPassword })
    }

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        const newValues = {
            firstName: value.firstName,
            lastName: value.lastName,
            userName: value.userName,
            password: value.password,
        }

        try {
            // Simulate a successful registration
            window.localStorage.setItem('userInfo', JSON.stringify(newValues));
            
            // Show success toast
            toast.success('User information saved successfully!', {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
              onClose: () => {
                // Redirect to the login page
                navigate('/Login');
              },
            });
          } catch (error) {
            // Show error toast
            toast.error('Registration failed. Please try again.', {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
            });
          } finally {
            setIsLoading(false);
            setValue(defaultValues);
          }


    };

    return (
        <>
            <ToastContainer />
            <Card className='card-container'>

                <p className='card-heading'> ➡️ Register Form</p>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name='firstName'
                                label='First Name'
                                type='text'
                                value={value.firstName}
                                onChange={handleChange}
                                fullWidth
                                required
                                size="small"
                                variant='outlined'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name='lastName'
                                label='Last Name'
                                type='text'
                                size="small"
                                value={value.lastName}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant='outlined'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name='userName'
                                label='User Name'
                                required
                                size="small"
                                type='email'
                                value={value.userName}
                                onChange={handleChange}
                                fullWidth
                                variant='outlined'
                                InputProps={{
                                    startAdornment: (
                                        <EmailIcon
                                            style={{
                                                color: 'gray',
                                                marginLeft: '-10px',
                                                position: 'relative',
                                                padding: '2px',
                                            }}
                                        />
                                    ),
                                }}


                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                name='password'
                                label='Password'
                                type={value.showPassword ? 'text' : 'password'}
                                required
                                size="small"
                                value={value.password}
                                onChange={handleChange}
                                fullWidth
                                variant='outlined'
                                InputProps={{
                                    startAdornment: (
                                        <LockIcon
                                            style={{
                                                color: 'gray',
                                                marginLeft: '-10px',
                                                position: 'relative',
                                                padding: '2px',
                                            }}
                                        />
                                    ),
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            style={{
                                                position: 'absolute',
                                                right: 0,
                                            }}
                                        >
                                            {' '}
                                            <IconButton
                                                onClick={
                                                    handleClickShowPassword
                                                }

                                            >
                                                {' '}
                                                {value.showPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>{' '}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                    </Grid>
                    <div className='button-container'>
                        <Button variant='outlined' color='warning' onClick={handleClose} startIcon={
                            <CloseIcon style={{ fontSize: '16px' }} />
                        }>
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            type='submit'
                            disabled={isLoading}
                            startIcon={
                                <SendIcon style={{ fontSize: '16px' }} />
                            }
                            style={{ marginLeft: '15px' }}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Register'}
                        </Button>
                    </div>
                </form>

            </Card>
        </>
    );
};

export default Register;
