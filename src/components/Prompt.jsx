import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../util/axios';

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
}));

function Prompt() {
  // API: 8002/call-llm

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
    console.log(formData);
    try {
      const response = await axiosInstance.post(
        'http://localhost:8002/call-llm',
        {
          INPUT_PROMPT: formData.INPUT_PROMPT,
          MODEL: formData.MODEL,
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

  return (
    <Root>
      {/* Output Window */}
      <Paper
        elevation={1}
        sx={{
          height: 250,
          bgcolor: '#e0e0e0',
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
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

      <Typography variant="body2" color="textSecondary">
        TOTAL_TOKEN_COUNT :{responseData?.TOTAL_TOKEN_COUNT}
      </Typography>

      <Box display="flex" gap={1}>
        <form onSubmit={handleSubmit}>
          <TextField
            name="INPUT_PROMPT"
            fullWidth
            variant="outlined"
            placeholder="Please enter your prompt here"
            label="Input Prompt"
            onChange={handleChange}
          />

          <TextField
            select
            name="MODEL"
            value={formData.MODEL}
            onChange={handleChange}
            variant="outlined"
            sx={{ minWidth: 140 }}
            label="Model"
          >
            <MenuItem value="sonar">Sonar</MenuItem>
            <MenuItem value="sonar-reasoning-pro">Sonar reasoning pro</MenuItem>
          </TextField>
          {/* end dropdown */}
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </form>
      </Box>
    </Root>
  );
}

export default Prompt;
