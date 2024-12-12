import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { keyframes } from '@emotion/react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnQm3YwMddHPA_ODQo3WSk0iU6eL09wm0",
  authDomain: "spark-of-safety.firebaseapp.com",
  projectId: "spark-of-safety",
  storageBucket: "spark-of-safety.firebasestorage.app",
  messagingSenderId: "1011253492567",
  appId: "1:1011253492567:web:c63a618f480966c10ddc12",
  measurementId: "G-QT0XTZJ3FH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Animation for SOS button
const fillUnfill = keyframes`
  0% { background-color: transparent; }
  50% { background-color: #ff0000; }
  100% { background-color: transparent; }
`;

const Hero = () => {
  const [clicked, setClicked] = useState(false);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState(null);
  const [locationLink, setLocationLink] = useState('');

  const handleClick = async () => {
    setClicked(true);
    setMessage('Capturing location...');

    // Geolocation to capture user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude: latitude,
          longitude: longitude,
        });

        // Generate Google Maps link
        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setLocationLink(googleMapsLink);

        setMessage('Forwarding location to police and emergency contacts...');
        
        try {
          // Save user's location to Firestore
          await addDoc(collection(db, 'sos_requests'), {
            latitude: latitude,
            longitude: longitude,
            timestamp: new Date(),
            mapLink: googleMapsLink,  // Store the Google Maps link in Firestore
          });
          console.log('Location saved:', { latitude, longitude });

          // Notify emergency contacts (example: calling police)
        window.location.href = 'tel:100'; // Replace with actual emergency contact numbers

          // Show final message after saving location
          setTimeout(() => {
            setMessage('Help on the way');
          }, 2000);
        } catch (e) {
          console.error('Error adding document: ', e);
          setMessage('Failed to forward location');
        }
      },
      (error) => {
        console.error('Error obtaining location', error);
        setMessage('Failed to capture location');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <Box
      sx={{
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
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
          Emergency SOS
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Immediate assistance at your fingertips. Stay safe with Spark of Safety.
        </Typography>
        <Box
          sx={{
            marginTop: '20px',
            borderRadius: '50%',
            width: '120px',
            height: '120px',
            border: '5px solid #ff0000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: clicked ? 'none' : `${fillUnfill} 1s infinite`,
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
            margin: '0 auto',
          }}
          onClick={handleClick}
        >
          <Button
            variant="contained"
            color="error"
            size="large"
            startIcon={<HelpIcon />}
            sx={{
              borderRadius: '50%',
              width: '100px',
              height: '100px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            SOS
          </Button>
        </Box>
        {message && (
          <Typography
            variant="h4"
            component="p"
            sx={{
              marginTop: '20px',
              backgroundColor: '#ff0000',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            {message}
          </Typography>
        )}
        {locationLink && (
          <Typography
            variant="h6"
            component="a"
            href={locationLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              marginTop: '20px',
              color: '#00ff00',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            View Location on Google Maps
          </Typography>
        )}
        {location && (
          <Typography variant="h6" component="p" sx={{ marginTop: '20px' }}>
            Location: {`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default Hero;
