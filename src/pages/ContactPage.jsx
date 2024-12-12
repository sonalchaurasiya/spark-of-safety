import React, { useState } from 'react';
import { Box, Button, TextField, Typography, useMediaQuery, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Style constants
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: '#333333',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(255, 255, 255, 0.1)',
  },
  textField: {
    '& .MuiInputLabel-root': { color: '#ffffff' },
    '& .MuiInputBase-input': { color: '#ffffff' },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ffffff',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ffffff',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ffffff',
    },
  },
  submitButton: {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '10px 20px',
    borderRadius: '50px',
    boxShadow: '0px 8px 15px rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#cccccc',
      boxShadow: '0px 15px 20px rgba(255, 255, 255, 0.4)',
    },
    '&:disabled': {
      backgroundColor: '#666666',
      color: '#999999',
    },
  },
};

const ContactPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    if (!validateEmail(email)) {
      setNotification({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'warning'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotification({
          open: true,
          message: 'Thank you for your message! We\'ll get back to you soon.',
          severity: 'success'
        });
        e.target.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setNotification({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        ...styles.container,
        padding: isSmallScreen ? '20px' : '40px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          ...styles.form,
          width: isSmallScreen ? '100%' : '50%',
        }}
      >
        <input type="hidden" name="access_key" value="38889801-54ae-4f23-a2b0-da12b9a9c7ad" />
        <input type="hidden" name="from_name" value="Spark of Safety" />
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
        
        {['name', 'email'].map((field) => (
          <TextField
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            name={field}
            type={field === 'email' ? 'email' : 'text'}
            variant="outlined"
            fullWidth
            required
            sx={styles.textField}
          />
        ))}
        
        <TextField
          label="Message"
          name="message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          required
          sx={styles.textField}
        />
        
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={styles.submitButton}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setNotification(prev => ({ ...prev, open: false }))} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;