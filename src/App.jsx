import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Innovate from './components/Innovate';
import Prompt from './components/Prompt';

const basename = import.meta.env.PROD ? '/flo-ccc' : '/';

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Header />
      <Box p={2}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prompt" element={<Prompt />} />
          <Route path="/innovate" element={<Innovate />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
