import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Slider,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Settings,
  ClosedCaption
} from '@mui/icons-material';
import ReactPlayer from 'react-player';
import Hls from 'hls.js';

const VideoPlayer = ({ 
  streamUrl, 
  title, 
  onProgress, 
  onEnded,
  autoPlay = false,
  showControls = true 
}) => {
  const [playing, setPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qualityMenuAnchor, setQualityMenuAnchor] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [availableQualities, setAvailableQualities] = useState(['auto', '720p', '480p', '360p']);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  
  const playerRef = useRef(null);
  const hlsRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (streamUrl) {
      setLoading(true);
      setError(null);
      
      // Se for HLS e o navegador não suportar nativamente
      if (streamUrl.includes('.m3u8') && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        
        hlsRef.current = hls;
        
        hls.loadSource(streamUrl);
        if (videoRef.current) {
          hls.attachMedia(videoRef.current);
        }
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          // Extrair qualidades disponíveis
          const levels = hls.levels.map(level => `${level.height}p`);
          setAvailableQualities(['auto', ...levels]);
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          setError('Erro ao carregar o stream');
          setLoading(false);
        });
        
        return () => {
          hls.destroy();
        };
      }
    }
  }, [streamUrl]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue / 100);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleSeek = (event, newValue) => {
    const seekTo = newValue / 100;
    setPlayed(seekTo);
    if (playerRef.current) {
      playerRef.current.seekTo(seekTo);
    }
  };

  const handleProgress = (progress) => {
    setPlayed(progress.played);
    if (onProgress) {
      onProgress(progress);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleEnded = () => {
    setPlaying(false);
    if (onEnded) {
      onEnded();
    }
  };

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    setQualityMenuAnchor(null);
    
    if (hlsRef.current) {
      if (quality === 'auto') {
        hlsRef.current.currentLevel = -1; // Auto
      } else {
        const levelIndex = hlsRef.current.levels.findIndex(
          level => `${level.height}p` === quality
        );
        if (levelIndex !== -1) {
          hlsRef.current.currentLevel = levelIndex;
        }
      }
    }
  };

  const handleFullscreen = () => {
    if (playerRef.current) {
      const playerElement = playerRef.current.wrapper;
      if (playerElement.requestFullscreen) {
        playerElement.requestFullscreen();
      } else if (playerElement.webkitRequestFullscreen) {
        playerElement.webkitRequestFullscreen();
      } else if (playerElement.mozRequestFullScreen) {
        playerElement.mozRequestFullScreen();
      }
    }
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ position: 'relative', backgroundColor: '#000' }}>
      <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 */ }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        <ReactPlayer
          ref={playerRef}
          url={streamUrl}
          playing={playing}
          volume={volume}
          muted={muted}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleEnded}
          onReady={() => setLoading(false)}
          onError={(error) => {
            console.error('Player Error:', error);
            setError('Erro ao reproduzir o vídeo');
            setLoading(false);
          }}
          config={{
            file: {
              attributes: {
                crossOrigin: 'anonymous'
              }
            }
          }}
        />
        
        {/* Controles customizados */}
        {showControls && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              padding: 2,
              zIndex: 1
            }}
          >
            {/* Barra de progresso */}
            <Slider
              value={played * 100}
              onChange={handleSeek}
              sx={{ 
                color: '#ff6b35',
                height: 4,
                marginBottom: 1,
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12
                }
              }}
            />
            
            {/* Controles */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                onClick={handlePlayPause}
                sx={{ color: 'white' }}
              >
                {playing ? <Pause /> : <PlayArrow />}
              </IconButton>
              
              <IconButton 
                onClick={handleMute}
                sx={{ color: 'white' }}
              >
                {muted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
              
              <Slider
                value={volume * 100}
                onChange={handleVolumeChange}
                sx={{ 
                  width: 100,
                  color: 'white',
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12
                  }
                }}
              />
              
              <Typography variant="body2" sx={{ color: 'white', minWidth: 80 }}>
                {formatTime(played * duration)} / {formatTime(duration)}
              </Typography>
              
              <Box sx={{ flexGrow: 1 }} />
              
              {/* Qualidade */}
              <Chip
                label={selectedQuality}
                size="small"
                onClick={(e) => setQualityMenuAnchor(e.currentTarget)}
                sx={{ 
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
                variant="outlined"
              />
              
              <IconButton 
                onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                sx={{ color: subtitlesEnabled ? '#ff6b35' : 'white' }}
              >
                <ClosedCaption />
              </IconButton>
              
              <IconButton 
                onClick={handleFullscreen}
                sx={{ color: 'white' }}
              >
                <Fullscreen />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
      
      {title && (
        <CardContent>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        </CardContent>
      )}
      
      {/* Menu de qualidade */}
      <Menu
        anchorEl={qualityMenuAnchor}
        open={Boolean(qualityMenuAnchor)}
        onClose={() => setQualityMenuAnchor(null)}
      >
        {availableQualities.map((quality) => (
          <MenuItem
            key={quality}
            selected={quality === selectedQuality}
            onClick={() => handleQualityChange(quality)}
          >
            {quality}
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
};

export default VideoPlayer;

