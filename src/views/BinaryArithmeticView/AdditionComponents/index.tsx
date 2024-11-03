import styles from "../BinaryArithmeticView.module.css";
import { OperationsValues } from "../../../enums/OperationsValues";
import OperationProps from "../../../types/OperationProps";

export default function AdditionComponent({
  operationResult,
  isThereSignalBit,
  isComplement,
}: OperationProps) {
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
        {isComplement
          ? " "
          : [1, 2, 3].map((value) => (
              <p key={value}>
                <strong>R{value}:</strong>
              </p>
            ))}
      </div>
      <div>
        <p>
          {isThereSignalBit ? (
            <>
              <strong>
                {operationResult.carries[0]}
                {operationResult.carries[1]}
              </strong>
              {operationResult.carries.slice(2)}
            </>
          ) : (
            <>
              <strong>{operationResult.carries[0]}</strong>
              {operationResult.carries.slice(1)}
            </>
          )}
        </p>
        <p>{operationResult.leftOperand}</p>
        <p className={styles.lastOperand}>
          {operationResult.signal}
          {operationResult.rightOperand}
        </p>
        <p>{operationResult.registerResult}</p>
      </div>
    </>
  );
}
