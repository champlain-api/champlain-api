
// import React, { useState } from 'react';
// import axios from 'axios'; // npm install axios (frontend library makes HTTP requests from browser)
import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import clubsData from './clubs.json';
import facultyData from './faculty.json';

import { Container, Typography, Button, Box, Menu, MenuItem, Stack} from "@mui/material";

function DropdownMenu({
  title,
  options,
  onAction
}: {
  title: string;
  options: string[];
  onAction: (action: string) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: string) => {
    onAction(action); // Use the prop
    handleClose();
  };

  return (
    <>
      <Button variant="contained" onClick={handleClick}>
        {title}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleAction(option)}>
            {option} {title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function MyApp() {
  const [clubs, setClubs] = useState<string[]>([]);
  const [showClubs, setShowClubs] = useState(false);

  const [faculty, setFaculty] = useState<string[]>([]);
  const [showFaculty, setShowFaculty] = useState(false);


  const handleClubAction = (action: string) => {
    if (action === 'Get') {
      const names = clubsData.map((club: any) => club.clubName);
      setClubs(names);
      setShowClubs(true);
    } else {
      setShowClubs(false);
      console.log(`${action} clicked`);
    }
  };

  const handleFacultyAction = (action: string) => {
    if(action === 'Get') {
      const names = facultyData.map((faculty: any) => faculty.name);
      setFaculty(names); 
      setShowFaculty(true); 
    } else { 
      setShowFaculty(false);
    }
  };

  return (
    <Container>
      <Box mt={4} sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to The Demo Admin Dashboard
        </Typography>
        </Box>

        <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Stack spacing={2} direction="row">
        <DropdownMenu
          title="Club"
          options={["Add", "Delete", "Edit", "Get"]}
          onAction={handleClubAction}
        />
        <DropdownMenu
          title="Faculty"
          options={["Add", "Delete", "Edit", "Get"]}
          onAction={handleFacultyAction} 
        />
        <DropdownMenu 
          title="Announcement" 
          options={["Add", "Delete", "Edit", "Get"]} 
          onAction={()=>{}} 
        />
        </Stack>
      </Box>

      {showClubs && (
        <Box mt={4}>
          <Typography variant="h6">Available Clubs:</Typography>
          <ul>
            {clubs.map((club, idx) => (
              <li key={idx}>{club}</li>
            ))}
          </ul>
        </Box>
      )}

      {showFaculty && (
        <Box mt={4}>
          <Typography variant="h6">Current Faculty:</Typography>
          <ul>
            {faculty.map((faculty, idx) => (
              <li key={idx}>{faculty}</li>
            ))}
          </ul>
        </Box>
      )}
 
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 1.5,
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: "white",
          width: 120
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Default User
        </Typography>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
          alt="Default profile"
          style={{
            width: 45,
            height: 45,
            borderRadius: "50%",
            margin: "8px 0",
          }}
        />
        <Button variant="contained" size="small" sx={{ fontSize: "0.7rem" }}>Login</Button>
      </Box>
    </Container>
  );
}