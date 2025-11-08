import React, { useState } from 'react';
import { sessionLogout } from '../services/api';
import { Card, Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Person, ChatDots } from 'react-bootstrap-icons';
import ChatBot from '../components/ChatBot';

const Dashboard = ({ user }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  
  // Load profile from localStorage or use Firebase user data as fallback
  const [profileData, setProfileData] = useState(() => {
    // Use user.uid to make localStorage user-specific
    const savedProfile = localStorage.getItem(`userProfile_${user.uid}`);
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    return {
      displayName: user.displayName || '',
      phoneNumber: user.phoneNumber || ''
    };
  });

  const handleLogout = async () => {
    await sessionLogout();
    window.location.reload();
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage with user-specific key
    localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(profileData));
    alert('Profile updated successfully!');
    setShowProfile(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChatFullscreen = () => {
    setIsChatFullscreen(!isChatFullscreen);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'relative' }}
    >
      {!isChatFullscreen && (
        <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 10 }}>
          <a href="#" onClick={() => setShowProfile(!showProfile)} className="me-3">
            <Person size={30} />
          </a>
          <a href="#" onClick={() => setShowChat(!showChat)}>
            <ChatDots size={30} />
          </a>
        </div>
      )}
      
      {isChatFullscreen && (
        <div className="position-fixed top-0 start-0 p-3" style={{ zIndex: 1001 }}>
          <div className="d-flex flex-column gap-2">
            <a href="#" onClick={() => setShowProfile(!showProfile)}>
              <Person size={24} />
            </a>
            <a href="#" onClick={() => setShowChat(!showChat)}>
              <ChatDots size={24} />
            </a>
          </div>
        </div>
      )}
      <Card className="dashboard-card">
        <Card.Header as="h4" className="bg-white border-0 pt-4 pb-3 text-dark">
          {showProfile ? 'Profile' : 'Dashboard'}
        </Card.Header>
        <Card.Body>
          {showProfile ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Form onSubmit={handleProfileSubmit}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="displayName"
                    placeholder="Enter your name" 
                    value={profileData.displayName}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="phoneNumber"
                    placeholder="Enter phone number" 
                    value={profileData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="dark" type="submit">
                  Save
                </Button>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <motion.h5 variants={itemVariants} className="mb-4 text-dark">Welcome, {profileData.displayName || user.displayName || user.email || user.phoneNumber}</motion.h5>
              <motion.div variants={itemVariants} className="d-grid mt-4">
                <Button as={motion.button} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} variant="dark" onClick={handleLogout}>
                  Logout
                </Button>
              </motion.div>
            </motion.div>
          )}
        </Card.Body>
      </Card>
      {showChat && (
        <div className="chat-widget">
          <ChatBot 
            user={user}
            onToggleFullscreen={handleToggleChatFullscreen}
            isFullscreen={isChatFullscreen}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
