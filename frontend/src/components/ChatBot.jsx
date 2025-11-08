import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Spinner, InputGroup } from 'react-bootstrap';
import { X, Fullscreen, FullscreenExit, Trash } from 'react-bootstrap-icons';
import { getHistory, sendMessage, clearChat } from '../services/api';

const ChatBot = ({ user, onToggleFullscreen, isFullscreen = false }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Load chat history from localStorage (user-specific)
  useEffect(() => {
    if (user?.uid) {
      const savedHistory = localStorage.getItem(`chatHistory_${user.uid}`);
      console.log('DEBUG: Loading from localStorage:', savedHistory);
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          console.log('DEBUG: Parsed localStorage history:', parsedHistory);
          setChatHistory(parsedHistory);
        } catch (error) {
          console.error('Error parsing saved chat history:', error);
        }
      }
    }
  }, [user?.uid]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (user?.uid && chatHistory.length > 0) {
      localStorage.setItem(`chatHistory_${user.uid}`, JSON.stringify(chatHistory));
      console.log('DEBUG: Saved to localStorage:', chatHistory);
    }
  }, [chatHistory, user?.uid]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() };
    const newChatHistory = [...chatHistory, userMessage];
    console.log('DEBUG: Adding user message:', userMessage);
    console.log('DEBUG: New chat history after user message:', newChatHistory);
    
    setChatHistory(newChatHistory);
    setMessage('');
    setLoading(true);

    try {
      const response = await sendMessage(message);
      const assistantMessage = { 
        role: 'assistant', 
        content: response.data.reply,
        timestamp: new Date().toISOString()
      };
      const finalChatHistory = [...newChatHistory, assistantMessage];
      console.log('DEBUG: Adding assistant message:', assistantMessage);
      console.log('DEBUG: Final chat history:', finalChatHistory);
      
      setChatHistory(finalChatHistory);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, something went wrong.',
        timestamp: new Date().toISOString()
      };
      setChatHistory([...newChatHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      try {
        setLoading(true);
        await clearChat();
        setChatHistory([]);
        // Also clear localStorage
        if (user?.uid) {
          localStorage.removeItem(`chatHistory_${user.uid}`);
        }
        console.log('Chat history cleared successfully');
      } catch (error) {
        console.error('Error clearing chat history:', error);
        alert('Failed to clear chat history. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const chatContainerStyle = {
    height: isFullscreen ? 'calc(100vh - 120px)' : '400px',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '10px',
    scrollBehavior: 'smooth'
  };

  const messageStyle = (role) => ({
    margin: '10px 0',
    padding: '12px 16px',
    borderRadius: '18px',
    maxWidth: '70%',
    wordWrap: 'break-word',
    ...(role === 'user' 
      ? {
          backgroundColor: '#007bff',
          color: 'white',
          marginLeft: 'auto',
          textAlign: 'right'
        }
      : {
          backgroundColor: 'white',
          color: '#333',
          marginRight: 'auto',
          textAlign: 'left',
          border: '1px solid #e9ecef'
        })
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={isFullscreen ? 'fullscreen-chat' : ''} style={isFullscreen ? {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      borderRadius: 0,
      margin: 0
    } : {}}>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Chat Assistant</h5>
        <div className="d-flex gap-2">
          {chatHistory.length > 0 && (
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleClearChat}
              disabled={loading}
              title="Clear chat history"
            >
              <Trash size={16} />
            </Button>
          )}
          <Button 
            variant="link" 
            size="sm" 
            onClick={onToggleFullscreen}
            style={{ padding: '4px' }}
          >
            {isFullscreen ? <FullscreenExit size={16} /> : <Fullscreen size={16} />}
          </Button>
          {isFullscreen && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={onToggleFullscreen}
              style={{ padding: '4px' }}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body style={{ padding: isFullscreen ? '20px' : '15px', position: 'relative' }}>
        <div ref={chatContainerRef} style={chatContainerStyle}>
          {chatHistory.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              Start a conversation with the AI assistant!
            </div>
          )}
          
          {chatHistory.map((chat, index) => (
            <div key={`${chat.timestamp || index}-${index}`} style={messageStyle(chat.role)}>
              <div style={{ fontSize: '0.8em', opacity: 0.7, marginBottom: '4px' }}>
                {chat.role === 'user' ? 'You' : 'Assistant'}
                {chat.timestamp && (
                  <span style={{ marginLeft: '8px' }}>
                    {formatTime(chat.timestamp)}
                  </span>
                )}
              </div>
              <div>{chat.content}</div>
            </div>
          ))}
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spinner animation="border" size="sm" />
              <div style={{ marginTop: '8px', fontSize: '0.9em', color: '#666' }}>
                Assistant is thinking...
              </div>
            </div>
          )}
        </div>
        
        <Form onSubmit={handleSendMessage}>
          <InputGroup>
            <Form.Control
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{ borderRadius: '20px 0 0 20px' }}
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading || !message.trim()} 
              style={{ borderRadius: '0 20px 20px 0' }}
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChatBot;