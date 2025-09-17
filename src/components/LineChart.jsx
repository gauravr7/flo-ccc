import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

import { ResponsiveLine } from '@nivo/line';

const classes = {
  label: 'label',
  value: 'value',
  tooltipButton: 'tooltip-button',
  tooltipLabel: 'tooltip-label',
  icon: 'icon',
};

const Root = styled(Grid, { label: 'lineChart' })(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),

  [`& .${classes.label}`]: {
    fontWeight: 700,
    textTransform: 'capitalize',
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.value}`]: {
    lineHeight: 1,
  },

  [`& .${classes.icon}`]: {
    marginRight: theme.spacing(1),
  },

  [`& .${classes.tooltipButton}`]: {
    padding: 0,
  },

  [`& .${classes.tooltipLabel}`]: {
    fontSize: '12px',
    fontWeight: 700,
    display: 'flex',
    borderRadius: theme.spacing(1),
    whiteSpace: 'nowrap',
    padding: theme.spacing(1, 1.5),
  },
}));

export default function LineChart({
  chartKeys,
  color,
  serverData,
  dataKey,
  unit,
}) {
  const chartData = useMemo(() => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const transformed = serverData.map((item) => {
      const date = new Date(item.date);
      const day = String(date.getDate()).padStart(2, '0');
      const month = months[date.getMonth()];

      return {
        x: `${day}-${month}`,
        y: item[dataKey],
      };
    });

    return [{ id: chartKeys, data: transformed }];
  }, [serverData]);

  console.log('ysl-', chartData);
  return (
    <Root container direction="column" justifyContent="space-between">
      <Grid item>
        <Box sx={{ height: '350px' }}>
          <ResponsiveLine
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 60, left: 60 }}
            yScale={{
              type: 'linear',
              // min: 0,
              // max: 0.5,
              stacked: false,
              reverse: false,
            }}
            // gridYValues={[
            //   '0',
            //   '10',
            //   '20',
            //   '30',
            //   '40',
            //   '50',
            //   '60',
            //   '70',
            //   '80',
            //   '90',
            //   '100',
            // ]}
            lineWidth={3}
            enablePoints={true} // ensures points are drawn
            pointSize={12} // radius of points
            pointColor={{ theme: 'background' }}
            pointBorderWidth={3}
            pointBorderColor={{ from: 'seriesColor' }}
            colors={color}
            pointLabelYOffset={-12}
            enableTouchCrosshair={false}
            useMesh={true}
            isInteractive={true}
            enableCrosshair={false}
            tooltip={({ point }) => {
              return (
                <Paper className={classes.tooltipLabel} elevation={3}>
                  <span style={{ paddingRight: '4px' }}>{point.data.x};</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {point.data.y} {unit}
                  </span>
                </Paper>
              );
            }}
            legends={[
              {
                anchor: 'bottom-left',
                direction: 'row',
                translateX: 0,
                translateY: 60,
                itemWidth: 120,
                itemHeight: 22,
                symbolShape: 'circle',
              },
            ]}
            theme={{
              background: '#ffffff',
            }}
            pointSymbol={(pointProps) => {
              return (
                <circle
                  r={pointProps.size / 2}
                  fill={pointProps.color}
                  stroke={pointProps.borderColor}
                  strokeWidth={pointProps.borderWidth}
                />
              );
            }}
            axisLeft={{
              format: function (value) {
                return `${value}`;
              },
            }}
          />
        </Box>
      </Grid>
    </Root>
  );
}

LineChart.propTypes = {
  /* label of chart */
  label: PropTypes.string,
  /* supply svg image */
  image: PropTypes.string,
  /* show tooltip or not */
  tooltip: PropTypes.bool,
  /* tooltip text */
  tooltipText: PropTypes.string,
  /* show multiple colored lines */
  isMultipleColors: PropTypes.bool,
  /* all charts keys  */
  chartKeys: PropTypes.array,
};
