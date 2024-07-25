import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function Buttons() {
  const buttons = [
    "Cozy",
    "Trendy",
    "Vegan",
    "Time: 1:00PM",
    "Casual",
    "Romantic",
    "Vegetarian",
    "Time: 2:00PM",
    "Lively",
    "Outdoor Seating",
    "Gluten-Free",
    "Pet Friendly? (create checkbox here)",
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "40vh",
        backgroundColor: "#f0f0f0", // background clr container
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
          p: 2,
          backgroundColor: "#057", // bckground color for the grid
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        {buttons.map((label, index) => (
          <Button key={index} variant="contained" size="small">
            {label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
