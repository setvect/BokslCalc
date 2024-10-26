import { Typography } from "@mui/material";
import ThemeWrapper from "./components/ThemeWrapper";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
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
