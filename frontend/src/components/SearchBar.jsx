import React, { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Pesquisar filmes, séries e canais..."
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch} edge="end" aria-label="search">
                <Search />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 3,
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
