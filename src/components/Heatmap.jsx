import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { formatDate } from '../util/formatter';

// A helper to map values to colors
function getColor(value) {
  // if (!value) return '#eee'; // no data
  // if (value < 0.005) return '#c7e9c0';
  // if (value < 0.01) return '#74c476';
  // if (value < 0.02) return '#238b45';
  // return '#00441b';
  if (!value) return '#f0f0f0'; // no data -> light gray
  if (value < 0.005) return '#ffeda0'; // very light orange
  if (value < 0.01) return '#feb24c'; // medium orange
  if (value < 0.02) return '#f03b20'; // red-orange
  return '#bd0026'; // dark red
}

// Styled grid wrapper
const GridWrapper = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(24, 1fr)', // 24 hours
  gap: '2px',
});

const Cell = styled(Box)({
  width: 20,
  height: 20,
  borderRadius: 2,
});

export default function Heatmap({ data, dataKey }) {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = {};
    acc[item.date][item.hour] = item[dataKey];
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort().slice(-7).reverse();

  return (
    <Box>
      {dates.map((date) => (
        <Box key={date} mb={1}>
          <Typography variant="caption">{formatDate(date)}</Typography>
          <GridWrapper>
            {Array.from({ length: 24 }, (_, hour) => {
              const value = grouped[date][hour];
              return (
                <Tooltip
                  key={hour}
                  title={`Hour: ${hour}, Value: ${value ?? 0}`}
                >
                  <Cell sx={{ backgroundColor: getColor(value) }} />
                </Tooltip>
              );
            })}
          </GridWrapper>
        </Box>
      ))}
    </Box>
  );
}
