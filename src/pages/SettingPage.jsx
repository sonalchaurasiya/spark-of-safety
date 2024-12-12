import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Switch, TextField, Divider } from '@mui/material';
import { auth, db } from '../components/firebaseConfig'; // Ensure correct path
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: false,
    },
    privacy: {
      shareLocation: true,
      shareUsageData: false,
    },
    security: {
      twoFactorAuth: false,
    },
    sosOptions: {
      voiceActivation: true,
      autoAlerts: false,
    },
    profile: {
      fullName: '',
      email: '',
    }
  });

  const [openDialog, setOpenDialog] = useState(false); // State for dialog

  useEffect(() => {
    const fetchSettings = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        try {
          const settingsDoc = await getDoc(doc(db, 'settings', currentUser.uid));
          if (settingsDoc.exists()) {
            setSettings(settingsDoc.data());
          } else {
            console.log('No settings document found, using default settings.');
          }
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (section, key) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [key]: !prevSettings[section][key],
      },
    }));
  };

  const handleInputChange = (e, section, key) => {
    const { value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    setOpenDialog(true); // Open confirmation dialog
  };

  const confirmSave = async () => {
    if (user) {
      try {
        await setDoc(doc(db, 'settings', user.uid), settings, { merge: true });
        alert('Settings updated successfully!');
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    }
    setOpenDialog(false); // Close dialog after saving
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close dialog without saving
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        marginTop: '20px',
        backgroundColor: '#1c1c1e',
        color: 'white',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      }}
    >
      <Typography variant="h4" gutterBottom style={{ color: '#ff4d4d' }}>
        Settings
      </Typography>
      <Divider style={{ marginBottom: '20px', backgroundColor: '#555' }} />

      {/* Profile Section */}
      <Box mb={4}>
        <Typography variant="h6" style={{ color: '#ff4d4d' }}>Profile</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Full Name"
          value={settings.profile?.fullName || ''}
          onChange={(e) => handleInputChange(e, 'profile', 'fullName')}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={settings.profile?.email || ''}
          onChange={(e) => handleInputChange(e, 'profile', 'email')}
          disabled
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          style={{ marginBottom: '20px' }}
        />
      </Box>

      {/* Notification Section */}
      <Box mb={4}>
        <Typography variant="h6" style={{ color: '#ff4d4d' }}>Notifications</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography>Email Notifications</Typography>
          <Switch
            checked={settings.notifications.email}
            onChange={() => handleToggle('notifications', 'email')}
            color="error"
          />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography>SMS Notifications</Typography>
          <Switch
            checked={settings.notifications.sms}
            onChange={() => handleToggle('notifications', 'sms')}
            color="error"
          />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography>Push Notifications</Typography>
          <Switch
            checked={settings.notifications.push}
            onChange={() => handleToggle('notifications', 'push')}
            color="error"
          />
        </Box>
      </Box>

      {/* Privacy Section */}
      <Box mb={4}>
        <Typography variant="h6" style={{ color: '#ff4d4d' }}>Privacy</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography>Share Location</Typography>
          <Switch
            checked={settings.privacy.shareLocation}
            onChange={() => handleToggle('privacy', 'shareLocation')}
            color="error"
          />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography>Share Usage Data</Typography>
          <Switch
            checked={settings.privacy.shareUsageData}
            onChange={() => handleToggle('privacy', 'shareUsageData')}
            color="error"
          />
        </Box>
      </Box>

      {/* Security Section */}
      <Box mb={4}>
        <Typography variant="h6" style={{ color: '#ff4d4d' }}>Security</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography>Two-Factor Authentication</Typography>
          <Switch
            checked={settings.security.twoFactorAuth}
            onChange={() => handleToggle('security', 'twoFactorAuth')}
            color="error"
          />
        </Box>
      </Box>

      {/* SOS Section */}
      <Box mb={4}>
        <Typography variant="h6" style={{ color: '#ff4d4d' }}>SOS Options</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography>Voice Activation</Typography>
          <Switch
            checked={settings.sosOptions.voiceActivation}
            onChange={() => handleToggle('sosOptions', 'voiceActivation')}
            color="error"
          />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography>Auto Alerts</Typography>
          <Switch
            checked={settings.sosOptions.autoAlerts}
            onChange={() => handleToggle('sosOptions', 'autoAlerts')}
            color="error"
          />
        </Box>
      </Box>

      <Box sx={{ paddingBottom: 8 }}> {/* Add padding to the bottom */}
        <Button
          variant="contained"
          color="error"
          onClick={handleSave}
          sx={{ backgroundColor: '#ff4d4d', color: 'white' }}
        >
          Save Settings
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to save these settings?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmSave} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
