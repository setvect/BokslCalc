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
import { FinalAmountFormulaModal } from "./FinalAmountFormulaModal";
import { NumericFormat } from "react-number-format";

interface FormData {
  initialAmount: number | null;
  years: number | null;
  interestRate: number | null;
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

interface NumberFormatCustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumberFormatCustom = React.forwardRef<HTMLInputElement, NumberFormatCustomProps>(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
    />
  );
});

export default function FinalAmountCalculator() {
  const [inputType, setInputType] = useState<"years" | "dates">("years");
  const [formData, setFormData] = useState<FormData>({
    initialAmount: null,
    years: null,
    interestRate: null,
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
  const [openFormula, setOpenFormula] = useState(false);

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

  const handleInputChange = (field: keyof FormData, value: number | Date | null) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    if (shouldValidateField(field)) {
      setErrors((prev: FormErrors) => ({
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
    handleInputChange("initialAmount", parseFloat(formattedValue) || null);
  };

  const calculateFinalAmount = () => {
    let period: number;
    if (inputType === "years" && formData.years !== null) {
      period = formData.years;
    } else if (formData.startDate && formData.endDate) {
      const diffDays = moment(formData.endDate).diff(moment(formData.startDate), "days");
      period = diffDays / 365;
    } else {
      setResult("날짜를 선택해주세요.");
      return;
    }

    if (formData.initialAmount === null || formData.interestRate === null) {
      setResult("초기 금액과 이자율을 입력해주세요.");
      return;
    }

    const initial = formData.initialAmount;
    const rate = formData.interestRate / 100;
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
    validateDates(newValue, formData.endDate);
  };

  const handleEndDateChange = (newValue: Date | null) => {
    handleInputChange("endDate", newValue);
    validateDates(formData.startDate, newValue);
  };

  const validateDates = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate && startDate > endDate) {
      setErrors((prev) => ({
        ...prev,
        startDate: "시작 날짜는 종료 날짜보다 늦을 수 없습니다.",
        endDate: "종료 날짜는 시작 날짜보다 빠를 수 없습니다.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        startDate: null,
        endDate: null,
      }));
    }
  };

  const handleClickOpenFormula = () => {
    setOpenFormula(true);
  };

  const handleCloseFormula = () => {
    setOpenFormula(false);
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
          최종 금액 계산기
        </Typography>
        <Button variant="outlined" onClick={handleClickOpenFormula}>
          공식
        </Button>
      </div>
      <FinalAmountFormulaModal open={openFormula} onClose={handleCloseFormula} />
      <FormControl component="fieldset">
        <FormLabel component="legend">기간 입력 방식</FormLabel>
        <RadioGroup row value={inputType} onChange={(e) => setInputType(e.target.value as "years" | "dates")}>
          <FormControlLabel value="years" control={<Radio />} label="년수" />
          <FormControlLabel value="dates" control={<Radio />} label="날짜" />
        </RadioGroup>
      </FormControl>

      <TextField
        label="초기 금액"
        value={formData.initialAmount ?? ""}
        onChange={(e) => handleInputChange("initialAmount", parseFloat(e.target.value) || null)}
        fullWidth
        margin="normal"
        error={!!errors.initialAmount}
        helperText={errors.initialAmount}
        InputProps={{
          inputComponent: NumberFormatCustom as any,
          endAdornment: <InputAdornment position="end">원</InputAdornment>,
        }}
        inputProps={{ maxLength: 15 }}
      />

      <TextField
        label="연복리 수익률(%)"
        value={formData.interestRate ?? ""}
        onChange={(e) => handleInputChange("interestRate", parseFloat(e.target.value) || null)}
        fullWidth
        margin="normal"
        error={!!errors.interestRate}
        helperText={errors.interestRate}
        InputProps={{
          inputComponent: NumberFormatCustom as any,
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        inputProps={{
          decimalScale: 2,
          allowNegative: false,
        }}
        autoComplete="off"
      />
      {inputType === "years" ? (
        <FormControl fullWidth margin="normal">
          <Select
            value={formData.years ?? ""}
            onChange={(e) => handleInputChange("years", Number(e.target.value) || null)}
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
                  sx={{ flex: 1, marginLeft: 1 }}
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
