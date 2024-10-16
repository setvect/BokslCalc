import React from "react";
import { Dialog, DialogTitle, DialogContent, useTheme, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartModalProps {
  open: boolean;
  onClose: () => void;
  chartData: { year: number; amount: number }[];
}

export const ChartModal: React.FC<ChartModalProps> = ({ open, onClose, chartData }) => {
  const theme = useTheme();

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000000000) {
      return `${(value / 1000000000000).toFixed(1)}조`;
    } else if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억`;
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`;
    }
    return value.toString();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="center" alignItems="center">
          30년간 금액 변화
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="year"
              label={{
                position: "insideBottomRight",
                offset: -10,
                fill: theme.palette.text.primary,
              }}
              stroke={theme.palette.text.primary}
              tickFormatter={(value) => `${value}년`}
            />
            <YAxis
              label={{
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: theme.palette.text.primary,
              }}
              stroke={theme.palette.text.primary}
              tickFormatter={formatLargeNumber}
            />
            <Tooltip
              formatter={(value, name, props) => [
                new Intl.NumberFormat("ko-KR", {
                  style: "currency",
                  currency: "KRW",
                  maximumFractionDigits: 0,
                }).format(value as number),
                `+${props.payload.year}년`,
              ]}
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
              }}
              labelFormatter={(label) => ``}
            />
            <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
            <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} name="금액" />
          </LineChart>
        </ResponsiveContainer>
      </DialogContent>
    </Dialog>
  );
};
