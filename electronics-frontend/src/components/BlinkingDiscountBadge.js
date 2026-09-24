import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const blink = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

const BlinkingDiscountBadge = ({ discount, sx }) => {
  if (!discount || discount <= 0) return null;

  return (
    <Box
      sx={{
        bgcolor: '#ef4444',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        animation: `${blink} 2s infinite ease-in-out`,
        boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)',
        display: 'inline-block',
        pointerEvents: 'none',
        ...sx,
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: '900', letterSpacing: '0.5px' }}>
        {discount}% OFF
      </Typography>
    </Box>
  );
};

export default BlinkingDiscountBadge;