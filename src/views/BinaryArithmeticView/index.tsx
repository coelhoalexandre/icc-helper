import styles from "./BinaryArithmeticView.module.css";
import { OperationsValues } from "../../enums/OperationsValues";
import OperationResults from "../../types/OperationResult";
import ArchitectureSize from "../../types/ArchitectureSize";
import { useBodyWidth } from "../../hooks/useWindowScreen";
import { useLayoutEffect, useState } from "react";
import AdditionComponent from "./AdditionComponents";
import TFN from "../../types/INumberingSystemsMethod/TFN";
import TFNComponent from "../components/TFNComponent";
import Calculations from "../../types/Calculations";

interface BinaryArithmeticViewProps {
  architecturalSize: ArchitectureSize;
  operationResults: OperationResults;
  isThereSignalBit: boolean;
  TFN: TFN;
  isComplementResult: boolean;
}
export default function BinaryArithmeticView({
  architecturalSize,
  operationResults,
  isThereSignalBit,
  TFN,
  isComplementResult,
}: BinaryArithmeticViewProps) {
  const minMaxWidth = 235;
  const [maxWidth, setMaxWidth] = useState(minMaxWidth);
  const bodyWidth = useBodyWidth();
  const firstOperationResult = operationResults.results[0];

  useLayoutEffect(() => {
    const minWidth = 320;
    if (bodyWidth <= minWidth) setMaxWidth(minMaxWidth);
    else setMaxWidth(minMaxWidth + bodyWidth - minWidth);
  }, [bodyWidth]);

  const getCalculation = () => {
    const register1 = { name: "R1", value: operationResults.register1 };
    const register2 = { name: "R2", value: operationResults.register2 };
    const register3 = {
      name: "R3",
      value: `${register1.name} ${operationResults.signal} ${register2.name}`,
    };
    const calculations: Calculations[] = operationResults.results.map(
      (operationResult, index) => {
        switch (operationResult.id) {
          case OperationsValues.ADD:
            return {
              component: (
                <AdditionComponent
                  operationResult={operationResult}
                  isThereSignalBit={isThereSignalBit}
                  isComplement={operationResult.isComplement}
                />
              ),
              action: `${
                operationResult.isComplement
                  ? `Complemento de ${
                      operationResults.results[index - 1]
                        ? operationResults.results[index - 1].registerResult
                        : operationResults.register2
                    }`
                  : register3.value
              }`,
            };
          case OperationsValues.SUB:
            return { component: <></>, action: "" };
          case OperationsValues.MUL:
            return { component: <></>, action: "" };
          case OperationsValues.DIV:
            return { component: <></>, action: "" };
        }
      }
    );

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
          {calculations.map((calculation) => (
            <div className={styles.calculationWrapper}>
              <h4>{calculation.action}:</h4>
              <div className={styles.calculation}>{calculation.component}</div>
            </div>
          ))}
          <div className={styles.result}>
            <p>
              Resultado: <strong>{firstOperationResult.visualResult}</strong>
            </p>
            <div className={styles.TFN}>
              <p className={styles.title}>
                <strong>
                  TFN {isComplementResult ? "do Complemento" : ""}
                </strong>
              </p>
              <TFNComponent knownBase={TFN} />
            </div>
            <p>
              Representação em Decimal: {isComplementResult ? "-" : ""}
              <strong>{TFN.convertedNumber}</strong>
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
              <strong>Função:</strong> {operationResults.id}
            </p>
            <p>
              <strong>Diagnostico:</strong>{" "}
              {operationResults.id === OperationsValues.ADD
                ? firstOperationResult.diagnostic
                : operationResults.results[1].diagnostic}
            </p>
          </div>
        </div>
      </section>
      {getCalculation()}
    </div>
  );
}
