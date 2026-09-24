import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Fade, useTheme, useMediaQuery } from '@mui/material';
import api from '../services/api';

const PartnersSlider = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                console.log('🔍 Fetching partners from /api/v1/partners/...');
                const response = await api.get('partners/');
                console.log('✅ Partners Response:', response);
                
                const data = response.data || response;
                console.log('📊 Full response data:', data);
                
                // ✅ ውሂቡን በትክክል መያዝ - results ውስጥ ነው
                let partnersData = [];
                if (data && typeof data === 'object') {
                    if (Array.isArray(data)) {
                        partnersData = data;
                    } else if (data.results && Array.isArray(data.results)) {
                        partnersData = data.results;
                    } else {
                        partnersData = [data];
                    }
                }
                
                console.log('📊 Partners data:', partnersData);
                console.log('📊 Partners count:', partnersData.length);
                
                if (partnersData.length > 0) {
                    setPartners(partnersData);
                } else {
                    console.log('⚠️ No partners found');
                    setPartners([]);
                }
            } catch (error) {
                console.error('❌ Error fetching partners:', error);
                console.error('Error details:', error.response?.data);
                setPartners([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    if (loading) {
        return (
            <Box sx={{ py: 4, bgcolor: '#f8f9fa' }}>
                <Container maxWidth="xl">
                    <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 700, color: '#0046be' }}>
                        Our Trusted Partners
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <Box key={i} sx={{ width: 150, height: 100, bgcolor: '#e0e0e0', borderRadius: 2 }} />
                        ))}
                    </Box>
                </Container>
            </Box>
        );
    }

    if (partners.length === 0) {
        return null;
    }

    // በትር (tier) መሰረት ቀለም
    const getTierColor = (tier) => {
        const tierMap = {
            'Platinum': '#E5E4E2',
            'Gold': '#FFD700',
            'Silver': '#C0C0C0'
        };
        return tierMap[tier] || '#E5E4E2';
    };

    return (
        <Box sx={{ py: 4, bgcolor: '#f8f9fa' }}>
            <Container maxWidth="xl">
                <Typography 
                    variant="h5" 
                    sx={{ 
                        textAlign: 'center', 
                        mb: 3, 
                        fontWeight: 700,
                        color: '#0046be'
                    }}
                >
                    Our Trusted Partners
                </Typography>
                <Box 
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 4,
                        px: 2
                    }}
                >
                    {partners.map((partner, index) => (
                        <Fade in timeout={300 + index * 100} key={partner.id}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: isMobile ? '120px' : '150px',
                                    height: isMobile ? '100px' : '120px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 6,
                                        borderColor: getTierColor(partner.tier_display),
                                        borderWidth: 2,
                                        borderStyle: 'solid'
                                    },
                                    border: '2px solid transparent',
                                    borderRadius: 2,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {partner.tier_display && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            bgcolor: getTierColor(partner.tier_display),
                                            px: 1,
                                            py: 0.3,
                                            borderRadius: 1,
                                            fontSize: '0.55rem',
                                            fontWeight: 700,
                                            color: '#333'
                                        }}
                                    >
                                        {partner.tier_display}
                                    </Box>
                                )}
                                {partner.logo_url ? (
                                    <img
                                        src={partner.logo_url}
                                        alt={partner.name}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '70px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                ) : (
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            fontWeight: 600, 
                                            color: '#0046be',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {partner.name}
                                    </Typography>
                                )}
                                {partner.website && (
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            mt: 0.5, 
                                            color: '#666',
                                            fontSize: '0.6rem',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {partner.website.replace(/^https?:\/\//, '')}
                                    </Typography>
                                )}
                            </Paper>
                        </Fade>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default PartnersSlider;