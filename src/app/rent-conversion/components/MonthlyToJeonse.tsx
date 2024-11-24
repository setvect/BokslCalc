import { TextField, Grid, InputAdornment, Button, Modal, Box, Typography, IconButton } from "@mui/material";
import NumberFormatCustom from "@/components/NumberFormatCustom";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

type FormData = {
  monthlyRent: number | "";
  monthlyDeposit: number | "";
  conversionRate: number | "";
  jeonseDeposit: number | "";
};

type FormErrors = {
  monthlyRent?: string;
  monthlyDeposit?: string;
  conversionRate?: string;
  jeonseDeposit?: string;
};

export default function MonthlyToJeonse() {
  const [formData, setFormData] = useState<FormData>({
    monthlyRent: "",
    monthlyDeposit: "",
    conversionRate: "",
    jeonseDeposit: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [openFormulaModal, setOpenFormulaModal] = useState(false);

  const handleOpenModal = () => setOpenFormulaModal(true);
  const handleCloseModal = () => setOpenFormulaModal(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const validateInput = (name: string, value: number | ""): string | undefined => {
    if (value === "") {
      return undefined;
    }

    const numValue = Number(value);
    if (numValue < 0) return "음수는 입력할 수 없습니다";
    if (name === "conversionRate" && numValue > 100) return "전환율은 100% 이하여야 합니다";
    return undefined;
  };

  const calculateJeonseDeposit = (data: FormData): number | "" => {
    const { monthlyRent, monthlyDeposit, conversionRate } = data;

    if (monthlyRent === "" || monthlyDeposit === "" || conversionRate === "") {
      return "";
    }

    return Math.round(Number(monthlyDeposit) + (Number(monthlyRent) * 1200) / Number(conversionRate));
  };

  const handleInputChange = (name: keyof FormData, value: number) => {
    const error = validateInput(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    const newFormData = { ...formData, [name]: value };

    if (!error && name !== "jeonseDeposit") {
      const calculatedDeposit = calculateJeonseDeposit(newFormData);
      newFormData.jeonseDeposit = calculatedDeposit;
    }

    setFormData(newFormData);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" onClick={handleOpenModal}>
          전환 공식 보기
        </Button>
      </Box>

      <Modal open={openFormulaModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" component="h2">
              월세 → 전세 전환 공식
            </Typography>
            <IconButton onClick={handleCloseModal} size="small" sx={{ color: "text.secondary" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography sx={{ mt: 2 }}>전세보증금 = 월세보증금 + (월세 × 1200 ÷ 전환율)</Typography>
          <Typography sx={{ mt: 1 }} color="text.secondary">
            * 전환율은 연이율 기준입니다.
          </Typography>
          <Box sx={{ mt: 3, bgcolor: "background.paper", p: 2, borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="subtitle2" gutterBottom color="text.primary">
              예시 1)
            </Typography>
            <Typography color="text.primary">
              월세: 100만원
              <br />
              월세보증금: 5천만원(5,000만원)
              <br />
              전환율: 5%
              <br />
              전세보증금 = 5,000 + (100 × 1200 ÷ 5) = 29,000만원(2억 9천만원)
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom color="text.primary">
              예시 2)
            </Typography>
            <Typography color="text.primary">
              월세: 50만원
              <br />
              월세보증금: 1억원(10,000만원)
              <br />
              전환율: 6%
              <br />
              전세보증금 = 10,000 + (50 × 1200 ÷ 6) = 20,000만원(2억원)
            </Typography>
          </Box>
        </Box>
      </Modal>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TextField
            label="월세"
            value={formData.monthlyRent}
            onChange={(e) => handleInputChange("monthlyRent", parseFloat(e.target.value))}
            error={!!errors.monthlyRent}
            helperText={errors.monthlyRent}
            required
            fullWidth
            InputProps={{
              inputComponent: NumberFormatCustom as any,
              endAdornment: <InputAdornment position="end">만원</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="월세 보증금"
            value={formData.monthlyDeposit}
            onChange={(e) => handleInputChange("monthlyDeposit", parseFloat(e.target.value))}
            error={!!errors.monthlyDeposit}
            helperText={errors.monthlyDeposit}
            fullWidth
            required
            InputProps={{
              inputComponent: NumberFormatCustom as any,
              endAdornment: <InputAdornment position="end">만원</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="전월세 전환율"
            value={formData.conversionRate}
            onChange={(e) => handleInputChange("conversionRate", parseFloat(e.target.value))}
            error={!!errors.conversionRate}
            required
            fullWidth
            InputProps={{
              inputComponent: NumberFormatCustom as any,
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            helperText={errors.conversionRate || "전월세 전환율을 입력해주세요 (예: 4.5)"}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="전세 보증금"
            value={formData.jeonseDeposit}
            fullWidth
            InputProps={{
              readOnly: true,
              inputComponent: NumberFormatCustom as any,
              endAdornment: <InputAdornment position="end">만원</InputAdornment>,
            }}
            disabled
            sx={{
              backgroundColor: "action.hover",
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#ffffff",
              },
              "& .MuiInputAdornment-root .MuiTypography-root": {
                color: "#ffffff",
              },
              "& .MuiInputLabel-root": {
                color: "#ffffff",
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
