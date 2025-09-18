import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  MenuItem,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../util/axios';

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(0, 2),
}));

function Prompt() {
  const [formData, setFormData] = useState({
    INPUT_PROMPT: '',
    MODEL: 'sonar',
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

    try {
      const response = await axiosInstance.post(
        'http://localhost:8002/call-llm',
        {
          INPUT_PROMPT: formData.INPUT_PROMPT,
          MODEL: formData.MODEL,
        }
      );
      setResponseData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Root>
      <Box display={'flex'} justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Output Prompt:</Typography>
      </Box>

      <Paper
        elevation={1}
        sx={{
          minHeight: '350px',
          height: `calc(100vh - 280px)`,
          bgcolor: '#e0e0e0',
          p: 2,

          overflowY: 'auto',
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography variant="body2" color="textSecondary">
            {responseData?.OUTPUT_PROMPT}
          </Typography>
        )}

        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </Paper>

      <Box my={2}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid size={3}>
              <TextField
                select
                name="MODEL"
                value={formData.MODEL}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                label="Model"
              >
                <MenuItem value="sonar">Sonar</MenuItem>
                <MenuItem value="sonar-pro">Sonar pro</MenuItem>
                <MenuItem value="sonar-deep-research">
                  Sonar deep research
                </MenuItem>
                <MenuItem value="sonar-reasoning">Sonar reasoning</MenuItem>
                <MenuItem value="sonar-reasoning-pro">
                  Sonar reasoning pro
                </MenuItem>
              </TextField>
            </Grid>
            <Grid size={9}>
              <TextField
                name="INPUT_PROMPT"
                fullWidth
                variant="outlined"
                placeholder="Please enter your prompt here"
                label="Input Prompt"
                onChange={handleChange}
                multiline={true}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={12} textAlign="right">
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Root>
  );
}

export default Prompt;
