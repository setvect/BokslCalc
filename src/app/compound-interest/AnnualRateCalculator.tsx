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
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import moment from "moment";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { FormulaModal } from "./FormulaModal";

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
  const [yearsError, setYearsError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const isValidDate = (date: any) => {
    return !isNaN(Date.parse(date));
  };

  const isValidNumber = (value: any) => {
    const numericValue = parseFloat(removeCommas(value));
    return !isNaN(numericValue) && isFinite(numericValue);
  };

  const calculateAnnualRate = () => {
    let period: number;
    if (inputType === "years") {
      period = parseFloat(years);
    } else if (startDate && endDate) {
      const diffDays = moment(endDate).diff(moment(startDate), "days");
      period = diffDays / 365;
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

    if (inputType === "years") {
      if (!isValidNumber(years)) {
        setYearsError("기간(년)을 입력해주세요.");
        hasError = true;
      } else {
        setYearsError(null);
      }
    } else {
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
    }

    if (hasError) return;

    calculateAnnualRate();
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
    handleNumberInput(value, setInitialAmount);
    if (isValidNumber(value)) {
      setInitialAmountError(null);
    }
  };

  const handleFinalAmountChange = (value: string) => {
    handleNumberInput(value, setFinalAmount);
    if (isValidNumber(value)) {
      setFinalAmountError(null);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          연복리 환산 계산기
        </Typography>
        <Button variant="outlined" onClick={handleClickOpen}>
          공식
        </Button>
      </div>
      <FormulaModal open={open} onClose={handleClose} />
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
        <FormControl fullWidth margin="normal">
          <Select
            value={years}
            onChange={(e) => {
              setYears(e.target.value as string);
              if (isValidNumber(e.target.value)) {
                setYearsError(null);
              }
            }}
            displayEmpty
            error={!!yearsError}
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
          {yearsError && <Typography color="error">{yearsError}</Typography>}
        </FormControl>
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
      {result && (
        <Paper elevation={2} sx={{ mt: 2, p: 2, bgcolor: "primary.light" }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.contrastText", fontWeight: "bold" }}
          >
            {result}
          </Typography>
        </Paper>
      )}
    </Paper>
  );
}
