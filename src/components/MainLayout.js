import React from 'react';
import { Button, Box, useMediaQuery, Tooltip } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SupportIcon from '@mui/icons-material/Support';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneIcon from '@mui/icons-material/Phone';
import PermissionsRequest from './PermissionsRequest';

const emergencyButtons = [
  {
    label: 'Call Ambulance',
    icon: LocalHospitalIcon,
    tel: '102',
    gradient: {
      colors: ['#5b86e5', '#36d1dc'],
      shadow: 'rgba(91, 134, 229, 0.3)',
      shadowHover: 'rgba(91, 134, 229, 0.4)',
    }
  },
  {
    label: 'Women Helpline',
    icon: PhoneIcon,
    tel: '112',
    gradient: {
      colors: ['#ff4b2b', '#ff416c'],
      shadow: 'rgba(255, 75, 43, 0.3)',
      shadowHover: 'rgba(255, 75, 43, 0.4)',
    }
  },
  {
    label: 'Police Helpline',
    icon: SupportIcon,
    tel: '100',
    gradient: {
      colors: ['#34ebba', '#00c6ff'],
      shadow: 'rgba(52, 235, 186, 0.3)',
      shadowHover: 'rgba(52, 235, 186, 0.4)',
    }
  }
];

const MainLayout = () => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const getButtonStyles = (gradient) => ({
    backgroundColor: gradient.colors[0],
    backgroundImage: `linear-gradient(315deg, ${gradient.colors[0]} 0%, ${gradient.colors[1]} 74%)`,
    color: '#fff',
    borderRadius: '50px',
    padding: isSmallScreen ? '8px 16px' : '10px 20px',
    fontSize: isSmallScreen ? '12px' : '16px',
    boxShadow: `0px 8px 15px ${gradient.shadow}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0px 15px 20px ${gradient.shadowHover}`,
    },
  });

  return (
    <div className="relative min-h-screen">
      <PermissionsRequest />
      <Outlet />

      <Box
        sx={{
          position: 'fixed',
          bottom: isSmallScreen ? '10px' : '20px',
          right: isSmallScreen ? '10px' : '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: isSmallScreen ? '10px' : '20px',
          zIndex: 1000,
        }}
      >
        {emergencyButtons.map(({ label, icon: Icon, tel, gradient }) => (
          <Tooltip 
            key={label}
            title={`Call ${label}: ${tel}`}
            placement="left"
            arrow
          >
            <Button
              variant="contained"
              startIcon={<Icon />}
              onClick={() => window.location.href = `tel:${tel}`}
              sx={getButtonStyles(gradient)}
            >
              {label}
            </Button>
          </Tooltip>
        ))}
      </Box>
    </div>
  );
};

export default MainLayout;