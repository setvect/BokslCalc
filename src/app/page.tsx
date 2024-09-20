import { Typography, Container, Grid, Paper } from "@mui/material";
import Link from "next/link";
import ThemeWrapper from "./components/ThemeWrapper";

const calculators = [
  {
    name: "복리계산기",
    path: "/compound-interest",
    description: "투자 수익을 복리로 계산합니다.",
  },
  {
    name: "대출계산기",
    path: "/loan",
    description: "대출 상환 계획을 계산합니다.",
  },
  {
    name: "전월세 전환율",
    path: "/rent-conversion",
    description: "전세와 월세 간의 전환율을 계산합니다.",
  },
  {
    name: "환전",
    path: "/currency-exchange",
    description: "다양한 통화 간의 환율을 계산합니다.",
  },
  {
    name: "실수령액",
    path: "/net-income",
    description: "세금과 공제 후의 실제 수령액을 계산합니다.",
  },
];

export default function Home() {
  return (
    <ThemeWrapper>
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{ my: 4, color: "primary.main" }}
        >
          복슬금융계산기
        </Typography>
        <Grid container spacing={3}>
          {calculators.map((calc, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                component={Link}
                href={calc.path}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 10,
                  },
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="primary"
                >
                  {calc.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {calc.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeWrapper>
  );
}
