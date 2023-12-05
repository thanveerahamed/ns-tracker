import TrainIcon from '@mui/icons-material/Train';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Header() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TrainIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            NS Tracker
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            {/*<IconButton*/}
            {/*    size="large"*/}
            {/*    aria-label="account of current user"*/}
            {/*    aria-controls="menu-appbar"*/}
            {/*    aria-haspopup="true"*/}
            {/*    onClick={handleOpenNavMenu}*/}
            {/*    color="inherit"*/}
            {/*>*/}
            {/*    <MenuIcon />*/}
            {/*</IconButton>*/}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
