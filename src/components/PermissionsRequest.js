import React, { useEffect, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const PermissionsRequest = () => {
  const [permissionStatus, setPermissionStatus] = useState({
    location: null,
    camera: null,
    microphone: null
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const showAlert = (message, type = 'info', canRetry = false) => {
    setNotificationMessage(
      canRetry ? `${message} Click to retry.` : message
    );
    setNotificationType(type);
    setShowNotification(true);
  };

  const handleRetry = async () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      setShowNotification(false);
      await requestPermissions();
    }
  };

  const requestLocationPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setPermissionStatus(prev => ({ ...prev, location: 'unsupported' }));
      showAlert('Location services are not supported by your browser.', 'error');
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      setPermissionStatus(prev => ({ ...prev, location: 'granted' }));
      showAlert('Location access granted successfully', 'success');
      console.log('Location permission granted:', position);
    } catch (error) {
      setPermissionStatus(prev => ({ ...prev, location: 'denied' }));
      showAlert('Location access denied. Some features may not work properly.', 'warning');
      console.error('Location permission denied:', error);
    }
  }, []);

  const requestMediaPermissions = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionStatus(prev => ({
        ...prev,
        camera: 'unsupported',
        microphone: 'unsupported'
      }));
      showAlert('Media devices are not supported by your browser.', 'error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setPermissionStatus(prev => ({
        ...prev,
        camera: 'granted',
        microphone: 'granted'
      }));
      showAlert('Camera and microphone access granted successfully', 'success');
      
      // Release the devices immediately
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      const deniedDevice = error.name === 'NotAllowedError' ? 'Permission' : 
                          error.name === 'NotFoundError' ? 'Device' : 'Access';
      
      setPermissionStatus(prev => ({
        ...prev,
        camera: 'denied',
        microphone: 'denied'
      }));
      showAlert(`${deniedDevice} denied for camera/microphone. Some features may not work properly.`, 'warning');
      console.error('Media permissions denied:', error);
    }
  }, []);

  const requestPermissions = useCallback(async () => {
    await requestLocationPermission();
    await requestMediaPermissions();
  }, [requestLocationPermission, requestMediaPermissions]);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  return (
    <>
      <div style={{ fontSize: '0.75rem' }}>
        Permissions Status:
        <br />
        <b>Location:</b> {permissionStatus.location},<br />
        <b>Camera:</b> {permissionStatus.camera},<br />
        <b>Microphone:</b> {permissionStatus.microphone}
      </div>
      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
        onClick={handleRetry}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowNotification(false)} 
          severity={notificationType}
          sx={{ width: '100%', cursor: retryCount < MAX_RETRIES ? 'pointer' : 'default' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PermissionsRequest;