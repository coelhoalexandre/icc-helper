import { OperationsValues } from "../enums/OperationsValues";

export default interface OperationResults {
  id: OperationsValues;
  signal: string;
  register1: string;
  register2: string;
  results: OperationResult[];
}

export type OperationResult =
  | AdditionOperation
  | SubtractionOperation
  | MultiplicationOperation
  | DivisionOperation;

export type Diagnostic = "OK" | "OVERFLOW" | "UNDERFLOW" | "NaN";

interface IOperationResult {
  id: OperationsValues;
  registerResult: string;
  visualResult: string;
  diagnostic: Diagnostic;
  signal: string;
}

interface AdditionOperation extends IOperationResult {
  id: OperationsValues.ADD;
  signal: "+";
  carries: string;
  isComplement: boolean;
  isPartialProduct: boolean;
  isPartialRest: boolean;
  leftOperand: string;
  rightOperand: string;
}

interface SubtractionOperation extends IOperationResult {
  id: OperationsValues.SUB;
  signal: "-";
}

interface MultiplicationOperation extends IOperationResult {
  id: OperationsValues.MUL;
  signal: "x";
  partialProducts: string[];
  isReversed: boolean;
}

interface DivisionOperation extends IOperationResult {
  id: OperationsValues.DIV;
  signal: "÷";
  nums: { num1: string; num2: string };
  leftSide: { id: "subtraction" | "leftOperand"; value: string }[];
  isNegativeResult: boolean;
  complementsOf: string[];
}
