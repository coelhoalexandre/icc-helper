import { OperationsValues } from "../enums/OperationsValues";

export type OperationResult =
  | AdditionOperation
  | SubtractionOperation
  | MultiplicationOperation
  | DivisionOperation;

export type Diagnostic = "OK" | "OVERFLOW" | "UNDERFLOW";

interface IOperationResult {
  id: OperationsValues;
  num1: string;
  num2: string;
  registerResult: string;
  visualResult: string;
  diagnostic: Diagnostic;
  signal: string;
}

interface AdditionOperation extends IOperationResult {
  id: OperationsValues.ADD;
  signal: "+";
  carries: string;
}

interface SubtractionOperation extends IOperationResult {
  id: OperationsValues.SUB;
  signal: "-";
}

interface MultiplicationOperation extends IOperationResult {
  id: OperationsValues.MUL;
  signal: "x";
}

interface DivisionOperation extends IOperationResult {
  id: OperationsValues.DIV;
  signal: "÷";
}
