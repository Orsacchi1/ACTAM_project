import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { Menu as MenuIcon, MusicNote } from "@mui/icons-material";

function Header({ onMenuClick }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <MusicNote sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ACTAM Synth Demo
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
