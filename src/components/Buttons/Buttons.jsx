import React from "react";
import { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

const CustomButton = styled(Button)({
  backgroundColor: '#057', // bgrnd color
  color: '#fff', // text
  borderRadius: 16, // rounded corners
  margin: '0 8px', // spacing between btns
  '&:hover': {
    backgroundColor: '#046', // hover coloration
  },
  fontSize: '0.875rem', // make sure font relative to root
});



export default function Buttons() {
  const buttons = [
    "Cozy",
    "Trendy",
    "Vegan",
    "Casual",
    "Romantic",
    "Vegetarian",
    "Lively",
    "Outdoor Seating",
    "Gluten-Free",
    "Pet Friendly? (create checkbox here)",
  ];


const [time, setTime] = useState('');

const handleTimeChange = (event) => {
  setTime(event.target.value);
};

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap", 
        justifyContent: "center",
        alignItems: "center",
        height: "auto", 
        backgroundColor: "#111", // background color container
        p: 1,
        gap: 1, 
      }}
    >
      {buttons.map((label, index) => (
        <CustomButton key={index} variant="contained" size="small">
          {label}
        </CustomButton>
      ))}
    <FormControl sx={{ minWidth: 120, margin: '0 8px', backgroundColor: '#FFFFFF' }}>
        <InputLabel id="time-select-label">Start Time</InputLabel>
        <Select
          labelId="time-select-label"
          id="time-select"
          value={time}
          label="Time"
          onChange={handleTimeChange}
        >
                      <MenuItem value={"1:00PM"}>12:00PM</MenuItem>
          <MenuItem value={"1:00PM"}>1:00PM</MenuItem>
          <MenuItem value={"2:00PM"}>2:00PM</MenuItem>
          <MenuItem value={"3:00PM"}>3:00PM</MenuItem>
          <MenuItem value={"1:00PM"}>4:00PM</MenuItem>
          <MenuItem value={"1:00PM"}>5:00PM</MenuItem>
          <MenuItem value={"1:00PM"}>6:00PM</MenuItem>
          <MenuItem value={"1:00PM"}>7:00PM</MenuItem>
          <MenuItem value={"1:00PM"}>8:00PM</MenuItem>
          <MenuItem value={"1:00PM"}>9:00PM</MenuItem>
          <MenuItem value={"1:00PM"}>10:00PM</MenuItem>
        </Select>
    </FormControl>
    </Box>
  );
}
