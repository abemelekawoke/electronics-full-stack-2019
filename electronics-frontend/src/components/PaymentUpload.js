import React, { useState } from 'react';
import api from '../services/api';
import { 
    Box, 
    Typography, 
    Button, 
    Paper, 
    Alert,
    CircularProgress,
    TextField,
    Avatar,
    Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoAImage from '../images/Bank of Abyssinia.jpg';
import CBEImage from '../images/CBE.png';
import TeleBirrImage from '../images/Tele Birr.png'; 

const PaymentUpload = ({ orderId, paymentType, amount, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [amountValue, setAmountValue] = useState(amount || '');

    // Handle file selection with validation
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type - only allow images
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).');
            setSelectedFile(null);
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('File too large. Maximum size is 5MB.');
            setSelectedFile(null);
            return;
        }

        setError('');
        setSelectedFile(file);
    };

    // Handle payment upload
    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a receipt image to upload.');
            return;
        }

        if (!amountValue || parseFloat(amountValue) <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('amount', amountValue);
        formData.append('receipt', selectedFile);

        try {
            const endpoint = paymentType === 'deposit' 
                ? `orders/${orderId}/upload-deposit/`
                : `orders/${orderId}/upload-final-payment/`;

            const response = await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess(true);
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.error || 'Failed to upload payment. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // Determine payment label based on payment type
    const getPaymentLabel = () => {
        if (paymentType === 'deposit') {
            return 'Advance Payment';
        }
        return 'Final Payment';
    };

    return (
        <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Upload {getPaymentLabel()}
            </Typography>
            
            {/* Payment Account Information */}
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
                    💳 Payment Accounts:
                </Typography>
                
                {/* direction="row" makes it horizontal, spacing adds gap, flexWrap handles small screens */}
                <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={3} 
                    sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}
                >
                    {/* Bank of Abyssinia */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: '200px' }}>
                        <img src={BoAImage} alt="Bank of Abyssinia" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e88e5', lineHeight: 1.2 }}>
                                Bank of Abyssinia (BoA)
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                113623659
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Dagim Zerie
                            </Typography>
                        </Box>
                    </Box>

                    {/* CBE */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: '200px' }}>
                        <img src={CBEImage} alt="CBE" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#f57c00', lineHeight: 1.2 }}>
                                CBE
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                1000262107860
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Dagim Zerie
                            </Typography>
                        </Box>
                    </Box>

                    {/* Tele Birr */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: '200px' }}>
                        <img src={TeleBirrImage} alt="Tele Birr" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#43a047', lineHeight: 1.2 }}>
                                Tele Birr
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                943444568
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Dagim Zerie
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </Box>
            
            {success ? (
                <Alert severity="success" icon={<CheckCircleIcon />}>
                    Payment uploaded successfully! Status is now pending verification.
                </Alert>
            ) : (
                <>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Amount"
                            type="number"
                            value={amountValue}
                            onChange={(e) => setAmountValue(e.target.value)}
                            fullWidth
                            disabled
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>ETB</Typography>,
                            }}
                            helperText={`Exact amount required: ETB ${amountValue}`}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <input
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            style={{ display: 'none' }}
                            id={`receipt-upload-${orderId}`}
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor={`receipt-upload-${orderId}`}>
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                fullWidth
                                sx={{ 
                                    borderRadius: '30px',
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
                                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Select Receipt Image
                            </Button>
                        </label>
                    </Box>

                    {selectedFile && (
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                        </Typography>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={uploading || !selectedFile}
                        fullWidth
                        sx={{ 
                            borderRadius: '30px',
                            py: 1.5,
                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '1rem',
                            boxShadow: '0 4px 15px rgba(17, 153, 142, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #0f8a80 0%, #32d970 100%)',
                                boxShadow: '0 6px 20px rgba(17, 153, 142, 0.5)',
                                transform: 'translateY(-2px)'
                            },
                            '&:disabled': {
                                background: '#ccc',
                                boxShadow: 'none'
                            }
                        }}
                    >
                        {uploading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Upload Payment'}
                    </Button>

                    <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                        Accepted formats: JPEG, PNG, GIF, WebP. Max size: 5MB.
                    </Typography>
                </>
            )}
        </Paper>
    );
};

export default PaymentUpload;
