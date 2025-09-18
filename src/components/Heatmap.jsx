import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { formatDate } from '../util/formatter';

// A helper to map values to colors
function getColor(value, color) {
  if (color === 'green') {
    if (!value) return '#eee'; // no data
    if (value < 0.005) return '#c7e9c0';
    if (value < 0.01) return '#74c476';
    if (value < 0.02) return '#238b45';
    return '#00441b';
  } else {
    if (!value) return '#f0f0f0';
    if (value < 0.005) return '#ffeda0';
    if (value < 0.01) return '#feb24c';
    if (value < 0.02) return '#f03b20';
    return '#bd0026';
  }
}

const legendGreen = [
  { color: '#eee', label: 'No Value' },
  { color: '#c7e9c0', label: 'Value < 0.005' },
  { color: '#74c476', label: 'Value < 0.01' },
  { color: '#238b45', label: 'Value < 0.02' },
  { color: '#00441b', label: 'Value > 0.02' },
];
const legendRed = [
  { color: '#f0f0f0', label: 'No Value' },
  { color: '#ffeda0', label: 'Value < 0.005' },
  { color: '#feb24c', label: 'Value < 0.01' },
  { color: '#f03b20', label: 'Value < 0.02' },
  { color: '#bd0026', label: 'Value > 0.02' },
];

// Styled grid wrapper
const GridWrapper = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(24, 1fr)',
  gap: '2px',
});

const Cell = styled(Box)({
  width: 24,
  height: 24,
  borderRadius: 2,
});

export default function Heatmap({ data, dataKey, color }) {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = {};
    acc[item.date][item.hour] = item[dataKey];
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort().slice(-7).reverse();

  return (
    <Box mt={4}>
      {dates.map((date) => (
        <Box key={date} mb={2} display="flex">
          <Typography variant="caption" mr={1}>
            {formatDate(date)}
          </Typography>
          <GridWrapper>
            {Array.from({ length: 24 }, (_, hour) => {
              const value = grouped[date][hour];
              return (
                <Tooltip
                  key={hour}
                  title={`Hour: ${hour}, Value: ${value ?? 0}`}
                >
                  <Cell sx={{ backgroundColor: getColor(value, color) }} />
                </Tooltip>
              );
            })}
          </GridWrapper>
        </Box>
      ))}
      <Box mt={5}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-around',
          }}
        >
          {color === 'green' ? (
            <>
              {legendGreen.map((item) => (
                <Box display="flex" alignItems={'center'}>
                  <Typography variant="caption" mr={1}>
                    {item.label}
                  </Typography>
                  <Cell sx={{ backgroundColor: item.color }} />
                </Box>
              ))}
            </>
          ) : (
            <>
              {legendRed.map((item) => (
                <Box display="flex" alignItems={'center'}>
                  <Typography variant="caption" mr={1}>
                    {item.label}
                  </Typography>
                  <Cell sx={{ backgroundColor: item.color }} />
                </Box>
              ))}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
