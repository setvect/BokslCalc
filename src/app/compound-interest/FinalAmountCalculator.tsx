"use client";

import React, { useState } from "react";
import { TextField, Button, Typography, Paper, InputAdornment } from "@mui/material";
import { formatNumber, removeCommas } from "@/utils/numberFormat";
import { Select, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ko } from "date-fns/locale";

interface FormData {
  initialAmount: string;
  years: string;
  interestRate: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface FormErrors {
  initialAmount: string | null;
  years: string | null;
  interestRate: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export default function FinalAmountCalculator() {
  const [formData, setFormData] = useState<FormData>({
    initialAmount: "",
    years: "",
    interestRate: "",
    startDate: null,
    endDate: null,
  });
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState<FormErrors>({
    initialAmount: null,
    years: null,
    interestRate: null,
    startDate: null,
    endDate: null,
  });
  const [inputType, setInputType] = useState<"years" | "dates">("years");

  const validateInputs = () => {
    let valid = true;
    let newErrors = { ...errors };

    if (!formData.initialAmount) {
      newErrors.initialAmount = "초기 금액을 입력하세요.";
      valid = false;
    }
    if (inputType === "years" && !formData.years) {
      newErrors.years = "기간을 입력하세요.";
      valid = false;
    }
    if (inputType === "dates") {
      if (!formData.startDate) {
        newErrors.startDate = "시작 날짜를 선택하세요.";
        valid = false;
      }
      if (!formData.endDate) {
        newErrors.endDate = "종료 날짜를 선택하세요.";
        valid = false;
      }
    }
    if (!formData.interestRate) {
      newErrors.interestRate = "연복리 수익률을 입력하세요.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const calculateFinalAmount = () => {
    if (!validateInputs()) {
      return;
    }

    const initial = parseFloat(removeCommas(formData.initialAmount));
    const rate = parseFloat(formData.interestRate) / 100;
    let yearsNum: number;

    if (inputType === "years") {
      yearsNum = parseFloat(formData.years);
    } else {
      if (!formData.startDate || !formData.endDate) {
        setErrors((prev) => ({
          ...prev,
          startDate: formData.startDate ? null : "시작 날짜를 선택하세요.",
          endDate: formData.endDate ? null : "종료 날짜를 선택하세요.",
        }));
        return;
      }
      const diffTime = Math.abs(formData.endDate.getTime() - formData.startDate.getTime());
      yearsNum = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    }

    const final = initial * Math.pow(1 + rate, yearsNum);
    setResult(`최종 금액: ${formatNumber(final.toFixed(2))}원`);
  };

  const handleInputChange = (field: keyof FormData, value: string | Date | null) => {
    if (typeof value === "string") {
      if (field === "initialAmount") {
        const numericValue = removeCommas(value).replace(/[^0-9.]/g, "");
        value = formatNumber(numericValue);
      } else if (field === "interestRate" || field === "years") {
        value = value.replace(/[^0-9.]/g, "");
      }
    }
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
        value={formData.initialAmount}
        onChange={(e) => handleInputChange("initialAmount", e.target.value)}
        fullWidth
        margin="normal"
        error={!!errors.initialAmount}
        helperText={errors.initialAmount}
        InputProps={{
          endAdornment: <InputAdornment position="end">원</InputAdornment>,
        }}
        autoComplete="off"
      />

      <TextField
        label="연복리 수익률 (%)"
        value={formData.interestRate}
        onChange={(e) => handleInputChange("interestRate", e.target.value)}
        fullWidth
        margin="normal"
        error={!!errors.interestRate}
        helperText={errors.interestRate}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        autoComplete="off"
      />
      {inputType === "years" ? (
        <FormControl fullWidth margin="normal">
          <Select
            value={formData.years}
            onChange={(e) => handleInputChange("years", e.target.value)}
            displayEmpty
            error={!!errors.years}
            inputProps={{ autoComplete: "off" }}
          >
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
                  sx={{ flex: 1, marginRight: 1 }}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  autoComplete="off"
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
                  sx={{ flex: 1, marginLeft: 8 }}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  autoComplete="off"
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
