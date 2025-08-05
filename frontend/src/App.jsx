import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import Channels from './pages/Channels';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import ChannelPlayer from './pages/ChannelPlayer';
import VODPlayer from './pages/VODPlayer';
import DashboardPage from './pages/DashboardPage';
import Categories from './pages/Categories';
import About from './pages/About';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Support from './pages/Support';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Navbar />
            <Container component="main" sx={{ flex: 1, mt: '80px' }}>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/home" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                {/* Removendo rota /loginPage pois LoginPage não é necessária */}
                { <Route path="/login" element={<LoginPage/>} />}
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/register" element={<Register />} />
                <Route path="/channels" element={<Channels />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/series" element={<Series />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/channel/:channelId" element={<ChannelPlayer />} />
                <Route path="/vod/:contentId" element={<PrivateRoute><VODPlayer /></PrivateRoute>} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                <Route path="/support" element={<Support />} />
              </Routes>
            </Container>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
