"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  formatNumber,
  removeCommas,
  handleNumberInput,
} from "@/utils/numberFormat";

export default function AnnualRateCalculator() {
  const [initialAmount, setInitialAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState("");

  const calculateAnnualRate = () => {
    const initial = parseFloat(removeCommas(initialAmount));
    const final = parseFloat(removeCommas(finalAmount));
    const yearsNum = parseFloat(years);
    const rate = (Math.pow(final / initial, 1 / yearsNum) - 1) * 100;
    setResult(`연복리 수익률: ${rate.toFixed(2)}%`);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        연복리 환산 계산기
      </Typography>
      <TextField
        label="초기 금액"
        value={initialAmount}
        onChange={(e) => handleNumberInput(e.target.value, setInitialAmount)}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: <InputAdornment position="end">원</InputAdornment>,
        }}
      />
      <TextField
        label="최종 금액"
        value={finalAmount}
        onChange={(e) => handleNumberInput(e.target.value, setFinalAmount)}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: <InputAdornment position="end">원</InputAdornment>,
        }}
      />
      <TextField
        label="기간 (년)"
        value={years}
        onChange={(e) => setYears(e.target.value.replace(/[^0-9]/g, ""))}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={calculateAnnualRate}
        fullWidth
        sx={{ mt: 2 }}
      >
        계산하기
      </Button>
      <Typography variant="h6" sx={{ mt: 2 }}>
        {result}
      </Typography>
    </Paper>
  );
}
