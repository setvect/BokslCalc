import { Typography } from "@mui/material";
import ThemeWrapper from "./components/ThemeWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ThemeWrapper>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            align="center"
            sx={{ my: 4, color: "primary.main" }}
          >
            복슬금융계산기
          </Typography>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}
