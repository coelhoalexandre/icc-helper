import styles from "./BinaryArithmeticView.module.css";
import { OperationsValues } from "../../enums/OperationsValues";
import { OperationResult } from "../../types/OperationResult";
import { useBodyWidth } from "../../hooks/useWindowScreen";
import { useLayoutEffect, useState } from "react";
import AdditionComponent from "../components/AdditionComponent";
import TFNComponent from "../components/TFNComponent";
import Calculations from "../../types/Calculations";
import MultiplicationComponent from "./MultiplicationComponent";
import { Register } from "../../types/Register";
import DivisionComponent from "./DivisionComponent";
import { BinaryArithmeticViewProps } from "../../types/RenderData";
import InverseTFNComponent from "../components/InverseTFNComponent";

export default function BinaryArithmeticView({
  architecturalSize,
  operationResults,
  isThereSignalBit,
  isNumInputModified,
  inverseTFNs,
  inDecimalOperationResults,
  TFN,
  isComplementResult,
}: BinaryArithmeticViewProps) {
  let partialRestIndex = 0;
  const minMaxWidth = 235;
  const [maxWidth, setMaxWidth] = useState(minMaxWidth);
  const bodyWidth = useBodyWidth();

  let operationResult: OperationResult = operationResults.results[0];
  switch (operationResults.id) {
    case OperationsValues.ADD:
      if (isNumInputModified) {
        operationResult.visualResult = operationResults.results[1].visualResult;
        operationResult.diagnostic = operationResults.results[1].diagnostic;
      }
      break;
    case OperationsValues.SUB:
      if (isNumInputModified) operationResult = operationResults.results[3];
      else operationResult = operationResults.results[1];
      break;
    case OperationsValues.MUL:
      operationResult = {
        ...operationResults.results[operationResults.results.length - 1],
        diagnostic: operationResults.results[0].diagnostic,
      };
      if (isComplementResult)
        operationResult.visualResult =
          operationResults.results[
            operationResults.results.length - 2
          ].visualResult;
      break;
  }

  useLayoutEffect(() => {
    const minWidth = 320;
    if (bodyWidth <= minWidth) setMaxWidth(minMaxWidth);
    else setMaxWidth(minMaxWidth + bodyWidth - minWidth);
  }, [bodyWidth]);

  const getAdditionAction = (
    index: number,
    registers: Register[],
    currentRegister?: string,
    isComplement?: boolean,
    isPartialProduct?: boolean,
    isFirstPartialProduct?: boolean,
    isNumInputModified?: boolean,
    isDivision?: boolean
  ) => {
    if (isComplement)
      if (isNumInputModified)
        return (
          <>Complemento de {!index ? registers[3].value : registers[2].value}</>
        );
      else
        return (
          <>
            Complemento de{" "}
            {operationResults.results[index - 1]
              ? operationResults.results[0].id === OperationsValues.DIV
                ? operationResults.results[0].complementsOf[index - 1]
                  ? operationResults.results[0].complementsOf[index - 1]
                  : operationResults.results[index - 1].visualResult.replace(
                      ",",
                      ""
                    )
                : operationResults.results[index - 1].visualResult.replace(
                    ",",
                    ""
                  )
              : operationResults.registers[1]}
          </>
        );

    if (isNumInputModified) {
      if (
        !index ||
        (operationResults.id === OperationsValues.SUB && index === 1)
      )
        return <>{registers[4].value}</>;
      else return <>{registers[5].value}</>;
    }

    if (isPartialProduct)
      if (isFirstPartialProduct) return <>R4 + R5</>;
      else
        return (
          <>
            R<sub>out</sub> + {currentRegister}
          </>
        );

    if (isDivision) {
      partialRestIndex++;
      return <>Resto Parcial {partialRestIndex}</>;
    }
    return <>{registers[2].value}</>;
  };

  const getCalculation = () => {
    const filteredRegisters = operationResults.registers.filter(
      (register) => register !== null
    );

    const registers: Register[] = filteredRegisters.map((register, index) => ({
      name: `R${index + 1}`,
      value: register,
    }));
    if (isNumInputModified)
      registers.push(
        ...[
          {
            name: `R${registers.length + 1}`,
            value: `${registers[1].name} ${operationResults.signal} ${registers[3].name}`,
          },
          {
            name: `R${registers.length + 2}`,
            value: `${registers[0].name} ${operationResults.signal} ${registers[2].name}`,
          },
          {
            name: `Res`,
            value: `R${registers.length + 2} "${operationResults.signal}" R${
              registers.length + 1
            }`,
          },
        ]
      );
    else
      registers.push({
        name: `R${registers.length + 1}`,
        value: `${
          operationResults.results[0].id === OperationsValues.MUL &&
          operationResults.results[0].isReversed
            ? `${registers[1].name} ${operationResults.signal} ${registers[0].name}`
            : `${registers[0].name} ${operationResults.signal} ${registers[1].name}`
        }`,
      });
    const registerOut = {
      component: (
        <>
          R<sub>out</sub>
        </>
      ),
      value: "",
    };
    let isFirstPartialProduct: boolean;
    let currentRegister: Register;
    const isDivision =
      operationResults.id === OperationsValues.DIV ? true : false;
    const calculations: Calculations[] = operationResults.results.map(
      (operationResult, index) => {
        switch (operationResult.id) {
          case OperationsValues.ADD:
            isFirstPartialProduct = operationResults.results[index - 1]
              ? operationResults.results[index - 1].signal === "x"
                ? true
                : false
              : false;
            currentRegister = registers[2];
            if (operationResult.isPartialProduct) {
              registerOut.value = operationResult.registerResult;
              currentRegister = registers[index + 3];
            }
            return {
              component: (
                <AdditionComponent
                  operationResult={operationResult}
                  registers={registers}
                  isThereSignalBit={isThereSignalBit}
                  isNumInputModified={isNumInputModified}
                  isComplement={operationResult.isComplement}
                  isPartialProduct={operationResult.isPartialProduct}
                  isFirstPartialProduct={isFirstPartialProduct}
                  isPartialRest={operationResult.isPartialRest}
                  currentRegister={currentRegister}
                  index={index}
                />
              ),
              action: getAdditionAction(
                index,
                registers,
                currentRegister.name,
                operationResult.isComplement,
                operationResult.isPartialProduct,
                isFirstPartialProduct,
                isNumInputModified,
                isDivision
              ),
            };
          case OperationsValues.SUB:
            return { component: <></>, action: <></> };
          case OperationsValues.MUL:
            registers.push(
              ...operationResult.partialProducts.map(
                (partialProduct, index): Register => ({
                  name: `R${index + 4}`,
                  value: partialProduct,
                })
              )
            );
            return {
              component: (
                <MultiplicationComponent
                  operationResult={operationResult}
                  registers={registers}
                />
              ),
              action: <>{registers[2].value}</>,
            };
          case OperationsValues.DIV:
            return {
              component: (
                <DivisionComponent operationResult={operationResult} />
              ),
              action: <>{registers[2].value}</>,
            };
        }
      }
    );
    const registersLimit = isNumInputModified ? 7 : 3;
    const registersOfRegisters = registers.filter(
      (_, index) => index < registersLimit
    );
    return (
      <section
        className={styles.calculationSection}
        style={{ maxWidth: `${maxWidth}px` }}
      >
        <h3>Cálculo</h3>
        <div className={styles.calculationContainer}>
          {inverseTFNs.length
            ? inverseTFNs.map((inverseTFN) => (
                <div
                  className={`${styles.containerInverseTFN} ${styles.borderWrapper}`}
                >
                  <InverseTFNComponent knownBase={inverseTFN} />
                  <p>
                    Número{" "}
                    <strong>
                      {inverseTFN.originalNum}
                      <sub>10</sub>
                    </strong>{" "}
                    na base 2, respeitando a arquitetura, é{" "}
                    <strong>{inverseTFN.convertedNumber}</strong>
                  </p>
                </div>
              ))
            : ""}
          {inDecimalOperationResults.length
            ? inDecimalOperationResults.map((inDecimalOperationResult) => (
                <div
                  className={`${styles.calculationWrapper} ${styles.borderWrapper}`}
                >
                  <p>
                    <strong>
                      Complemento de {inDecimalOperationResult.originalNum}
                    </strong>
                  </p>
                  <div className={styles.calculation}>
                    <AdditionComponent
                      operationResult={inDecimalOperationResult.operation}
                      isThereSignalBit={isThereSignalBit}
                      registers={registers}
                      currentRegister={registers[0]}
                      isComplement
                    />
                  </div>
                </div>
              ))
            : ""}
          <div
            className={`${styles.registers} ${styles.borderWrapper}`}
            style={
              isNumInputModified
                ? { maxHeight: "25rem" }
                : { maxHeight: "12rem" }
            }
          >
            {registersOfRegisters.map((register, index) => (
              <p key={index}>
                <strong>{register.name}:</strong> {register.value}
              </p>
            ))}
          </div>
          {calculations.map((calculation, index) => (
            <div
              className={`${styles.calculationWrapper} ${styles.borderWrapper}`}
            >
              <h4>{calculation.action}:</h4>
              <div
                className={`${styles.calculation} ${
                  operationResults.id === OperationsValues.DIV && !index
                    ? styles.divWrapper
                    : ""
                }`}
              >
                {calculation.component}
              </div>
            </div>
          ))}
          <div className={`${styles.result} ${styles.borderWrapper}`}>
            <p>
              Resultado:{" "}
              <strong>
                {TFN !== "NaN" ? operationResult.visualResult : "NaN"}
              </strong>
            </p>
            {TFN && TFN !== "NaN" ? (
              <>
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
                  <strong>
                    {operationResults.results[0].id === OperationsValues.DIV
                      ? operationResults.results[0].isNegativeResult
                        ? "-"
                        : ""
                      : ""}
                    {TFN.convertedNumber}
                  </strong>
                </p>
              </>
            ) : (
              ""
            )}
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
              <strong>Diagnostico:</strong> {operationResult.diagnostic}
            </p>
          </div>
        </div>
      </section>
      {getCalculation()}
    </div>
  );
}
