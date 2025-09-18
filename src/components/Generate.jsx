import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../util/axios';

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',

  padding: theme.spacing(0, 2),
}));

function Generate() {
  const [formData, setFormData] = useState({
    task_intent: '',
    strict_guidelines: '',
    expected_output: '',
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
    setResponseData({});
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        'http://localhost:8003/generate-green-prompt',
        {
          ...formData,
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
        <Typography variant="h6">Generate Prompt:</Typography>

        <form onSubmit={handleSubmit}>
          <Paper
            elevation={1}
            sx={{
              minHeight: 120,
              p: 2,
              bgcolor: '#f5f5f5',
            }}
          >
            <Grid container spacing={2} alignItems="stretch">
              <Grid size={6}>
                <TextField
                  name="task_intent"
                  fullWidth
                  variant="outlined"
                  placeholder="Please enter text"
                  label="Task Intent"
                  onChange={handleChange}
                  multiline
                  rows={3}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  name="strict_guidelines"
                  fullWidth
                  variant="outlined"
                  placeholder="Please enter text"
                  label="Strict Guidelines"
                  onChange={handleChange}
                  multiline
                  rows={3}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  name="expected_output"
                  fullWidth
                  variant="outlined"
                  placeholder="Please enter text"
                  label="Expected Output"
                  onChange={handleChange}
                  multiline
                  rows={2}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </Box>

      <Box mt={2}>
        <Typography variant="h6" mb={1}>
          Green Prompt:
        </Typography>

        <Paper
          elevation={1}
          sx={{
            minHeight: 220,
            maxHeight: 220,
            overflowY: 'auto',
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
        <Typography variant="body1" mb={2}>
          Tokens Saved: {responseData?.token_savings || 0}
        </Typography>
        <Typography variant="body1" mb={2}>
          Carbon Saved: {responseData?.carbon_savings || 0}
          <Typography variant="body2" component="span">
            {' '}
            (CO2e)
          </Typography>
        </Typography>

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

export default Generate;
