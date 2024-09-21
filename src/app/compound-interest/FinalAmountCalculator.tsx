"use client";

import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import {
  formatNumber,
  removeCommas,
  handleNumberInput,
} from "@/utils/numberFormat";

export default function FinalAmountCalculator() {
  const [initialAmount, setInitialAmount] = useState("");
  const [years, setYears] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [result, setResult] = useState("");

  const calculateFinalAmount = () => {
    const initial = parseFloat(removeCommas(initialAmount));
    const yearsNum = parseFloat(years);
    const rate = parseFloat(interestRate) / 100;
    const final = initial * Math.pow(1 + rate, yearsNum);
    setResult(`최종 금액: ${formatNumber(final.toFixed(2))}원`);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        최종 금액 계산기
      </Typography>
      <TextField
        label="초기 금액"
        value={initialAmount}
        onChange={(e) => handleNumberInput(e.target.value, setInitialAmount)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="기간 (년)"
        value={years}
        onChange={(e) => setYears(e.target.value.replace(/[^0-9]/g, ""))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="연복리 수익률 (%)"
        value={interestRate}
        onChange={(e) =>
          setInterestRate(e.target.value.replace(/[^0-9.]/g, ""))
        }
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={calculateFinalAmount}
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
