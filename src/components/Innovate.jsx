import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled(Box, {
  label: 'prompt',
})(({ theme }) => ({
  [`& .test`]: {
    paddingBottom: theme.spacing(1),
    color: 'green',
  },
}));

function Innovate() {
  return (
    <Root>
      <Typography variant="h5" className="test">
        Innovate
      </Typography>
      {/* Add more HTML here */}
    </Root>
  );
}
export default Innovate;
