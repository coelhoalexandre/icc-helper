export default interface ErrorMsgs {
  [index: string]: string;
  base: string;
  numInput: string;
  maxDecimalPlaces: string;
  methodsDisplay: string;
}

export type ErrorMsgsKey =
  | "base"
  | "numInput"
  | "maxDecimalPlaces"
  | "methodsDisplay";

export const errorMsgsDefault: ErrorMsgs = {
  base: "",
  numInput: "",
  maxDecimalPlaces: "",
  methodsDisplay: "",
};

export const requiredField = "Este campo é obrigatório.";
