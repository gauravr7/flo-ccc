import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LineChart from './LineChart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import Co2Icon from '@mui/icons-material/Co2';
import axiosInstance from '../util/axios';
import { formatDate } from '../util/formatter';
import Heatmap from './Heatmap';

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
  const [dashboardData, setDashboardData] = useState({});
  const [countdown, setCountdown] = useState(500);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [openLoader, setOpenLoader] = useState(false);

  const fetchDashboardData = () => {
    setOpenLoader(true);
    axiosInstance
      .get('http://localhost:8001/analytics')
      .then((response) => {
        if (response.data) {
          setDashboardData(response.data);
          setLastUpdated(new Date()); // save timestamp
          console.log('Data updated at', new Date().toLocaleTimeString());
          setOpenLoader(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setOpenLoader(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          fetchDashboardData();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Root>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={2} justifyContent="space-between" mb={2}>
        <Grid size={2}>
          <Typography variant="body2" color="textSecondary">
            Updating in {countdown} seconds...
          </Typography>
        </Grid>
        <Grid size={2} textAlign="right">
          {lastUpdated && (
            <Typography variant="caption" color="textSecondary">
              Last updated at {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="stretch">
        <Grid size={2}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box p={2}>
              <Typography variant="h6">Total Prompt Tokens</Typography>
              <Typography variant="h4">
                {dashboardData?.overview?.TOTAL_TOKEN_COUNT}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={3}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box p={2}>
              <Typography variant="h6">Total Carbon Emission</Typography>
              <Typography variant="h4">
                {dashboardData?.overview?.TOTAL_CARBON_EMISSION}
                <Typography component="span" className="unit">
                  CO2e
                </Typography>
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={2}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box p={2}>
              <Typography variant="h6">Total API Calls</Typography>
              <Typography variant="h4">
                {dashboardData?.overview?.TOTAL_APIS}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={3}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box p={2}>
              <Typography variant="h6">Total Energy Consumed</Typography>
              <Typography variant="h4">
                {dashboardData?.overview?.TOTAL_ENERGY_CONSUMED}
                <Typography component="span" className="unit">
                  Watt
                </Typography>
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={2}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box p={2}>
              <Typography variant="h6">Total Cost</Typography>
              <Typography variant="h4">
                $ {dashboardData?.overview?.TOTAL_COST}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={2} alignItems="stretch">
        <Grid size={6}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box p={2}>
              <Grid container item justifyContent="space-between" mb={1}>
                <Grid item>
                  <Box>
                    <Typography variant="h6" color="textPrimary">
                      Carbon Emission in last 7 days
                    </Typography>
                  </Box>
                </Grid>

                <Grid item>
                  <Tooltip title={'Details'}>
                    <IconButton>
                      <Co2Icon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <LineChart
                chartKeys={'Emission'}
                color={'#61cdbb'}
                serverData={dashboardData?.carbon_line_graph_data || []}
                dataKey="carbon_emission"
                unit="CO₂e"
              />
            </Box>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box p={2}>
              <Grid container item justifyContent="space-between" mb={1}>
                <Grid item>
                  <Box>
                    <Typography variant="h6">
                      Carbon Emission in last 7 Days
                    </Typography>
                  </Box>
                </Grid>

                <Grid item>
                  <Tooltip title={'Details'}>
                    <IconButton>
                      <Co2Icon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              <Heatmap
                data={dashboardData?.carbon_heatmap_data || []}
                dataKey="carbon_emission"
                color="red"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={2} alignItems="stretch">
        <Grid size={6}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box p={2}>
              <Grid container item justifyContent="space-between" mb={1}>
                <Grid item>
                  <Box>
                    <Typography variant="h6">
                      Energy Consumed in last 7 days
                    </Typography>
                  </Box>
                </Grid>

                <Grid item>
                  <Tooltip title={'Details'}>
                    <IconButton>
                      <EnergySavingsLeafIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <LineChart
                chartKeys={'Energy'}
                color={'#f47560'}
                serverData={dashboardData?.energy_line_graph_data || []}
                dataKey="energy_consumed"
                unit="watt"
              />
            </Box>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box p={2}>
              <Grid container item justifyContent="space-between" mb={1}>
                <Grid item>
                  <Box>
                    <Typography variant="h6">
                      Energy Consumed in last 7 Days
                    </Typography>
                  </Box>
                </Grid>

                <Grid item>
                  <Tooltip title={'Details'}>
                    <IconButton>
                      <EnergySavingsLeafIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <Heatmap
                data={dashboardData?.energy_heatmap_data || []}
                dataKey="energy_consumed"
                color="green"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box
        mt={2}
        sx={{
          bgcolor: '#e0e0e0',
          p: 2,
          borderRadius: 4,
        }}
      >
        <Typography variant="h5" mb={1}>
          Recent Prompts
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Prompt tokens</TableCell>
                <TableCell>Completion tokens</TableCell>
                <TableCell>Total tokens</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell align="right">Total cost</TableCell>
                <TableCell align="right">Energy consumed</TableCell>
                <TableCell align="right">Carbon emission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dashboardData?.latest_entries?.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.model}</TableCell>
                  <TableCell>{row.prompt_tokens}</TableCell>
                  <TableCell>{row.completion_tokens}</TableCell>
                  <TableCell>{row.total_tokens}</TableCell>
                  <TableCell>{formatDate(row.created_at)}</TableCell>
                  <TableCell align="right">{row.total_cost} $</TableCell>
                  <TableCell align="right">
                    {row.energy_consumed} Watt
                  </TableCell>
                  <TableCell align="right">
                    {row.carbon_emission} Coe2
                  </TableCell>
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
