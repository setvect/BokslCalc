import React from "react";
import { Typography, Grid, Container, Paper } from "@mui/material";
import AnnualRateCalculator from "./AnnualRateCalculator";
import FinalAmountCalculator from "./FinalAmountCalculator";

export default function CompoundInterestCalculator() {
  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ my: 4, fontWeight: "bold", color: "#1976d2", textShadow: "1px 1px 2px #000" }}
      >
        복리 계산기
      </Typography>
      <Grid container direction="column" spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <AnnualRateCalculator />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FinalAmountCalculator />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
