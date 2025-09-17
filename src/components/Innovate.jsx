import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
}));

function Innovate() {
  // API: 8003/optimize-green-prompt
  return (
    <Root>
      {/* Input Prompt */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Input Prompt
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
          <Typography variant="body2" color="textSecondary">
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            dolor sit amet Lorem ipsum dolor sit amet
          </Typography>
        </Paper>
        <Button
          variant="contained"
          sx={{ bgcolor: 'purple', textTransform: 'none' }}
        >
          Submit
        </Button>
      </Box>

      {/* Green Prompt */}
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
          <Typography variant="body2" color="textSecondary">
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
            dolor sit amet Lorem ipsum dolor sit amet
          </Typography>
        </Paper>
        <Button
          variant="contained"
          sx={{ bgcolor: 'green', textTransform: 'none' }}
        >
          Copy
        </Button>
      </Box>

      {/* Tokens Saved */}
      <Typography variant="subtitle1">Tokens Saved: 13</Typography>
    </Root>
  );
}

export default Innovate;
