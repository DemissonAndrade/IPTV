import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  useTheme, 
  useMediaQuery, 
  Menu, 
  MenuItem, 
  IconButton, 
  Typography,
  AppBar,
  Toolbar,
  Container,
  Stack,
  Avatar,
  Divider,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Movie as MovieIcon,
  LiveTv as LiveTvIcon,
  Theaters as TheatersIcon,
  Category as CategoryIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  HowToReg as RegisterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styled, alpha } from '@mui/material/styles';

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'scrolled',
})(({ theme, scrolled }) => ({
  background: scrolled 
    ? alpha(theme.palette.primary.main, 0.9)
    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: scrolled ? '0 4px 10px rgba(0, 0, 0, 0.1)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(0.5, 0),
  transition: 'all 0.3s ease-in-out',
  backdropFilter: scrolled ? 'blur(8px)' : 'none',
  [theme.breakpoints.down('sm')]: {
    borderRadius: 0,
    padding: theme.spacing(0.25, 0)
  },
  [theme.breakpoints.up('sm')]: {
    borderRadius: '0 0 16px 16px',
  }
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 12,
    minWidth: 200,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    '& .MuiMenuItem-root': {
      padding: theme.spacing(1.5, 2),
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        transform: 'translateX(4px)'
      },
      '& .MuiSvgIcon-root': {
        transition: 'all 0.2s ease',
        fontSize: '1.25rem',
        [theme.breakpoints.down('sm')]: {
          fontSize: '1.1rem'
        }
      },
      '&:hover .MuiSvgIcon-root': {
        color: theme.palette.primary.main,
        transform: 'scale(1.1)'
      }
    }
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 500,
  transition: 'all 0.2s ease',
  padding: theme.spacing(1, 1.5),
  fontSize: '0.875rem',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    transform: 'translateY(-2px)'
  },
  '& .MuiSvgIcon-root': {
    transition: 'all 0.2s ease',
    fontSize: '1.1rem',
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(0.5)
    }
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'scale(1.1)'
  },
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(0.75, 1),
    fontSize: '0.8125rem'
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiButton-startIcon': {
      margin: 0
    },
    span: {
      display: 'none'
    }
  }
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  letterSpacing: '1px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '1.75rem'
  },
  [theme.breakpoints.between('lg', 'xl')]: {
    fontSize: '1.5rem'
  },
  [theme.breakpoints.between('md', 'lg')]: {
    fontSize: '1.25rem'
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '1.1rem'
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [anchorElCat, setAnchorElCat] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const categorias = ['Ação', 'Comédia', 'Drama', 'Ficção Científica', 'Terror', 'Romance', 'Documentário'];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleOpenCat = (event) => setAnchorElCat(event.currentTarget);
  const handleCloseCat = () => setAnchorElCat(null);

  const handleMobileMenuOpen = (event) => setMobileMenuAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  const handleNavigate = (path) => {
    navigate(path);
    handleMobileMenuClose();
    handleCloseCat();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderDesktopMenu = (
    <Stack 
      direction="row" 
      spacing={1} 
      sx={{ 
        flexGrow: 1, 
        ml: { md: 2, lg: 3 },
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}
    >
      <NavButton 
        startIcon={<AccountIcon />} 
        onClick={() => handleNavigate('/quem-somos')}
      >
        Quem Somos
      </NavButton>

      <NavButton 
        startIcon={<MovieIcon />} 
        onClick={() => handleNavigate('/movies')}
      >
        Filmes
      </NavButton>

      <NavButton 
        startIcon={<TheatersIcon />} 
        onClick={() => handleNavigate('/series')}
      >
        Séries
      </NavButton>

      <NavButton
        startIcon={<CategoryIcon />}
        onClick={handleOpenCat}
        aria-controls="categorias-menu"
        aria-haspopup="true"
      >
        Categorias
      </NavButton>
      
      <NavButton 
        startIcon={<LiveTvIcon />} 
        onClick={() => handleNavigate('/channels')}
      >
        TV ao Vivo
      </NavButton>

      <NavButton 
        startIcon={<SearchIcon />} 
        onClick={() => handleNavigate('/search')}
      >
        Buscar
      </NavButton>
    </Stack>
  );

  const renderMobileMenu = (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleMobileMenuOpen}
        sx={{ 
          mr: 1,
          [theme.breakpoints.down('sm')]: {
            padding: '6px'
          }
        }}
      >
        <MenuIcon fontSize={isSmallScreen ? 'medium' : 'large'} />
      </IconButton>

      <StyledMenu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={() => handleNavigate('/quem-somos')}>
          <AccountIcon sx={{ mr: 1.5 }} /> Quem Somos
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/movies')}>
          <MovieIcon sx={{ mr: 1.5 }} /> Filmes
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/series')}>
          <TheatersIcon sx={{ mr: 1.5 }} /> Séries
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/channels')}>
          <LiveTvIcon sx={{ mr: 1.5 }} /> TV ao Vivo
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/search')}>
          <SearchIcon sx={{ mr: 1.5 }} /> Buscar
        </MenuItem>
        <MenuItem onClick={handleOpenCat}>
          <CategoryIcon sx={{ mr: 1.5 }} /> Categorias
        </MenuItem>
      </StyledMenu>

      <StyledMenu
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
      </StyledMenu>
    </>
  );

  const renderAuthButtons = () => (
    <Stack direction="row" spacing={1} alignItems="center">
      {isAuthenticated ? (
        <>
          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center" 
            sx={{ 
              cursor: 'pointer',
              [theme.breakpoints.down('sm')]: {
                '& .MuiTypography-root': {
                  display: 'none'
                }
              }
            }} 
            onClick={() => handleNavigate('/profile')}
          >
            <Avatar sx={{ 
              width: { xs: 30, sm: 36 }, 
              height: { xs: 30, sm: 36 }, 
              bgcolor: 'secondary.main',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" noWrap sx={{ 
              maxWidth: 120,
              [theme.breakpoints.down('md')]: {
                maxWidth: 80
              }
            }}>
              {user?.name || 'Usuário'}
            </Typography>
          </Stack>
          <IconButton 
            color="inherit" 
            onClick={handleLogout} 
            size={isSmallScreen ? 'small' : 'medium'}
            sx={{
              transition: 'all 0.3s ease',
              padding: isSmallScreen ? '6px' : '8px',
              '&:hover': {
                color: theme.palette.error.main,
                transform: 'scale(1.1)'
              }
            }}
          >
            <LogoutIcon fontSize={isSmallScreen ? 'small' : 'medium'} />
          </IconButton>
        </>
      ) : (
        <>
          <NavButton 
            startIcon={<LoginIcon />} 
            onClick={() => navigate('/login')}
            sx={{ 
              px: { xs: 1, sm: 2 },
              [theme.breakpoints.down('sm')]: {
                minWidth: 'auto',
                padding: '6px'
              }
            }}
          >
            {!isSmallScreen && 'Login'}
          </NavButton>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RegisterIcon />}
            onClick={() => navigate('/register')}
            sx={{
              borderRadius: 2,
              boxShadow: 'none',
              transition: 'all 0.3s ease',
              fontSize: '0.875rem',
              padding: { xs: '6px 8px', sm: '8px 16px' },
              minWidth: 'auto',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: theme.palette.secondary.dark,
                transform: 'translateY(-2px)'
              },
              '& .MuiButton-startIcon': {
                marginRight: { xs: 0, sm: '8px' }
              },
              [theme.breakpoints.down('sm')]: {
                span: {
                  display: 'none'
                }
              }
            }}
          >
            {!isSmallScreen && 'Registrar'}
          </Button>
        </>
      )}
    </Stack>
  );

  return (
    <StyledAppBar position="fixed" scrolled={scrolled}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: '56px', sm: '64px' } }}>
          {isMobile && renderMobileMenu}
          
          {/* Logo Aprimorada */}
          <Box 
            onClick={() => navigate('/')}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              mr: { xs: 1, sm: 2 },
              cursor: 'pointer',
              gap: 1
            }}
          >
            <Box
              component="img"
              src="/logo.svg" 
              alt=""
              sx={{ 
                height: { xs: 30, sm: 36, md: 40 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(-5deg) scale(1.1)'
                }
              }}
            />
            <LogoText variant="h6">
              StreamFlix
            </LogoText>
          </Box>
          
          {!isMobile && renderDesktopMenu}

          <Box sx={{ flexGrow: 1 }} />
          
          {renderAuthButtons()}
        </Toolbar>
      </Container>

      {/* Desktop Categories Menu */}
      {!isMobile && (
        <StyledMenu
          id="categorias-menu"
          anchorEl={anchorElCat}
          open={Boolean(anchorElCat)}
          onClose={handleCloseCat}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {categorias.map((cat) => (
            <MenuItem 
              key={cat} 
              onClick={() => handleNavigate(`/categoria/${cat.toLowerCase()}`)}
            >
              {cat}
            </MenuItem>
          ))}
        </StyledMenu>
      )}
    </StyledAppBar>
  );
};

export default Navbar;