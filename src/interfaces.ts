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
  chartOfAccount: string;
  chartOfAccountCode: string;
  projBudgetLine: string;
  note: string;
  mandateReference: string;
  preparedBy: string;
  checkedBy: string;
}

export interface ButtonProps {
  size: "small" | "medium" | "large";
}

export interface StyledFormRowProps {
  type?: "small" | "medium" | "large";
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
  options: OptionProps[];
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  // data: OptionProps[];
}
export interface FormProps {
  type?: "regular" | "modal";
}

export interface FormRowProps {
  label: string;
  error: string | undefined;
  children: any;
  type: "small" | "medium" | "large";
}
