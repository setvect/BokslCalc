import NumberFormatCustom from "@/components/NumberFormatCustom";
import { Grid, InputAdornment, TextField, Button, Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

type FormData = {
  jeonseDeposit: number | "";
  monthlyDeposit: number | "";
  conversionRate: number | "";
  monthlyRent: number | "";
};

type FormErrors = {
  jeonseDeposit?: string;
  monthlyDeposit?: string;
  conversionRate?: string;
  monthlyRent?: string;
};

export default function JeonseToMonthly() {
  const [formData, setFormData] = useState<FormData>({
    jeonseDeposit: "",
    monthlyDeposit: "",
    conversionRate: "",
    monthlyRent: "",
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
    if (name === "monthlyDeposit" && formData.jeonseDeposit !== "" && numValue > Number(formData.jeonseDeposit)) {
      return "월세 보증금은 전세 보증금보다 클 수 없습니다";
    }
    return undefined;
  };

  const calculateMonthlyRent = (data: FormData): number | "" => {
    const { jeonseDeposit, monthlyDeposit, conversionRate } = data;

    if (jeonseDeposit === "" || monthlyDeposit === "" || conversionRate === "") {
      return "";
    }

    return Math.round(((Number(jeonseDeposit) - Number(monthlyDeposit)) * Number(conversionRate)) / 1200);
  };

  const handleInputChange = (name: keyof FormData, value: number) => {
    const error = validateInput(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    const newFormData = { ...formData, [name]: value };

    // 유효성 검사를 통과한 경우에만 월세 계산
    if (!error && name !== "monthlyRent") {
      const calculatedRent = calculateMonthlyRent(newFormData);
      newFormData.monthlyRent = calculatedRent;
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
              전세 → 월세 전환 공식
            </Typography>
            <IconButton onClick={handleCloseModal} size="small" sx={{ color: "text.secondary" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography sx={{ mt: 2 }}>월세 = (전세보증금 - 월세보증금) × 전환율 ÷ 1200</Typography>
          <Typography sx={{ mt: 1 }} color="text.secondary">
            * 전환율은 연이율 기준입니다.
          </Typography>
          <Box sx={{ mt: 3, bgcolor: "background.paper", p: 2, borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="subtitle2" gutterBottom color="text.primary">
              예시 1)
            </Typography>
            <Typography color="text.primary">
              전세보증금: 3억원(30,000만원)
              <br />
              월세보증금: 5천만원(5,000만원)
              <br />
              전환율: 6%
              <br />
              월세 = (30,000 - 5,000) × 6 ÷ 1200 = 125만원
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom color="text.primary">
              예시 2)
            </Typography>
            <Typography color="text.primary">
              전세보증금: 2억원(20,000만원)
              <br />
              월세보증금: 1억원(10,000만원)
              <br />
              전환율: 4.5%
              <br />
              월세 = (20,000 - 10,000) × 4.5 ÷ 1200 = 37.5만원
            </Typography>
          </Box>
        </Box>
      </Modal>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TextField
            label="전세 보증금"
            value={formData.jeonseDeposit}
            onChange={(e) => handleInputChange("jeonseDeposit", parseFloat(e.target.value))}
            error={!!errors.jeonseDeposit}
            helperText={errors.jeonseDeposit}
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
            label="전월세 전환율"
            value={formData.conversionRate}
            onChange={(e) => handleInputChange("conversionRate", parseFloat(e.target.value))}
            error={!!errors.conversionRate}
            helperText={errors.conversionRate || "전월세 전환율을 입력해주세요 (예: 4.5)"}
            required
            fullWidth
            InputProps={{
              inputComponent: NumberFormatCustom as any,
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="월세"
            value={formData.monthlyRent}
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
