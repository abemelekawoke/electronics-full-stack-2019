import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, Divider, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { login, socialLogin } from '../services/auth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await login(email, password);
            window.location.reload();
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        socialLogin('google');
    };

    const handleFacebookLogin = () => {
        socialLogin('facebook');
    };

    return (
        <Box
            sx={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden',
                py: 4
            }}
        >
            {/* Decorative circles */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)'
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -100,
                    left: -100,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)'
                }}
            />

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    maxWidth: 450,
                    width: '100%',
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
                }}
            >
                {/* Logo/Header */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 700, 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sign in to continue to Parrot Advert
                    </Typography>
                </Box>

                {error && (
                    <Paper 
                        elevation={0}
                        sx={{ 
                            mb: 3, 
                            p: 2, 
                            bgcolor: '#fee',
                            borderRadius: 2,
                            border: '1px solid #fcc'
                        }}
                    >
                        <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                            {error}
                        </Typography>
                    </Paper>
                )}

                {/* Social Login Buttons */}
                <Box sx={{ mb: 3 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleGoogleLogin}
                        sx={{ 
                            mb: 1.5, 
                            bgcolor: 'white', 
                            color: '#333', 
                            borderColor: '#e0e0e0', 
                            borderRadius: 2,
                            py: 1.5,
                            fontWeight: 600,
                            '&:hover': { 
                                bgcolor: '#f5f5f5',
                                borderColor: '#ccc'
                            } 
                        }}
                        startIcon={<GoogleIcon />}
                    >
                        Continue with Google
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleFacebookLogin}
                        sx={{ 
                            bgcolor: '#1877f2', 
                            color: '#fff', 
                            borderRadius: 2,
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: '0 4px 14px rgba(24, 119, 242, 0.4)',
                            '&:hover': { 
                                bgcolor: '#166fe5',
                                boxShadow: '0 6px 20px rgba(24, 119, 242, 0.5)'
                            } 
                        }}
                        startIcon={<FacebookIcon />}
                    >
                        Continue with Facebook
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                        OR
                    </Typography>
                </Divider>

                {/* Email/Password Login Form */}
                <form onSubmit={handleEmailLogin}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon sx={{ color: '#4361ee' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#4361ee'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#4361ee'
                                }
                            }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon sx={{ color: '#4361ee' }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#4361ee'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#4361ee'
                                }
                            }
                        }}
                    />
                    
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ 
                            mt: 3, 
                            mb: 2,
                            borderRadius: 2,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
                                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
                            },
                            '&:disabled': {
                                background: '#ccc'
                            }
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                <Typography variant="body2" align="center" sx={{ color: '#666' }}>
                    Don't have an account?{' '}
                    <Link 
                        to="/signup" 
                        style={{ 
                            textDecoration: 'none',
                            color: '#4361ee',
                            fontWeight: 600
                        }}
                    >
                        Sign up
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}

export default Login;
