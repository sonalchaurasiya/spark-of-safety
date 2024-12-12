import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

// Style constants
const appBarStyles = {
  backgroundColor: '#1c1c1c'
};

const logoStyles = {
  flexGrow: 1,
  color: '#ffffff',
  textDecoration: 'none'
};

const commonButtonStyles = {
  color: '#ffffff'
};

const menuButtonStyles = {
  marginLeft: '10px'
};

const menuItems = [
  { label: 'Profile', path: '/profile' },
  { label: 'Settings', path: '/settings' }
];

const Header = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setProfilePic(userDoc.data().profilePic);
          }
        } else {
          setUser(null);
          setProfilePic('');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.signOut();
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <AppBar position="static" sx={appBarStyles}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <CircularProgress color="inherit" size={24} />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static" sx={appBarStyles}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={logoStyles}
        >
          <b>Spark of Safety</b>
        </Typography>
        
        {['features', 'contact'].map((path) => (
          <Button 
            key={path}
            color="inherit" 
            component={Link} 
            to={`/${path}`} 
            sx={commonButtonStyles}
          >
            {path.charAt(0).toUpperCase() + path.slice(1)}
          </Button>
        ))}

        {user ? (
          <>
            <IconButton 
              onClick={handleMenuOpen} 
              sx={menuButtonStyles}
            >
              <Avatar alt={user.displayName} src={profilePic} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {menuItems.map(({ label, path }) => (
                <MenuItem 
                  key={path}
                  component={Link} 
                  to={path} 
                  onClick={handleMenuClose}
                >
                  {label}
                </MenuItem>
              ))}
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button 
            color="inherit" 
            component={Link} 
            to="/login" 
            sx={commonButtonStyles}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;