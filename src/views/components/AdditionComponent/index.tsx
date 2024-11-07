import styles from "../../BinaryArithmeticView/BinaryArithmeticView.module.css";
import { OperationsValues } from "../../../enums/OperationsValues";
import OperationProps from "../../../types/OperationProps";
import { Register } from "../../../types/Register";

interface AdditionComponentProps extends OperationProps {
  currentRegister: Register;
  isThereSignalBit: boolean;
  isComplement?: boolean;
  isPartialProduct?: boolean;
  isFirstPartialProduct?: boolean;
  isPartialRest?: boolean;
}

export default function AdditionComponent({
  operationResult,
  registers,
  currentRegister,
  isThereSignalBit,
  isComplement,
  isPartialProduct,
  isFirstPartialProduct,
  isPartialRest,
}: AdditionComponentProps) {
  if (operationResult.id !== OperationsValues.ADD)
    throw new Error(
      "The Operation Result does not match the Addition Component"
    );
  if (isPartialProduct)
    registers = registers.filter((_, index) => index > 2 && index < 5);

  return (
    <>
      <div>
        <p>
          <strong>Carries:</strong>
        </p>
        {isComplement || isPartialRest ? (
          ""
        ) : isFirstPartialProduct ? (
          registers.map((register, index) => (
            <p key={index}>
              <strong>{register.name}:</strong>
            </p>
          ))
        ) : (
          <>
            <p>
              <strong>
                R<sub>out</sub>:
              </strong>
            </p>
            <p>
              <strong>{currentRegister.name}:</strong>
            </p>
          </>
        )}
        {isPartialProduct ? (
          <p>
            <strong>
              R<sub>out</sub>:
            </strong>
          </p>
        ) : (
          ""
        )}
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
