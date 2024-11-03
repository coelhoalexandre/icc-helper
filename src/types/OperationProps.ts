import { OperationResult } from "./OperationResult";

export default interface OperationProps {
  operationResult: OperationResult;
  isThereSignalBit: boolean;
  isComplement: boolean;
}
