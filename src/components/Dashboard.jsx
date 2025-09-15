import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function Dashboard() {
  return (
    <Root>
      <Grid container spacing={2}>
        <Grid size={3}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Total Prompt Tokens</Typography>
              <Typography variant="h3">44444</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={3}>
          <Paper elevation={3}>
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
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Total API Calls</Typography>
              <Typography variant="h3">675</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={2}>
          <Paper elevation={3}>
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
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Total Cost</Typography>
              <Typography variant="h3">$ 344</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={2}>
        <Grid size={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Line Graph - Carbon Emission</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Heat Map - Carbon Emission</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Line Graph - Energy Consumed</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Heat Map - Energy Consumed</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Typography variant="h5">Recent Prompts</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Root>
  );
}
export default Dashboard;
