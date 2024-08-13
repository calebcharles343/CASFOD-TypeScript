import { ChangeEvent } from "react";

export interface FormValues {
  departmentalCode: string;
  pvNumber: string;
  payingStation: string;
  date: string;
  payTo: string;
  being: string;
  amountInWords: string;
  grantCode: string;
  grossAmount: string;
  vat: string;
  wht: string;
  devLevy: string;
  otherDeductions: string;
  netAmount: string;
  chartOfAccountCategories: string;
  chartOfAccount: string;
  chartOfAccountCode: string;
  projBudgetLine: string;
  note: string;
  mandateReference: string;
  preparedBy: string;
  checkedBy: string;
}

export interface FormValues2 {
  date: string;
  department: string;
  suggestedSupplier: string;
  requiredBy: string;
  city: string;
  periodOfActivity: string;
  activityDescription: string;
  expenseChargedTo: string;
  accountCode: string;
  requestedBy: string;
  address: string;
  finalDeliveryPoint: string;
  approvedBy: string;
  description: string;
  frequency: string;
  quantity: string;
  unit: string;
  unitCost: string;
  total: string;
}

export interface ButtonProps {
  size: "small" | "medium" | "large";
  type: any;
}

export interface StyledFormRowProps {
  type?: "small" | "medium" | "large" | "wide";
}

export interface RowProps {
  type?: "horizontal";
}
export interface OptionProps {
  position: string;
  code: string;
}

export interface SelectProps {
  id: string;
  type: string;
  options: Filter[] | undefined;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  // data: OptionProps[];
}
export interface FormProps {
  type?: "regular" | "modal";
}

export interface FormRowProps {
  label: string;
  error: any;
  children: any;
  type: "small" | "medium" | "large" | "wide";
}
/*
 error:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
*/

export interface Filter {
  position: string;
  code: string;
}

// export type StyledInputProps = {
//   reset: UseFormReset<FormValues>;
// };
