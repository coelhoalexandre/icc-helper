import styles from "../BinaryArithmeticView.module.css";
import { OperationsValues } from "../../../enums/OperationsValues";
import OperationProps from "../../../types/OperationProps";

// interface MultiplicationComponentProps extends OperationProps {
// }

export default function MultiplicationComponent({
  operationResult,
  registers,
}: OperationProps) {
  if (operationResult.id !== OperationsValues.MUL)
    throw new Error(
      "The Operation Result does not match the Multiplication Component"
    );
  registers = registers.filter(
    (register) => register.name !== registers[2].name
  );
  return (
    <>
      <div>
        {registers.map((register, index) => (
          <p key={index}>
            <strong>{register.name}:</strong>
          </p>
        ))}
      </div>
      <div>
        <p>
          {operationResult.isReversed ? registers[1].value : registers[0].value}
        </p>
        <p className={styles.lastOperand}>
          {operationResult.signal}
          {operationResult.isReversed ? registers[0].value : registers[1].value}
        </p>
        {operationResult.partialProducts.map((partialProduct, index) => (
          <p key={index}>{partialProduct}</p>
        ))}
      </div>
    </>
  );
}
