import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget';

// Root component wraps the entire Docusaurus app
// This allows us to add global components like the chat widget
export default function Root({ children }) {
  // Default API endpoint for local development
  // For production, update this to your deployed backend URL
  const apiEndpoint = 'http://localhost:8000/api/chatbot/query';

  return (
    <>
      {children}
      <ChatWidget apiEndpoint={apiEndpoint} />
    </>
  );
}
