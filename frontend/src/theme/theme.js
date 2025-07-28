import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#333333',
      contrastText: '#ffffff', // Adicionado para garantir contraste
    },
    secondary: {
      main: '#d81b60',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f2f2f2',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontSize: '2.5rem', fontWeight: 500, lineHeight: 1.2 },
    h5: { fontSize: '2rem', fontWeight: 500, lineHeight: 1.3 },
    h6: { fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.4 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f2f2f2',
          color: '#212121',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 24,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    // Adicionado para os cabeçalhos de categoria
    MuiPaper: {
      styleOverrides: {
        root: {
          '& .category-header': {
            backgroundColor: '#333333',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#424242',
            },
            '& .MuiTypography-root, .MuiSvgIcon-root': {
              color: '#ffffff !important',
            },
            '& .MuiChip-root': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
            },
          },
        },
      },
    },
  },
});

export default theme;