import { removeCommas } from "./numberFormat";

export type ValidationResult<T> = {
  errors: T;
  hasError: boolean;
};

export function isValidNumber(value: string): boolean {
  const numericValue = parseFloat(removeCommas(value));
  return !isNaN(numericValue) && isFinite(numericValue);
}

export function isValidDate(date: Date | null): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function validateFormData<T>(
  formData: T,
  shouldValidateField: (field: string) => boolean,
  isValidInput: (field: string, value: any) => boolean
): ValidationResult<T> {
  let hasError = false;
  const newErrors: any = {};

  Object.entries(formData as { [key: string]: any }).forEach(([field, value]) => {
    if (shouldValidateField(field)) {
      if (!isValidInput(field, value)) {
        newErrors[field] = "유효하지 않은 입력입니다.";
        hasError = true;
      } else {
        newErrors[field] = null;
      }
    } else {
      newErrors[field] = null;
    }
  });

  return { errors: newErrors, hasError };
}

export function createValidateDates<E>(
  setErrors: React.Dispatch<React.SetStateAction<E>>,
  startDateErrorKey: keyof E,
  endDateErrorKey: keyof E
) {
  return (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate && startDate > endDate) {
      setErrors((prev: E) => ({
        ...prev,
        [startDateErrorKey]: "시작 날짜는 종료 날짜보다 늦을 수 없습니다.",
        [endDateErrorKey]: "종료 날짜는 시작 날짜보다 빠를 수 없습니다.",
      }));
    } else {
      setErrors((prev: E) => ({
        ...prev,
        [startDateErrorKey]: null,
        [endDateErrorKey]: null,
      }));
    }
  };
}

export function createHandleInputChange<T, E>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<E>>,
  shouldValidateField: (field: keyof T) => boolean,
  isValidInput: (field: keyof T, value: any) => boolean
) {
  return (field: keyof T, value: any) => {
    setFormData((prev: T) => ({ ...prev, [field]: value }));
    if (shouldValidateField(field)) {
      setErrors((prev: E) => ({
        ...prev,
        [field]: isValidInput(field, value) ? null : "유효하지 않은 입력입니다.",
      }));
    }
  };
}
