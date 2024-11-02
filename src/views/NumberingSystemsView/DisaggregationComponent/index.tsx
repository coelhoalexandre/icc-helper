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
        {knownBase.digits.map((digit) => (
          <span className={styles.aggregationSpan}>
            <strong>{digit}</strong>
          </span>
        ))}{" "}
        ={" "}
        {knownBase.disaggregations.map((disaggretion) => (
          <span className={styles.aggregationSpan}>
            <strong>{disaggretion}</strong>
          </span>
        ))}
      </p>
    </>
  );
}
