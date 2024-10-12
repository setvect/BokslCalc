import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Typography, Box } from "@mui/material";
import { BlockMath } from "react-katex";
import CloseIcon from "@mui/icons-material/Close";

interface AnnualRateFormulaModalProps {
  open: boolean;
  onClose: () => void;
}

export function AnnualRateFormulaModal({ open, onClose }: AnnualRateFormulaModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" justifyContent="center" alignItems="center">
          복리 계산 공식
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <BlockMath>
            {`\\text{연복리 수익률} = \\left( \\frac{\\text{최종 금액}}{\\text{초기 금액}} \\right)^{\\frac{1}{\\text{기간}}} - 1 \\times 100\\%`}
          </BlockMath>
        </Box>
        <Box mb={3} p={2} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            예시 1
          </Typography>
          <Typography>초기 금액: 1,000,000원</Typography>
          <Typography>최종 금액: 1,500,000원</Typography>
          <Typography>기간: 3년</Typography>
          <Box mt={2}>
            <BlockMath>
              {`\\text{연복리 수익률} = \\left( \\frac{1,500,000}{1,000,000} \\right)^{\\frac{1}{3}} - 1 \\times 100\\% \\approx 14.47\\%`}
            </BlockMath>
          </Box>
        </Box>
        <Box mb={3} p={2} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            예시 2
          </Typography>
          <Typography>초기 금액: 2,000,000원</Typography>
          <Typography>최종 금액: 2,500,000원</Typography>
          <Typography>기간: 2년</Typography>
          <Box mt={2}>
            <BlockMath>
              {`\\text{연복리 수익률} = \\left( \\frac{2,500,000}{2,000,000} \\right)^{\\frac{1}{2}} - 1 \\times 100\\% \\approx 11.80\\%`}
            </BlockMath>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
