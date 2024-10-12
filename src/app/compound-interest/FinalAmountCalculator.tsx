"use client";

import React, { useState } from "react";
import { TextField, Button, Typography, Paper, InputAdornment } from "@mui/material";
import { formatNumber, removeCommas } from "@/utils/numberFormat";
import { Select, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ko } from "date-fns/locale";
import moment from "moment";

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
  startDate: string | null;
  endDate: string | null;
}

export default function FinalAmountCalculator() {
  const [inputType, setInputType] = useState<"years" | "dates">("years");
  const [formData, setFormData] = useState<FormData>({
    initialAmount: "",
    years: "",
    interestRate: "",
    startDate: null,
    endDate: null,
  });
  const [errors, setErrors] = useState<FormErrors>({
    initialAmount: null,
    years: null,
    interestRate: null,
    startDate: null,
    endDate: null,
  });
  const [result, setResult] = useState("");

  const isValidNumber = (value: string) => {
    const numericValue = parseFloat(removeCommas(value));
    return !isNaN(numericValue) && isFinite(numericValue);
  };

  const isValidDate = (date: Date | null) => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  const isValidInput = (field: string, value: any): boolean => {
    switch (field) {
      case "initialAmount":
      case "interestRate":
        return isValidNumber(value);
      case "years":
        return inputType === "years" && isValidNumber(value) && parseInt(value) > 0;
      case "startDate":
      case "endDate":
        return inputType === "dates" && isValidDate(value);
      default:
        return true;
    }
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
    if (shouldValidateField(field)) {
      setErrors((prev) => ({
        ...prev,
        [field]: isValidInput(field, value) ? null : "유효하지 않은 입력입니다.",
      }));
    }
  };

  const shouldValidateField = (field: string): boolean => {
    if (field === "initialAmount" || field === "interestRate") {
      return true;
    }
    if (inputType === "years" && field === "years") {
      return true;
    }
    if (inputType === "dates" && (field === "startDate" || field === "endDate")) {
      return true;
    }
    return false;
  };

  const handleInitialAmountChange = (value: string) => {
    const formattedValue = formatNumber(removeCommas(value));
    handleInputChange("initialAmount", formattedValue);
  };

  const calculateFinalAmount = () => {
    let period: number;
    if (inputType === "years") {
      period = parseFloat(formData.years);
    } else if (formData.startDate && formData.endDate) {
      const diffDays = moment(formData.endDate).diff(moment(formData.startDate), "days");
      period = diffDays / 365;
    } else {
      setResult("날짜를 선택해주세요.");
      return;
    }
    const initial = parseFloat(removeCommas(formData.initialAmount));
    const rate = parseFloat(formData.interestRate) / 100;
    const final = initial * Math.pow(1 + rate, period);
    setResult(`최종 금액: ${formatNumber(final.toFixed(2))}원`);
  };

  const handleCalculate = () => {
    let hasError = false;
    const newErrors: FormErrors = { ...errors };

    Object.entries(formData).forEach(([field, value]) => {
      if (shouldValidateField(field)) {
        if (!isValidInput(field, value)) {
          newErrors[field as keyof FormErrors] = "유효하지 않은 입력입니다.";
          hasError = true;
        } else {
          newErrors[field as keyof FormErrors] = null;
        }
      } else {
        newErrors[field as keyof FormErrors] = null;
      }
    });

    setErrors(newErrors);
    if (!hasError) {
      calculateFinalAmount();
    }
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
        onChange={(e) => handleInitialAmountChange(e.target.value)}
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
      <Button variant="contained" color="primary" onClick={handleCalculate} fullWidth sx={{ mt: 2 }}>
        계산하기
      </Button>
      <Typography variant="h6" sx={{ mt: 2 }}>
        {result}
      </Typography>
    </Paper>
  );
}
