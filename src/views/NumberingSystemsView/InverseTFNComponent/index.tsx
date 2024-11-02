import styles from "./InverseTFNComponent.module.css";
import MethodsProps from "../../../types/MethodsProps";
import { NumberingSystemsMethods } from "../../../enums/NumberingSystemsMethods";

export default function InverseTFNComponent({ knownBase }: MethodsProps) {
  if (knownBase.id !== NumberingSystemsMethods.INVERSE_TFN)
    throw new Error(
      "The Known Base does not match that of the Inverse TFN Component"
    );
  return (
    <div className={styles.inverseTFN}>
      <div className={styles.divisions}>
        {knownBase.divisions.map((division) => {
          return (
            <>
              <p>
                {division.dividend} / {division.divider} = {division.quotient} |
                Resto: <strong>{division.rest}</strong>
              </p>
            </>
          );
        })}
      </div>
      {knownBase.multiplications.length ? (
        <div className={styles.multiplications}>
          {knownBase.multiplications.map((multiplication) => {
            return (
              <>
                <p>
                  {multiplication.factorLeft} x {multiplication.factorRight} ={" "}
                  <strong>{multiplication.product.integerPart}</strong>,
                  {multiplication.product.fractionalPart}
                </p>
              </>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
