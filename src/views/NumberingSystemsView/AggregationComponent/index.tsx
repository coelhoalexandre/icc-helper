import styles from "../NumberingSystemsView.module.css";
import MethodsProps from "../../../types/MethodsProps";
import { NumberingSystemsMethods } from "../../../enums/NumberingSystemsMethods";

export default function AggregationComponent({ knownBase }: MethodsProps) {
  if (knownBase.id !== NumberingSystemsMethods.AGGREGATION)
    throw new Error(
      "The Known Base does not match that of the Aggregation Component"
    );
  return (
    <>
      <p className="--borderBottom">
        Número Binário: <strong>{knownBase.magnitudeCorrectedNumber}</strong>
      </p>
      <p className="--marginTop">
        {knownBase.aggregations.map((aggregation, index) => (
          <span className={styles.aggregationSpan} key={index}>
            <strong>{aggregation}</strong>
          </span>
        ))}{" "}
        ={" "}
        {knownBase.convertedAggregations.map((convertedAggregation, index) => (
          <span className={styles.aggregationSpan} key={index}>
            <strong>{convertedAggregation}</strong>
          </span>
        ))}
      </p>
    </>
  );
}
