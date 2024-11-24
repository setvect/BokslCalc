"use client";

import { Container, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import JeonseToMonthly from "./components/JeonseToMonthly";
import MonthlyToJeonse from "./components/MonthlyToJeonse";
import ConversionRateCalculator from "./components/ConversionRateCalculator";

export default function RentConversionCalculator() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center" sx={{ my: 4, fontWeight: "bold", color: "#1976d2" }}>
        전월세 전환율 계산기
      </Typography>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth" sx={{ mb: 3 }}>
          <Tab label="전세 → 월세" />
          <Tab label="월세 → 전세" />
          <Tab label="전환율 계산" />
        </Tabs>

        {currentTab === 0 && <JeonseToMonthly />}
        {currentTab === 1 && <MonthlyToJeonse />}
        {currentTab === 2 && <ConversionRateCalculator />}
      </Paper>

      <Typography align="center" sx={{ mt: 2, mb: 4 }}>
        <a
          href="https://kosis.kr/statHtml/statHtml.do?orgId=408&tblId=DT_30404_N0010"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1976d2", textDecoration: "underline" }}
        >
          지역별 전월세 전환율 보기
        </a>
      </Typography>
    </Container>
  );
}
