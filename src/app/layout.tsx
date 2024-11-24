import { Typography } from "@mui/material";
import ThemeWrapper from "./components/ThemeWrapper";
import Link from "next/link";

export const metadata = {
  title: "복슬금융 계산기",
  description: "금융 계산을 도와주는 계산기 모음",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ marginBottom: "30px" }}>
        <ThemeWrapper>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ my: 4, color: "primary.main", cursor: "pointer" }}>
              복슬금융계산기
            </Typography>
          </Link>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}
