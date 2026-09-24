import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, Divider, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import { signup, socialLogin } from '../services/auth';

function Signup() {
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password1 !== password2) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password1.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        try {
            await signup(email, password1, password2);
            window.location.reload();
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        socialLogin('google');
    };

    const handleFacebookSignup = () => {
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
                    left: -100,
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
                    right: -100,
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
                {/* Header */}
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
                        Create Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Join Parrot Advert today
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

                {/* Social Signup Buttons */}
                <Box sx={{ mb: 3 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleGoogleSignup}
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
                        Sign up with Google
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleFacebookSignup}
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
                        Sign up with Facebook
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                        OR
                    </Typography>
                </Divider>

                {/* Email/Password Signup Form */}
                <form onSubmit={handleEmailSignup}>
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
                        type={showPassword1 ? "text" : "password"}
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        required
                        margin="normal"
                        variant="outlined"
                        helperText="At least 8 characters"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon sx={{ color: '#4361ee' }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword1(!showPassword1)}
                                        edge="end"
                                    >
                                        {showPassword1 ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type={showPassword2 ? "text" : "password"}
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
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
                                        onClick={() => setShowPassword2(!showPassword2)}
                                        edge="end"
                                    >
                                        {showPassword2 ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                            'Create Account'
                        )}
                    </Button>
                </form>

                <Typography variant="body2" align="center" sx={{ color: '#666' }}>
                    Already have an account?{' '}
                    <Link 
                        to="/login" 
                        style={{ 
                            textDecoration: 'none',
                            color: '#4361ee',
                            fontWeight: 600
                        }}
                    >
                        Sign in
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}

export default Signup;
