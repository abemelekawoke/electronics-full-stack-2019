// src/chatbot/config.js

import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';
import ActionProvider from './ActionProvider';
import MessageParser from './MessageParser';

const config = {
  botName: "Parrot Assistant",
  initialMessages: [
    createChatBotMessage("Hello! 👋 Welcome to Parrot Advert! How can I help you today?"),
    createChatBotMessage("You can ask me about:\n• 📦 Order Status\n• 🛒 Products\n• 💳 Payment Methods\n• 🚚 Shipping\n• ❓ FAQ\n\nOr type 'Help' for all options!"),
  ],
  customComponents: {
    // Custom header for the chat widget
    header: () => (
      <div style={{
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '10px 10px 0 0',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>💬</span>
        <span>Parrot Advert Assistant</span>
      </div>
    ),
  },
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
      color: 'white',
      borderRadius: '10px',
      padding: '10px 15px',
    },
    chatButton: {
      backgroundColor: "#5ccc9d",
      color: 'white',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      cursor: 'pointer',
    },
    providerContainer: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
    },
  },
  state: {
    // Custom state can be added here if needed
  },
};

export { ActionProvider, MessageParser };
export default config;

