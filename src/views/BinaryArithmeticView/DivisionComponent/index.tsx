import styles from "../BinaryArithmeticView.module.css";
import { OperationsValues } from "../../../enums/OperationsValues";
import { OperationResult } from "../../../types/OperationResult";

export default function DivisionComponent({
  operationResult,
}: {
  operationResult: OperationResult;
}) {
  if (operationResult.id !== OperationsValues.DIV)
    throw new Error(
      "The Operation Result does not match the Multiplication Component"
    );

  return (
    <>
      <div>
        <div>
          <p>{operationResult.nums.num1}</p>{" "}
          <div className={styles.rests}>
            {operationResult.leftSide.map((leftSide, index) => (
              <p key={index} className={styles[leftSide.id]}>
                {leftSide.value}
              </p>
            ))}
          </div>
        </div>
        <div>
          <div className={styles.divider}>
            <p>{operationResult.nums.num2}</p>
          </div>
          <p>{operationResult.visualResult}</p>
        </div>
      </div>
    </>
  );
}
