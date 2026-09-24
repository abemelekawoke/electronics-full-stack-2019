// src/components/LanguageSwitcher.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mui/material';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <Stack direction="row" spacing={1}>
            <Button 
                onClick={() => changeLanguage('en')}
                sx={{ 
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: i18n.language === 'en' 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'transparent',
                    color: i18n.language === 'en' ? 'white' : '#667eea',
                    border: i18n.language === 'en' ? 'none' : '1px solid #667eea',
                    boxShadow: i18n.language === 'en' ? '0 2px 8px rgba(102, 126, 234, 0.4)' : 'none',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
                        color: 'white',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.5)'
                    }
                }}
            >
                English
            </Button>
            <Button 
                onClick={() => changeLanguage('am')}
                sx={{ 
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: i18n.language === 'am' 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'transparent',
                    color: i18n.language === 'am' ? 'white' : '#667eea',
                    border: i18n.language === 'am' ? 'none' : '1px solid #667eea',
                    boxShadow: i18n.language === 'am' ? '0 2px 8px rgba(102, 126, 234, 0.4)' : 'none',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
                        color: 'white',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.5)'
                    }
                }}
            >
                አማርኛ
            </Button>
        </Stack>
    );
};

export default LanguageSwitcher;

