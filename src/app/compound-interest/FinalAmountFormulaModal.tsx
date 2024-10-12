import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Typography, Box } from "@mui/material";
import { BlockMath } from "react-katex";
import CloseIcon from "@mui/icons-material/Close";

interface FinalAmountFormulaModalProps {
  open: boolean;
  onClose: () => void;
}

export function FinalAmountFormulaModal({ open, onClose }: FinalAmountFormulaModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" justifyContent="center" alignItems="center">
          최종 금액 계산 공식
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
          <BlockMath>{`\\text{최종 금액} = \\text{초기 금액} \\times (1 + \\text{연복리 수익률})^{\\text{기간}}`}</BlockMath>
        </Box>
        <Box mb={3} p={2} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            예시 1
          </Typography>
          <Typography>초기 금액: 1,000,000원</Typography>
          <Typography>연복리 수익률: 5%</Typography>
          <Typography>기간: 3년</Typography>
          <Box mt={2}>
            <BlockMath>{`\\text{최종 금액} = 1,000,000 \\times (1 + 0.05)^3 \\approx 1,157,625\\text{원}`}</BlockMath>
          </Box>
        </Box>
        <Box mb={3} p={2} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            예시 2
          </Typography>
          <Typography>초기 금액: 2,000,000원</Typography>
          <Typography>연복리 수익률: 7%</Typography>
          <Typography>기간: 5년</Typography>
          <Box mt={2}>
            <BlockMath>{`\\text{최종 금액} = 2,000,000 \\times (1 + 0.07)^5 \\approx 2,805,255\\text{원}`}</BlockMath>
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
