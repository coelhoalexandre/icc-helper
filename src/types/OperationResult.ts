import { OperationsValues } from "../enums/OperationsValues";

export type OperationResult =
  | SumOperation
  | SubtractionOperation
  | MultiplicationOperation
  | DivisionOperation;

interface IOperationResult {
  id: OperationsValues;
  operationResult: string;
}

interface SumOperation extends IOperationResult {
  id: OperationsValues.SUM;
  carries: string;
}

interface SubtractionOperation extends IOperationResult {
  id: OperationsValues.SUBTRACTION;
}

interface MultiplicationOperation extends IOperationResult {
  id: OperationsValues.MULTIPLICATION;
}

interface DivisionOperation extends IOperationResult {
  id: OperationsValues.DIVISION;
}
