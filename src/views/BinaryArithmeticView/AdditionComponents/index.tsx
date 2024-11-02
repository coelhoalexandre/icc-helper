import styles from "../BinaryArithmeticView.module.css";
import { OperationsValues } from "../../../enums/OperationsValues";
import OperationProps from "../../../types/OperationProps";

export default function AdditionComponent({ operationResult }: OperationProps) {
  if (operationResult.id !== OperationsValues.ADD)
    throw new Error(
      "The Operation Result does not match the Addition Component"
    );
  return (
    <>
      <div>
        <p>
          <strong>Carries:</strong>
        </p>
        <p>
          <strong>R1:</strong>
        </p>
        <p>
          <strong>R2:</strong>
        </p>
        <p>
          <strong>R3:</strong>
        </p>
      </div>
      <div>
        <p>
          <strong>{operationResult.carries[0]}</strong>
          {operationResult.carries.slice(1)}
        </p>
        <p>{operationResult.num1}</p>
        <p className={styles.lastOperand}>
          {operationResult.signal}
          {operationResult.num2}
        </p>
        <p>{operationResult.registerResult}</p>
      </div>
    </>
  );
}
