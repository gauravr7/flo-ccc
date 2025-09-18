import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Optimise from './components/Optimise';
import Generate from './components/Generate';
import Prompt from './components/Prompt';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Box p={2}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prompt" element={<Prompt />} />
          <Route path="/optimise" element={<Optimise />} />
          <Route path="/generate" element={<Generate />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
