import styles from "./NumberingSystemsView.module.css";
import { NumberingSystemsMethods } from "../../enums/NumberingSystemsMethods";
import { KnownBases } from "../../types/KnownBases";
import TFNComponent from "../components/TFNComponent";
import InverseTFNComponent from "./InverseTFNComponent";
import AggregationComponent from "./AggregationComponent";
import DisaggregationComponent from "./DisaggregationComponent";
import { OperationResult } from "../../types/OperationResult";
import AdditionComponent from "../components/AdditionComponent";
import { useContext } from "react";
import { ControllerContext } from "../../context/ControllerContext";
import { MethodsDisplay } from "../../types/INumberingSystemsMethod/MethodsDisplay";

interface NumberingSystemViewProps {
  knownBases: KnownBases;
  numInput: string;
  baseInput: number;
  complementOperation: OperationResult | undefined;
  isNegative: boolean;
  methodsDisplay: MethodsDisplay;
}

export default function NumberingSystemView({
  knownBases,
  numInput,
  baseInput,
  complementOperation,
  isNegative,
  methodsDisplay,
}: NumberingSystemViewProps) {
  const { controller } = useContext(ControllerContext);
  const methodsRequired: NumberingSystemsMethods[] = [];
  let numberPreComplement = numInput;

  const selectedMethods = methodsDisplay
    .filter((methodDisplay) => methodDisplay[1])
    .map((methodDisplay) => methodDisplay[0]);
  const selectKnownBases = knownBases.filter((knownBase) =>
    selectedMethods.includes(knownBase.id)
  );

  const methods = selectKnownBases.map((knownBase) => {
    let numberResult = knownBase.convertedNumber;
    let method: JSX.Element;

    switch (knownBase.id) {
      case NumberingSystemsMethods.TFN:
        method = <TFNComponent knownBase={knownBase} />;
        break;

      case NumberingSystemsMethods.INVERSE_TFN:
        method = <InverseTFNComponent knownBase={knownBase} />;
        numberPreComplement = "0" + knownBase.convertedNumber;

        complementOperation = isNegative
          ? controller.getComplementResult(
              numberPreComplement.replace(",", ""),
              numberPreComplement.indexOf(",")
            )
          : undefined;
        numberResult = complementOperation
          ? complementOperation?.visualResult
          : numberResult;
        break;

      case NumberingSystemsMethods.AGGREGATION:
        method = <AggregationComponent knownBase={knownBase} />;
        break;

      case NumberingSystemsMethods.DISAGGREGATION:
        method = <DisaggregationComponent knownBase={knownBase} />;
        numberPreComplement = "0" + knownBase.convertedNumber;

        complementOperation = isNegative
          ? controller.getComplementResult(
              numberPreComplement.replace(",", ""),
              numberPreComplement.indexOf(",")
            )
          : undefined;
        numberResult = complementOperation
          ? complementOperation?.visualResult
          : numberResult;
        break;
    }

    if (!methodsRequired.includes(knownBase.id))
      methodsRequired.push(knownBase.id);
    return (
      <>
        <section className={styles.method}>
          <h3>
            Método: {knownBase.id} para a base {knownBase.targetBase}
          </h3>

          <div>{method}</div>

          <p>
            {isNegative ? "O complemento de" : "O número"}{" "}
            <strong>
              {numInput}
              <sub>{baseInput}</sub>
            </strong>{" "}
            na base <strong>{knownBase.targetBase}</strong> é{" "}
            <strong>
              {isNegative && knownBase.targetBase !== 2 ? "-" : ""}
              {numberResult}
            </strong>
            .
          </p>
        </section>
      </>
    );
  });

  return (
    <>
      <section className={styles.description}>
        <p>
          <strong>Base: </strong> {baseInput}
        </p>
        <p>
          <strong>Número de Entrada: </strong> {numInput}
        </p>
        <p>
          <strong>É negativo: </strong> {isNegative ? "Sim" : "Não"}
        </p>
      </section>
      <p>
        <strong>Métodos Necessários:</strong>{" "}
        {isNegative ? "Complemento, " : ""}
        {selectKnownBases.length
          ? methodsRequired.join(", ") + "."
          : "Nenhum Método Necessário Selecionado."}
      </p>
      {complementOperation ? (
        <section className={styles.method}>
          <h3>Método: Complemento da Base 2 de {numberPreComplement}</h3>
          <div>
            <div className={styles.complementOperation}>
              <AdditionComponent
                operationResult={complementOperation}
                isThereSignalBit
                isComplement
                registers={[]}
                currentRegister={{ name: "", value: "" }}
              />
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
      <ol className={styles.methodsList}>
        {methods.map((method) => (
          <li>{method}</li>
        ))}
      </ol>
    </>
  );
}
