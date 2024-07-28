import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button"; 
import { Link } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

// Styled link for menu items
const StyledLink = styled(Link)({
  color: "#FFFFFF",
  textDecoration: "none",
  width: "100%",
  display: "block",
  fontWeight: "bold",
  textDecoration: "underline",
});

export default function UserHamburgerMenu() {
  const [anchorEl, setAnchorEl] = useState(null); // Anchor point for the menu
  const user = useSelector((store) => store.user);

  // Open the menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, width: "100%", backgroundColor: "#000" }}>
      <AppBar position="static" sx={{ width: "100%", backgroundColor: "#000" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, backgroundColor: "#000000" }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "#777",
              },
              "& .MuiMenuItem-root": {
                color: "#00CED1",
                "&:hover": {
                  backgroundColor: "#507D80",
                },
              },
            }}
          >
            {!user.id ? (
              <MenuItem onClick={handleMenuClose}>
                <StyledLink to="/login">Login</StyledLink>
              </MenuItem>
            ) : (
              <>
                <MenuItem onClick={handleMenuClose}>
                  <StyledLink to="/user-landing">User Landing</StyledLink>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <StyledLink to="/favorite-locations">
                    Favorite Locations
                  </StyledLink>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <StyledLink to="/user-search-history">
                    Search History
                  </StyledLink>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <StyledLink to="/user-details">User Details</StyledLink>
                </MenuItem>
              </>
            )}
            <MenuItem onClick={handleMenuClose}>
              <StyledLink to="/about">
                Getting Started (THE ABOUT COMPONENT)
              </StyledLink>
            </MenuItem>
            {user.id ? (
              <MenuItem onClick={handleMenuClose}>
                <LogOutButton Button color="inherit" />
              </MenuItem>
            ) : null}
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Menu
          </Typography>
          {user.id && (
            <Button color="inherit">{/* Add Button Content Here */}</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
