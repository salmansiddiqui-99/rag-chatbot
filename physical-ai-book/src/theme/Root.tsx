import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget';

// Root component wraps the entire Docusaurus app
// This allows us to add global components like the chat widget
export default function Root({ children }) {
  // Production API endpoint (Hugging Face Spaces)
  // For local development, use: http://localhost:8000/api/chatbot/query
  const apiEndpoint = 'https://salman-giaic-rag.hf.space/chat';

  return (
    <>
      {children}
      <ChatWidget apiEndpoint={apiEndpoint} />
    </>
  );
}
