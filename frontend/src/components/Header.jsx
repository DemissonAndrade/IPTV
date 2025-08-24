import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  styled,
  alpha
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})(({ theme, scrolled }) => ({
  background: scrolled 
    ? alpha(theme.palette.primary.main, 0.9)
    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  transition: 'all 0.3s ease-in-out',
  backdropFilter: scrolled ? 'blur(8px)' : 'none',
  borderRadius: '0 0 16px 16px',
  boxShadow: scrolled ? '0 4px 10px rgba(0, 0, 0, 0.1)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  // Efeito de scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Menu categorias dropdown
  const [anchorElCat, setAnchorElCat] = useState(null);
  const handleOpenCat = (event) => setAnchorElCat(event.currentTarget);
  const handleCloseCat = () => setAnchorElCat(null);

  // Menu mobile
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const handleMobileMenuOpen = (event) => setMobileMenuAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  const categorias = ['Ação', 'Comédia', 'Drama', 'Ficção Científica', 'Terror'];

  const handleNavigate = (path) => {
    navigate(path);
    handleMobileMenuClose();
    handleCloseCat();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavButton = styled(Button)(({ theme }) => ({
    color: theme.palette.common.white,
    fontWeight: 500,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.1),
      transform: 'translateY(-2px)'
    }
  }));

  const renderDesktopMenu = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, ml: 3 }}>
      <NavButton onClick={() => handleNavigate('/movies')}>
        Filmes
      </NavButton>

      <NavButton onClick={() => handleNavigate('/series')}>
        Séries
      </NavButton>

      <NavButton
        onClick={handleOpenCat}
        aria-controls="categorias-menu"
        aria-haspopup="true"
      >
        Categorias
      </NavButton>

      <NavButton onClick={() => handleNavigate('/channels')}>
        TV ao Vivo
      </NavButton>
    </Box>
  );

  const renderMobileMenu = (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleMobileMenuOpen}
        sx={{ mr: 1 }}
      >
        <MenuIcon />
      </IconButton>

      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <MenuItem onClick={() => handleNavigate('/movies')}>Filmes</MenuItem>
        <MenuItem onClick={() => handleNavigate('/series')}>Séries</MenuItem>
        <MenuItem onClick={() => handleNavigate('/channels')}>TV ao Vivo</MenuItem>
        <MenuItem onClick={handleOpenCat}>Categorias</MenuItem>
      </Menu>

      <Menu
        id="categorias-menu-mobile"
        anchorEl={anchorElCat}
        open={Boolean(anchorElCat)}
        onClose={handleCloseCat}
      >
        {categorias.map((cat) => (
          <MenuItem 
            key={cat} 
            onClick={() => handleNavigate(`/categoria/${cat.toLowerCase()}`)}
          >
            {cat}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

 };

export default Header;
