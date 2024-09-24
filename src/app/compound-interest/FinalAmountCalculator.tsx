"use client";

import React, { useState } from "react";
import { TextField, Button, Typography, Paper, InputAdornment } from "@mui/material";
import { formatNumber, removeCommas, handleNumberInput } from "@/utils/numberFormat";
import { Select, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ko } from "date-fns/locale";

export default function FinalAmountCalculator() {
  const [initialAmount, setInitialAmount] = useState("");
  const [years, setYears] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState({ initialAmount: "", years: "", interestRate: "" });
  const [inputType, setInputType] = useState<"years" | "dates">("years");
  const [formData, setFormData] = useState({
    initialAmount: "",
    years: "",
    startDate: null,
    endDate: null,
  });

  const validateInputs = () => {
    let valid = true;
    let errors = { initialAmount: "", years: "", interestRate: "" };

    if (!initialAmount) {
      errors.initialAmount = "초기 금액을 입력하세요.";
      valid = false;
    }
    if (!years) {
      errors.years = "기간을 입력하세요.";
      valid = false;
    }
    if (!interestRate) {
      errors.interestRate = "연복리 수익률을 입력하세요.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const calculateFinalAmount = () => {
    if (!validateInputs()) return;

    const initial = parseFloat(removeCommas(initialAmount));
    const yearsNum = parseFloat(years);
    const rate = parseFloat(interestRate) / 100;
    const final = initial * Math.pow(1 + rate, yearsNum);
    setResult(`최종 금액: ${formatNumber(final.toFixed(2))}원`);
  };

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartDateChange = (newValue: Date | null) => {
    handleInputChange("startDate", newValue);
  };

  const handleEndDateChange = (newValue: Date | null) => {
    handleInputChange("endDate", newValue);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        최종 금액 계산기
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">기간 입력 방식</FormLabel>
        <RadioGroup row value={inputType} onChange={(e) => setInputType(e.target.value as "years" | "dates")}>
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
        error={!!errors.initialAmount}
        helperText={errors.initialAmount}
        InputProps={{
          endAdornment: <InputAdornment position="end">원</InputAdornment>,
        }}
      />

      <TextField
        label="연복리 수익률 (%)"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value.replace(/[^0-9.]/g, ""))}
        fullWidth
        margin="normal"
        error={!!errors.interestRate}
        helperText={errors.interestRate}
      />
      {inputType === "years" ? (
        <FormControl fullWidth margin="normal">
          <Select value={formData.years} onChange={(e) => handleInputChange("years", e.target.value)} displayEmpty error={!!errors.years}>
            <MenuItem value="" disabled>
              기간 (년)
            </MenuItem>
            {Array.from({ length: 50 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}년
              </MenuItem>
            ))}
          </Select>
          {errors.years && <Typography color="error">{errors.years}</Typography>}
        </FormControl>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <DatePicker
              label="시작 날짜"
              value={formData.startDate}
              onChange={handleStartDateChange}
              inputFormat="yyyy/MM/dd"
              views={["year", "month", "day"]}
              openTo="year"
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  style={{ flex: 1, marginRight: 8 }}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                />
              )}
            />
            <DatePicker
              label="종료 날짜"
              value={formData.endDate}
              onChange={handleEndDateChange}
              inputFormat="yyyy/MM/dd"
              views={["year", "month", "day"]}
              openTo="year"
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  style={{ flex: 1, marginLeft: 8 }}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                />
              )}
            />
          </div>
        </LocalizationProvider>
      )}
      <Button variant="contained" color="primary" onClick={calculateFinalAmount} fullWidth sx={{ mt: 2 }}>
        계산하기
      </Button>
      <Typography variant="h6" sx={{ mt: 2 }}>
        {result}
      </Typography>
    </Paper>
  );
}
