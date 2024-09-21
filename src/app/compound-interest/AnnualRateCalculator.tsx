"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import {
  formatNumber,
  removeCommas,
  handleNumberInput,
} from "@/utils/numberFormat";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function AnnualRateCalculator() {
  const [inputType, setInputType] = useState<"years" | "dates">("years");
  const [initialAmount, setInitialAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [years, setYears] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [result, setResult] = useState("");

  const calculateAnnualRate = () => {
    let period: number;
    if (inputType === "years") {
      period = parseFloat(years);
    } else if (startDate && endDate) {
      const diffTime = endDate.getTime() - startDate.getTime();
      period = diffTime / (1000 * 60 * 60 * 24 * 365);
    } else {
      setResult("날짜를 선택해주세요.");
      return;
    }
    const initial = parseFloat(removeCommas(initialAmount));
    const final = parseFloat(removeCommas(finalAmount));
    const rate = (Math.pow(final / initial, 1 / period) - 1) * 100;
    setResult(`연복리 수익률: ${rate.toFixed(2)}%`);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        연복리 환산 계산기
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">기간 입력 방식</FormLabel>
        <RadioGroup
          row
          value={inputType}
          onChange={(e) => setInputType(e.target.value as "years" | "dates")}
        >
          <FormControlLabel value="years" control={<Radio />} label="년수" />
          <FormControlLabel value="dates" control={<Radio />} label="날짜" />
        </RadioGroup>
      </FormControl>
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
      {inputType === "years" ? (
        <TextField
          label="기간 (년)"
          value={years}
          onChange={(e) => setYears(e.target.value.replace(/[^0-9]/g, ""))}
          fullWidth
          margin="normal"
        />
      ) : (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="시작 날짜"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />
          <DatePicker
            label="종료 날짜"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />
        </LocalizationProvider>
      )}
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
