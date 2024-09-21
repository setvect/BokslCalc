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
import { ko } from "date-fns/locale";

export default function AnnualRateCalculator() {
  const [inputType, setInputType] = useState<"years" | "dates">("years");
  const [initialAmount, setInitialAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [years, setYears] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [initialAmountError, setInitialAmountError] = useState<string | null>(
    null
  );
  const [finalAmountError, setFinalAmountError] = useState<string | null>(null);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);

  const isValidDate = (date: any) => {
    return !isNaN(Date.parse(date));
  };

  const isValidNumber = (value: any) => {
    return !isNaN(value) && value !== null && value !== "";
  };

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

  const handleCalculate = () => {
    let hasError = false;

    if (!startDate) {
      setStartDateError("시작 날짜를 선택해주세요.");
      hasError = true;
    } else if (!isValidDate(startDate)) {
      setStartDateError("유효한 시작 날짜를 입력해주세요.");
      hasError = true;
    } else {
      setStartDateError(null);
    }

    if (!endDate) {
      setEndDateError("종료 날짜를 선택해주세요.");
      hasError = true;
    } else if (!isValidDate(endDate)) {
      setEndDateError("유효한 종료 날짜를 입력해주세요.");
      hasError = true;
    } else if (startDate && endDate && startDate >= endDate) {
      setEndDateError("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
      hasError = true;
    } else {
      setEndDateError(null);
    }

    if (!isValidNumber(initialAmount)) {
      setInitialAmountError("유효한 숫자를 입력해주세요.");
      hasError = true;
    } else {
      setInitialAmountError(null);
    }

    if (!isValidNumber(finalAmount)) {
      setFinalAmountError("유효한 숫자를 입력해주세요.");
      hasError = true;
    } else {
      setFinalAmountError(null);
    }

    if (hasError) return;
  };

  const handleStartDateChange = (newValue: Date | null) => {
    setStartDate(newValue);
    if (newValue && isValidDate(newValue)) {
      setStartDateError(null);
    }
  };

  const handleEndDateChange = (newValue: Date | null) => {
    setEndDate(newValue);
    if (
      newValue &&
      isValidDate(newValue) &&
      (!startDate || newValue > startDate)
    ) {
      setEndDateError(null);
    }
  };

  const handleInitialAmountChange = (value: string) => {
    setInitialAmount(value);
    if (isValidNumber(value)) {
      setInitialAmountError(null);
    }
  };

  const handleFinalAmountChange = (value: string) => {
    setFinalAmount(value);
    if (isValidNumber(value)) {
      setFinalAmountError(null);
    }
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
        onChange={(e) => handleInitialAmountChange(e.target.value)}
        error={!!initialAmountError}
        helperText={initialAmountError}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: <InputAdornment position="end">원</InputAdornment>,
        }}
      />
      <TextField
        label="최종 금액"
        value={finalAmount}
        onChange={(e) => handleFinalAmountChange(e.target.value)}
        error={!!finalAmountError}
        helperText={finalAmountError}
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
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <DatePicker
              label="시작 날짜"
              value={startDate}
              onChange={handleStartDateChange}
              inputFormat="yyyy/MM/dd"
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  style={{ flex: 1, marginRight: 8 }}
                  error={!!startDateError}
                  helperText={startDateError}
                />
              )}
            />
            <DatePicker
              label="종료 날짜"
              value={endDate}
              onChange={handleEndDateChange}
              inputFormat="yyyy/MM/dd"
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  style={{ flex: 1, marginLeft: 8 }}
                  error={!!endDateError}
                  helperText={endDateError}
                />
              )}
            />
          </div>
        </LocalizationProvider>
      )}
      <Button
        onClick={handleCalculate}
        variant="contained"
        color="primary"
        style={{ width: "100%", marginTop: 16 }}
      >
        계산하기
      </Button>
      <Typography variant="h6" sx={{ mt: 2 }}>
        {result}
      </Typography>
    </Paper>
  );
}
