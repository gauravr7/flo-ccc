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
  gap: theme.spacing(3),
  padding: theme.spacing(3),
}));

function Innovate() {
  // API: 8003/optimize-green-prompt

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
    console.log(formData);
    try {
      const response = await axiosInstance.post(
        'http://localhost:8003/optimize-green-prompt',
        {
          USER_PROMPT: formData.USER_PROMPT,
        }
      );
      setResponseData(response.data);
      //confirm to clear the field after completion
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
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Root>
      <Box>
        <Typography variant="subtitle1" gutterBottom>
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
          </Paper>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </form>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Green Prompt :
        </Typography>
        <Paper
          elevation={1}
          sx={{
            minHeight: 120,
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
        <Button
          variant="contained"
          color="success"
          onClick={handleCopy}
          disabled={!responseData?.GREEN_PROMPT}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </Box>

      <Typography variant="subtitle1">
        Tokens Saved: {responseData?.TOTAL_TOKEN_COUNT}
      </Typography>
    </Root>
  );
}

export default Innovate;
