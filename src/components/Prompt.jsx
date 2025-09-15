import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled(Box, {
  label: 'prompt',
})(({ theme }) => ({
  [`& .sample`]: {
    paddingBottom: theme.spacing(1),
    color: 'purple',
  },
}));

function Prompt() {
  return (
    <Root>
      <Typography variant="h5" className="sample">
        Prompt
      </Typography>
      {/* Add more HTML here */}
    </Root>
  );
}
export default Prompt;
