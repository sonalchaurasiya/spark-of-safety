import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, Alert } from '@mui/material';
import { auth, provider, db } from './firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import GoogleIcon from '@mui/icons-material/Google';

// Style constants
const containerStyles = {
  backgroundColor: '#1c1c1c',
  color: '#ffffff',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: '0 20px',
  position: 'relative',
  overflow: 'hidden',
};

const buttonStyles = {
  marginTop: '20px',
  backgroundColor: '#ff0000',
  color: '#ffffff',
  padding: '10px 20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  '&:hover': {
    backgroundColor: '#cc0000',
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDetails = {
        fullName: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
        uid: user.uid,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userDetails, { merge: true });
      navigate('/');
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={containerStyles}>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          Sign in to access the SOS features
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={handleLogin}
          disabled={isLoading}
          sx={buttonStyles}
          startIcon={<GoogleIcon />}
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </Container>
    </Box>
  );
};

export default Login;