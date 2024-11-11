export interface NumSysErrorMsgs {
  [index: string]: string;
  base: string;
  numInput: string;
  maxDecimalPlaces: string;
  methodsDisplay: string;
}

export type NumSysErrorMsgsKey =
  | "base"
  | "numInput"
  | "maxDecimalPlaces"
  | "methodsDisplay";

export const numSysErrorMsgsDefault: NumSysErrorMsgs = {
  base: "",
  numInput: "",
  maxDecimalPlaces: "",
  methodsDisplay: "",
};

export interface BinArithErrorMsgs {
  [index: string]: string;
  architecturalSize: string;
  numParts: string;
  operationSelector: string;
  num1: string;
  num2: string;
}

export type BinArithErrorMsgsKey =
  | "architecturalSize"
  | "numParts"
  | "operationSelector"
  | "num1"
  | "num2";

export const binArithErrorMsgsDefault: BinArithErrorMsgs = {
  architecturalSize: "",
  numParts: "",
  operationSelector: "",
  num1: "",
  num2: "",
};

export const requiredField = "Este campo é obrigatório.";
