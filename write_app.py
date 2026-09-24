import os

content = """// src/components/Footer.js

import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <Box component="footer" sx={{ p: 2, backgroundColor: '#f8f9fa', mt: 4 }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 1
            }}>
                <Typography variant="body2" color="textSecondary">
                    &copy; {new Date().getFullYear()} Parrot Advert. All rights reserved.
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <Link href="/contact-us" color="inherit">
                        Contact Us
                    </Link>
                </Typography>
            </Box>
            <Box sx={{ 
                 justifyContent:{xs:'center' ,md:'flex-end'},  
                  mt :2,
                  flexDirection:{xs:'column' ,md:'row'},
                   gap:{xs :1 ,md :0}
             }}>
                
                
                
               )
"""

with open('d:/projects/electronics/electronics-frontend/src/components/Footer.js','w') as f:
    f.write(content)
print("File written successfully")
