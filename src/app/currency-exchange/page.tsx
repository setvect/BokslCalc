"use client";

import NumberFormatCustom from "@/components/NumberFormatCustom";
import { formatNumber } from "@/utils/numberFormat";
import { createHandleInputChange, isValidNumber, validateFormData } from "@/utils/validation";
import {
  Button,
  Container,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

type ExchangeRate = {
  discountRate: number; // 환율 우대(%)
  fee: number; // 수수료
  buyDiscount: number; // 환율우대 살때
  sellDiscount: number; // 환율우대 팔때
  feeRate: number; // 매수+매도 수수료율
  feeAmount: number; // 매수+매도 거래 비용
};

type FormData = {
  tradeBaseAmount: number | null;
  exchangeSpread: number | null;
  exchangeAmount: number | null;
};

type FormErrors = {
  tradeBaseAmount: string | null;
  exchangeSpread: string | null;
  exchangeAmount: string | null;
};

export default function CompoundInterestCalculator() {
  const [exchangeRateList, setExchangeRateList] = useState<ExchangeRate[]>([]);
  const [formData, setFormData] = useState<FormData>({
    tradeBaseAmount: null,
    exchangeSpread: null,
    exchangeAmount: null,
  });
  const [errors, setErrors] = useState<FormErrors>({
    tradeBaseAmount: null,
    exchangeSpread: null,
    exchangeAmount: null,
  });

  const isValidInput = (field: string, value: any): boolean => {
    switch (field) {
      case "tradeBaseAmount":
      case "exchangeSpread":
      case "exchangeAmount":
        return isValidNumber(value);
      default:
        return true;
    }
  };

  const shouldValidateField = (field: string): boolean => {
    return true;
  };

  const handleInputChange = createHandleInputChange<FormData, FormErrors>(setFormData, setErrors, shouldValidateField, isValidInput);
  const handleCalculate = () => {
    const { errors: newErrors, hasError } = validateFormData(formData, shouldValidateField, isValidInput);
    setErrors(newErrors as FormErrors);
    if (!hasError) {
      calculateExchangeRate();
    }
  };

  const calculateExchangeRate = () => {
    const rateList: ExchangeRate[] = [];
    const tradeBaseAmount = formData.tradeBaseAmount;
    const exchangeSpread = formData.exchangeSpread;
    const exchangeAmount = formData.exchangeAmount;
    if (tradeBaseAmount === null || exchangeSpread === null || exchangeAmount === null) {
      return;
    }

    for (let discount = 0; discount <= 100; discount += 5) {
      const fee = tradeBaseAmount * (exchangeSpread / 100) * (1 - discount / 100);
      const buyDiscount = tradeBaseAmount + fee;
      const sellDiscount = tradeBaseAmount - fee;
      const tradeFeeRate = (fee / tradeBaseAmount) * 100;
      const tradeFeeAmount = exchangeAmount * (tradeFeeRate / 100);

      rateList.push({
        discountRate: discount,
        fee,
        buyDiscount,
        sellDiscount,
        feeRate: tradeFeeRate,
        feeAmount: tradeFeeAmount,
      });
    }
    setExchangeRateList(rateList);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center" sx={{ my: 4 }}>
        환전 수수료
      </Typography>
      <div>
        <TextField
          label="매매기준율"
          value={formData.tradeBaseAmount}
          fullWidth
          margin="normal"
          onChange={(e) => handleInputChange("tradeBaseAmount", parseFloat(e.target.value))}
          error={!!errors.tradeBaseAmount}
          helperText={errors.tradeBaseAmount}
          inputProps={{ maxLength: 8 }}
          autoComplete="off"
          InputProps={{
            inputComponent: NumberFormatCustom as any,
            endAdornment: <InputAdornment position="end">원</InputAdornment>,
          }}
        />
        <TextField
          label="환전 스프레드"
          value={formData.exchangeSpread}
          fullWidth
          margin="normal"
          onChange={(e) => handleInputChange("exchangeSpread", parseFloat(e.target.value))}
          error={!!errors.exchangeSpread}
          helperText={errors.exchangeSpread}
          inputProps={{ maxLength: 15 }}
          autoComplete="off"
          InputProps={{
            inputComponent: NumberFormatCustom as any,
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
        보통 전신환은 1%, 현찰은 1.75% 스프레드를 가져요.
        <TextField
          label="환전금액"
          value={formData.exchangeAmount}
          fullWidth
          margin="normal"
          onChange={(e) => handleInputChange("exchangeAmount", parseFloat(e.target.value))}
          error={!!errors.exchangeAmount}
          helperText={errors.exchangeAmount}
          inputProps={{ maxLength: 15 }}
          autoComplete="off"
          InputProps={{
            inputComponent: NumberFormatCustom as any,
            endAdornment: <InputAdornment position="end">원</InputAdornment>,
          }}
        />
        <Button variant="contained" color="primary" onClick={handleCalculate} fullWidth sx={{ mt: 2 }}>
          계산하기
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">환율 우대</TableCell>
                <TableCell align="center">수수료</TableCell>
                <TableCell align="center">환율우대 살때</TableCell>
                <TableCell align="center">환율우대 팔때</TableCell>
                <TableCell align="center">수수료율</TableCell>
                <TableCell align="center">거래비용</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exchangeRateList.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="right">{row.discountRate}%</TableCell>
                  <TableCell align="right">{formatNumber(row.fee.toFixed(2))}원</TableCell>
                  <TableCell align="right">{formatNumber(row.buyDiscount.toFixed(2))}원</TableCell>
                  <TableCell align="right">{formatNumber(row.sellDiscount.toFixed(2))}원</TableCell>
                  <TableCell align="right">{formatNumber(row.feeRate.toFixed(2))}%</TableCell>
                  <TableCell align="right">{formatNumber(row.feeAmount.toFixed(0))}원</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}
