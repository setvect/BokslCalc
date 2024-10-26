"use client";

import { removeCommas } from "@/utils/numberFormat";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ko } from "date-fns/locale";
import "katex/dist/katex.min.css";
import moment from "moment";
import React, { useState } from "react";
import { AnnualRateFormulaModal } from "./AnnualRateFormulaModal";
import { ChartModal } from "./ChartModal";
import { NumericFormat } from "react-number-format";

type FormData = {
  initialAmount: number | null;
  finalAmount: number | null;
  years: number | null;
  startDate: Date | null;
  endDate: Date | null;
};

type FormErrors = {
  initialAmount: string | null;
  finalAmount: string | null;
  years: string | null;
  startDate: string | null;
  endDate: string | null;
};

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

export default function AnnualRateCalculator() {
  const [inputType, setInputType] = useState<"years" | "dates">("years");
  const [formData, setFormData] = useState<FormData>({
    initialAmount: null,
    finalAmount: null,
    years: null,
    startDate: null,
    endDate: null,
  });
  const [errors, setErrors] = useState<FormErrors>({
    initialAmount: null,
    finalAmount: null,
    years: null,
    startDate: null,
    endDate: null,
  });
  const [result, setResult] = useState("");
  const [open, setOpenFormula] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState<{ year: number; amount: number }[]>([]);

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
      case "finalAmount":
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
    if (field === "initialAmount" || field === "finalAmount") {
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

  const calculateAnnualRate = () => {
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

    if (formData.initialAmount === null || formData.finalAmount === null) {
      setResult("초기금액과 최종금액을 입력해주세요.");
      return;
    }

    const initial = formData.initialAmount;
    const final = formData.finalAmount;
    const rate = (Math.pow(final / initial, 1 / period) - 1) * 100;
    setResult(`연복리 수익률(CAGR): ${rate.toFixed(2)}%`);

    // 차트 데이터 생성
    const data = Array.from({ length: 31 }, (_, i) => ({
      year: i,
      amount: initial * Math.pow(1 + rate / 100, i),
    }));
    setChartData(data);
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
      calculateAnnualRate();
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

  const handleClose = () => {
    setOpenFormula(false);
  };

  const handleShowChart = () => {
    setShowChart(true);
  };

  const handleCloseChart = () => {
    setShowChart(false);
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
        <Button variant="outlined" onClick={handleClickOpenFormula}>
          공식
        </Button>
      </div>
      <AnnualRateFormulaModal open={open} onClose={handleClose} />
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
        onChange={(e) => handleInputChange("initialAmount", parseFloat(e.target.value))}
        error={!!errors.initialAmount}
        helperText={errors.initialAmount}
        fullWidth
        margin="normal"
        InputProps={{
          inputComponent: NumberFormatCustom as any,
          endAdornment: <InputAdornment position="end">원</InputAdornment>,
        }}
        inputProps={{ maxLength: 15 }}
      />
      <TextField
        label="최종 금액"
        value={formData.finalAmount}
        onChange={(e) => handleInputChange("finalAmount", parseFloat(e.target.value))}
        error={!!errors.finalAmount}
        helperText={errors.finalAmount}
        fullWidth
        margin="normal"
        InputProps={{
          inputComponent: NumberFormatCustom as any,
          endAdornment: <InputAdornment position="end">원</InputAdornment>,
        }}
        inputProps={{ maxLength: 15 }}
      />
      {inputType === "years" ? (
        <FormControl fullWidth margin="normal" error={!!errors.years}>
          <Select value={formData.years ?? ""} onChange={(e) => handleInputChange("years", Number(e.target.value))} displayEmpty>
            <MenuItem value="" disabled>
              기간 (년)
            </MenuItem>
            {Array.from({ length: 50 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}년
              </MenuItem>
            ))}
          </Select>
          {errors.years && <FormHelperText>{errors.years}</FormHelperText>}
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
                  style={{ flex: 1, marginLeft: 8 }}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  autoComplete="off"
                />
              )}
            />
          </div>
        </LocalizationProvider>
      )}
      <Button onClick={handleCalculate} variant="contained" color="primary" style={{ width: "100%", marginTop: 16 }}>
        계산하기
      </Button>
      {result && (
        <Paper
          elevation={2}
          sx={{ mt: 2, p: 2, bgcolor: "primary.light", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="h6" sx={{ color: "primary.contrastText", fontWeight: "bold" }}>
            {result}
          </Typography>
          <Button onClick={handleShowChart} variant="contained" color="info">
            수익률 차트보기
          </Button>
        </Paper>
      )}
      <ChartModal open={showChart} onClose={handleCloseChart} chartData={chartData} />
    </Paper>
  );
}
