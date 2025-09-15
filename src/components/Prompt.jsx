import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
}));

function Prompt() {
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
        <Typography variant="body2" color="textSecondary">
          Output Window
        </Typography>
      </Paper>

      {/* Input + Submit */}
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Please enter your prompt here"
        />
        <Button
          variant="contained"
          sx={{ bgcolor: 'purple', color: 'white', textTransform: 'none' }}
        >
          Submit
        </Button>
      </Box>
    </Root>
  );
}

export default Prompt;
