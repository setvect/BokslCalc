import React from "react";
import { Typography, Grid, Container } from "@mui/material";
import AnnualRateCalculator from "./AnnualRateCalculator";
import FinalAmountCalculator from "./FinalAmountCalculator";

export default function CompoundInterestCalculator() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center" sx={{ my: 4, fontWeight: "bold", color: "#1976d2" }}>
        복리 계산기
      </Typography>
      <Grid container direction="column" spacing={3}>
        <Grid item xs={12}>
          <AnnualRateCalculator />
        </Grid>
        <Grid item xs={12}>
          <FinalAmountCalculator />
        </Grid>
      </Grid>
    </Container>
  );
}
