import { OperationResult } from "./OperationResult";
import { Register } from "./Register";

export default interface OperationProps {
  operationResult: OperationResult;
  registers: Register[];
}
