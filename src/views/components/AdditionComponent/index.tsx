import styles from "../../BinaryArithmeticView/BinaryArithmeticView.module.css";
import { OperationsValues } from "../../../enums/OperationsValues";
import OperationProps from "../../../types/OperationProps";
import { Register } from "../../../types/Register";

interface AdditionComponentProps extends OperationProps {
  isThereSignalBit: boolean;
  currentRegister: Register;
  isNumInputModified?: boolean;
  index?: number;
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
  isNumInputModified,
  index,
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

  const getLeftSide = () => {
    if (isComplement || isPartialRest) return "";

    if (isPartialProduct)
      if (isFirstPartialProduct)
        return (
          <>
            {registers.map((register, index) => (
              <p key={index}>
                <strong>{register.name}:</strong>
              </p>
            ))}{" "}
            <p>
              <strong>
                R<sub>out</sub>:
              </strong>
            </p>
          </>
        );
      else
        return (
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
        );

    if (isNumInputModified) {
      if (!index)
        return (
          <>
            <p>
              <strong>{registers[1].name}:</strong>
            </p>
            <p>
              <strong>{registers[3].name}:</strong>
            </p>
            <p>
              <strong>{registers[4].name}:</strong>
            </p>
          </>
        );
      else
        return (
          <>
            <p>
              <strong>{registers[0].name}:</strong>
            </p>
            <p>
              <strong>{registers[2].name}:</strong>
            </p>
            <p>
              <strong>{registers[5].name}:</strong>
            </p>
          </>
        );
    }

    return registers.map((register) => (
      <p>
        <strong>{register.name}:</strong>
      </p>
    ));
  };

  return (
    <>
      <div>
        <p>
          <strong>Carries:</strong>
        </p>
        {getLeftSide()}
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
