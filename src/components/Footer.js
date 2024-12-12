import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '20px 0',
        textAlign: 'center',
        marginTop: 'auto',
        width: '100%',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Spark of Safety. All rights reserved.{' '}
        <Link href="http://www.igecsagar.ac.in/" color="inherit" underline="hover">
          IT Department IGEC Sagar.
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;