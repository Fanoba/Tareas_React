import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import "../styles/Main_Header.css"; // Asegúrate de que la ruta sea correcta

export const MAIN_HEADER = () => {
  return (
    <AppBar position="static" className="header-container">
      <Toolbar className="header-toolbar">
        {/* Imagen */}
        <Box 
          component="img"
          src="img/chatbot.png" // Ruta de la imagen
          alt="Logo"
          className="header-image"
        />
        
        {/* Título y subtítulo */}
        <div className="header-text-container">
          <Typography 
            variant="h4" 
            component="h1" 
            className="header-title"
          >
            AI-Chat
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            component="h2"
            className="header-subtitle"
          >
            Next-generation AI communication interface
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};
