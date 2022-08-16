import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Outlet } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { useLocation } from 'react-router-dom'; 
import Header from './components/Header/Header';

function LobbyApp() {
  const [title, setTitle] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    let path = location.pathname.split("/");
    // const parsedTitle = location.pathname.replace(/\W/g, ' ');
    let parsedTitle = path[path.length-1];
     setTitle(parsedTitle);
  }, [location]);

  return (
    <Grid container>
      <Navbar />
      <Header title={title} />
      <Outlet />
    </Grid>
  );
}

export default LobbyApp;