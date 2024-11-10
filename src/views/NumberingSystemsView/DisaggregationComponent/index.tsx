import styles from "../NumberingSystemsView.module.css";
import MethodsProps from "../../../types/MethodsProps";
import { NumberingSystemsMethods } from "../../../enums/NumberingSystemsMethods";

export default function DisaggregationComponent({ knownBase }: MethodsProps) {
  if (knownBase.id !== NumberingSystemsMethods.DISAGGREGATION)
    throw new Error(
      "The Known Base does not match that of the Disaggregation Component"
    );
  return (
    <>
      <p className="--marginTop">
        {knownBase.digits.map((digit, index) => (
          <span className={styles.aggregationSpan} key={index}>
            <strong>{digit}</strong>
          </span>
        ))}{" "}
        ={" "}
        {knownBase.disaggregations.map((disaggretion, index) => (
          <span className={styles.aggregationSpan} key={index}>
            <strong>{disaggretion}</strong>
          </span>
        ))}
      </p>
    </>
  );
}
