import styles from "./NumberingSystemsView.module.css";
import { NumberingSystemsMethods } from "../../enums/NumberingSystemsMethods";
import { KnownBases } from "../../types/KnownBases";
import TFNComponent from "../components/TFNComponent";
import InverseTFNComponent from "./InverseTFNComponent";
import AggregationComponent from "./AggregationComponent";
import DisaggregationComponent from "./DisaggregationComponent";

interface NumberingSystemViewProps {
  knownBases: KnownBases;
  numInput: string;
  baseInput: number;
}

export default function NumberingSystemView({
  knownBases,
  numInput,
  baseInput,
}: NumberingSystemViewProps) {
  const methodsRequired: NumberingSystemsMethods[] = [];
  const methods = knownBases.map((knownBase) => {
    let method: JSX.Element;

    switch (knownBase.id) {
      case NumberingSystemsMethods.TFN:
        method = <TFNComponent knownBase={knownBase} />;
        break;

      case NumberingSystemsMethods.INVERSE_TFN:
        method = <InverseTFNComponent knownBase={knownBase} />;
        break;

      case NumberingSystemsMethods.AGGREGATION:
        method = <AggregationComponent knownBase={knownBase} />;
        break;

      case NumberingSystemsMethods.DISAGGREGATION:
        method = <DisaggregationComponent knownBase={knownBase} />;
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
            O número <strong>{numInput}</strong> na base{" "}
            <strong>{knownBase.targetBase}</strong> é{" "}
            <strong>{knownBase.convertedNumber}</strong>.
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
      </section>
      <p>
        <strong>Métodos Necessários:</strong> {methodsRequired.join(", ")}
      </p>
      {methods.map((method) => method)}
    </>
  );
}
