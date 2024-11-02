import styles from "./BinaryArithmeticView.module.css";
import { OperationsValues } from "../../enums/OperationsValues";
import { OperationResult } from "../../types/OperationResult";
import ArchitectureSize from "../../types/ArchitectureSize";
import { useBodyWidth } from "../../hooks/useWindowScreen";
import { useLayoutEffect, useState } from "react";
import AdditionComponent from "./AdditionComponents";
import TFN from "../../types/INumberingSystemsMethod/TFN";
import TFNComponent from "../components/TFNComponent";

interface BinaryArithmeticViewProps {
  architecturalSize: ArchitectureSize;
  operationResult: OperationResult;
  TFN: TFN;
}
export default function BinaryArithmeticView({
  architecturalSize,
  operationResult,
  TFN,
}: BinaryArithmeticViewProps) {
  const minMaxWidth = 235;
  const [maxWidth, setMaxWidth] = useState(minMaxWidth);
  const bodyWidth = useBodyWidth();

  useLayoutEffect(() => {
    const minWidth = 320;
    if (bodyWidth <= minWidth) setMaxWidth(minMaxWidth);
    else setMaxWidth(minMaxWidth + bodyWidth - minWidth);
  }, [bodyWidth]);

  const getCalculation = () => {
    const register1 = { name: "R1", value: operationResult.num1 };
    const register2 = { name: "R2", value: operationResult.num2 };
    const register3 = {
      name: "R3",
      value: `${register1.name} ${operationResult.signal} ${register2.name}`,
    };
    let calculation: JSX.Element;
    switch (operationResult.id) {
      case OperationsValues.ADD:
        calculation = <AdditionComponent operationResult={operationResult} />;
        break;
      case OperationsValues.SUB:
        calculation = <></>;
        break;
      case OperationsValues.MUL:
        calculation = <></>;
        break;
      case OperationsValues.DIV:
        calculation = <></>;
        break;
    }
    return (
      <section
        className={styles.calculationSection}
        style={{ maxWidth: `${maxWidth}px` }}
      >
        <h3>Cálculo</h3>
        <div className={styles.calculationContainer}>
          <div className={styles.registers}>
            <p>
              <strong>{register1.name}:</strong> {register1.value}
            </p>
            <p>
              <strong>{register2.name}:</strong> {register2.value}
            </p>
            <p>
              <strong>{register3.name}:</strong> {register3.value}
            </p>
          </div>
          <div className={styles.calculationWrapper}>
            <h4>{register3.value}:</h4>
            <div className={styles.calculation}>{calculation}</div>
          </div>
          <div className={styles.result}>
            <p>
              Resultado: <strong>{operationResult.visualResult}</strong>
            </p>
            <div className={styles.TFN}>
              <p className={styles.title}>
                <strong>TFN</strong>
              </p>
              <TFNComponent knownBase={TFN} />
            </div>
            <p>
              Representação em Decimal: <strong>{TFN.convertedNumber}</strong>
            </p>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.description}>
        <div className={styles.architecture}>
          <h3 className={styles.architectureTitle}>Arquitetura</h3>
          <p className={styles.total}>
            <strong>Total:</strong> {architecturalSize.total}
          </p>
          <p className={styles.integer}>
            <strong>Inteiros: </strong> {architecturalSize.integerPart}
          </p>
          <p className={styles.fractional}>
            <strong>Fracionários: </strong> {architecturalSize.fractionalPart}
          </p>
        </div>
        <div className={styles.IOULA}>
          <h3>E/S ULA</h3>
          <div>
            <p>
              <strong>Função:</strong> {operationResult.id}
            </p>
            <p>
              <strong>Diagnostico:</strong> {operationResult.diagnostic}
            </p>
          </div>
        </div>
      </section>
      {getCalculation()}
    </div>
  );
}
