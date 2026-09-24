import React, { useEffect } from 'react';
import { Box } from '@mui/material';

/**
 * Reusable CustomerChat component for tawk.to integration.
 * 
 * Instructions:
 * 1. Sign up at tawk.to (free), get Property ID from Administration > Overview.
 * 2. In App.js, replace 'YOUR_PROPERTY_ID' with your actual Property ID.
 * 3. The widget appears fixed bottom-left (co-exists with existing chatbot bottom-right).
 * 4. Customize position via sx prop on wrapper Box in App.js.
 * 
 * Props:
 * @param {string} propertyId - Your tawk.to Property ID (required)
 */
const CustomerChat = ({ propertyId }) => {
  useEffect(() => {
    // Skip if no valid ID
    if (!propertyId || propertyId === 'YOUR_PROPERTY_ID') {
      console.warn('CustomerChat: Please set your tawk.to Property ID');
      return;
    }

    // Remove existing tawk script if any
    const existingScript = document.querySelector('script[src*=\"embed.tawk.to\"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and load tawk.to script
    const script = document.createElement('script');
    script.src = 'https://embed.tawk.to/69b951f55005201c341f2e6a/1jjtugajd';
    script.async = true;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    document.head.appendChild(script);

    // Init on load
    const handleLoad = () => {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      // Optional: window.Tawk_API.onChatTimeout = () => { ... };
    };
    script.addEventListener('load', handleLoad);

    // Cleanup
    return () => {
      script.removeEventListener('load', handleLoad);
      const tawkScript = document.querySelector('script[src*=\"embed.tawk.to\"]');
      if (tawkScript) tawkScript.remove();
      // Hide widget if loaded
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };
  }, [propertyId]);

  return null; // tawk.to widget handles UI completely
};

export default CustomerChat;

