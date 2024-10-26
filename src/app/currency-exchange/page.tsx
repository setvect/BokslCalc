"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Button } from "@mui/material";
import { Typography, Grid, Container } from "@mui/material";
import { formatNumber, removeCommas } from "@/utils/numberFormat";

type ExchangeRate = {
  discountRate: number; // 환율 우대(%)
  fee: number; // 수수료
  buyDiscount: number; // 환율우대 살때
  sellDiscount: number; // 환율우대 팔때
  feeRate: number; // 매수+매도 수수료율
  feeAmount: number; // 매수+매도 거래 비용
};

type FormData = {
  tradeBaseAmount: string;
  exchangeSpread: string;
  exchangeAmount: string;
};

export default function CompoundInterestCalculator() {
  const [exchangeRateList, setExchangeRateList] = useState<ExchangeRate[]>([]);
  const [formData, setFormData] = useState<FormData>({
    tradeBaseAmount: "1300",
    exchangeSpread: "1",
    exchangeAmount: "10,000,000",
  });

  const handleCalculate = () => {
    const rateList: ExchangeRate[] = [];
    const tradeBaseAmount = parseFloat(removeCommas(formData.tradeBaseAmount));
    const exchangeSpread = parseFloat(removeCommas(formData.exchangeSpread));
    const exchangeAmount = parseFloat(removeCommas(formData.exchangeAmount));

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

  const handleTradeBaseAmount = (value: string) => {
    const formattedValue = formatNumber(removeCommas(value));
    setFormData({ ...formData, tradeBaseAmount: formattedValue });
  };

  const handleExchangeSpread = (value: string) => {
    const formattedValue = formatNumber(removeCommas(value));
    setFormData({ ...formData, exchangeSpread: formattedValue });
  };

  const handleExchangeAmount = (value: string) => {
    const formattedValue = formatNumber(removeCommas(value));
    setFormData({ ...formData, exchangeAmount: formattedValue });
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
          onChange={(e) => handleTradeBaseAmount(e.target.value)}
          inputProps={{ maxLength: 8 }}
          autoComplete="off"
          InputProps={{
            endAdornment: <InputAdornment position="end">원</InputAdornment>,
          }}
        />
        <TextField
          label="환전 스프레드"
          value={formData.exchangeSpread}
          fullWidth
          margin="normal"
          onChange={(e) => handleExchangeSpread(e.target.value)}
          inputProps={{ maxLength: 15 }}
          autoComplete="off"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
        일반적으로 환전 스프레드는 전신환 1%, 현찰 1.75%
        <TextField
          label="환전금액"
          value={formData.exchangeAmount}
          fullWidth
          margin="normal"
          onChange={(e) => handleExchangeAmount(e.target.value)}
          inputProps={{ maxLength: 15 }}
          autoComplete="off"
          InputProps={{
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
