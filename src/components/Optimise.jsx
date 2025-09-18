import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../util/axios';

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',

  padding: theme.spacing(0, 2),
}));

function Optimise() {
  const [formData, setFormData] = useState({
    USER_PROMPT: '',
  });
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseData({});

    try {
      const response = await axiosInstance.post(
        'http://localhost:8003/optimize-green-prompt',
        {
          USER_PROMPT: formData.USER_PROMPT,
        }
      );
      setResponseData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(responseData?.GREEN_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Root>
      <Box>
        <Typography variant="h6" my={1}>
          Input Prompt:
        </Typography>

        <form onSubmit={handleSubmit}>
          <Paper
            elevation={1}
            sx={{
              minHeight: 120,
              p: 2,
              bgcolor: '#f5f5f5',
              mb: 2,
            }}
          >
            <TextField
              name="USER_PROMPT"
              fullWidth
              variant="outlined"
              placeholder="Please enter your prompt here"
              onChange={handleChange}
              multiline
              rows={6}
            />
            <Button variant="contained" type="submit" sx={{ mt: 2 }}>
              Submit
            </Button>
          </Paper>
        </form>
      </Box>

      <Box>
        <Typography variant="h6" my={1}>
          Green Prompt:
        </Typography>

        <Paper
          elevation={1}
          sx={{
            minHeight: 250,
            p: 2,
            bgcolor: '#f5f5f5',
            mb: 2,
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography variant="body2" color="textSecondary">
              {responseData?.GREEN_PROMPT}
            </Typography>
          )}

          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Paper>
        {/* <Typography variant="body1" mb={2}>
          Tokens Saved: {responseData?.TOTAL_TOKEN_COUNT || 0}
        </Typography> */}

        <Button
          variant="contained"
          color="success"
          onClick={handleCopy}
          disabled={!responseData?.GREEN_PROMPT}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </Box>
    </Root>
  );
}

export default Optimise;
