// 천 단위 콤마 포맷팅 함수
export const formatNumber = (num: string) => {
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

// 콤마 제거 함수
export const removeCommas = (num: string | number | null | undefined): string => {
  if (num === null || num === undefined) {
    return "";
  }
  if (typeof num === "number") {
    return num.toString();
  }
  return num.replace(/,/g, "");
};

// 입력 처리 함수
export const handleNumberInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
  const numericValue = removeCommas(value).replace(/[^0-9.]/g, "");
  setter(formatNumber(numericValue));
};
