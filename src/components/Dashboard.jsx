import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled(Box, {
  label: 'dashboard',
})(({ theme }) => ({
  [`& .unit`]: {
    paddingLeft: theme.spacing(1),
    fontSize: theme.typography.fontSize,
    color: 'red',
  },
}));

function Dashboard() {
  return (
    <Root>
      <Grid container spacing={2}>
        <Grid size={2}>
          <Paper>
            <Box p={2}>
              <Typography variant="h6">Total Prompt Tokens</Typography>
              <Typography variant="h3">44444</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={3}>
          <Paper>
            <Box p={2}>
              <Typography variant="h6">Total Carbon Emission</Typography>
              <Typography variant="h3">
                232
                <Typography component="span" className="unit">
                  CO2e
                </Typography>
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={2}>
          <Paper>
            <Box p={2}>
              <Typography variant="h6">Total API Calls</Typography>
              <Typography variant="h3">675</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={3}>
          <Paper>
            <Box p={2}>
              <Typography variant="h6">Total Energy Consumed</Typography>
              <Typography variant="h3">
                343
                <Typography component="span" className="unit">
                  Watt
                </Typography>
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={2}>
          <Paper>
            <Box p={2}>
              <Typography variant="h6">Total Cost</Typography>
              <Typography variant="h3">$344</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      Dashboard
      <Button variant="contained">Hello world</Button>
    </Root>
  );
}
export default Dashboard;
