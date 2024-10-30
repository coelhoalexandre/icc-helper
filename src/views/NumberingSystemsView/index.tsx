import styles from "./NumberingSystemsView.module.css";
import { NumberingSystemsMethods } from "../../enums/NumberingSystemsMethods";
import { KnownBases } from "../../types/KnownBases";

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
        method = (
          <>
            <p>
              {knownBase.parcels.map((parcel, index) => {
                const signal =
                  knownBase.parcels.length !== index + 1 ? "+" : "=";
                return (
                  <>
                    {" "}
                    <strong>
                      {parcel.digit} x {parcel.base}
                      <sup>{parcel.exponent}</sup>
                    </strong>{" "}
                    {signal}
                  </>
                );
              })}
            </p>
            <p>
              {knownBase.products.join(" + ").replace(".", ",")} ={" "}
              {knownBase.convertedNumber}
            </p>
          </>
        );
        break;

      case NumberingSystemsMethods.INVERSE_TFN:
        console.log(knownBase.multiplications);
        method = (
          <div className={styles.inverseTFN}>
            <div className={styles.divisions}>
              {knownBase.divisions.map((division) => {
                return (
                  <>
                    <p>
                      {division.dividend} / {division.divider} ={" "}
                      {division.quotient} | Resto:{" "}
                      <strong>{division.rest}</strong>
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
                        {multiplication.factorLeft} x{" "}
                        {multiplication.factorRight} ={" "}
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
        break;

      case NumberingSystemsMethods.AGGREGATION:
        method = (
          <>
            <p className="--borderBottom">
              Número Binário:{" "}
              <strong>{knownBase.magnitudeCorrectedNumber}</strong>
            </p>
            <p className="--marginTop">
              {knownBase.aggregations.map((aggregation, index) => (
                <span className={styles.aggregationSpan} key={index}>
                  <strong>{aggregation}</strong>
                </span>
              ))}{" "}
              ={" "}
              {knownBase.convertedAggregations.map(
                (convertedAggregation, index) => (
                  <span className={styles.aggregationSpan} key={index}>
                    <strong>{convertedAggregation}</strong>
                  </span>
                )
              )}
            </p>
          </>
        );
        break;

      case NumberingSystemsMethods.DISAGGREGATION:
        method = (
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

        break;
    }

    if (!methodsRequired.includes(knownBase.id))
      methodsRequired.push(knownBase.id);
    return (
      <>
        <div className={styles.method}>
          <h3>
            Método: {knownBase.id} para a base {knownBase.targetBase}
          </h3>

          <div>{method}</div>

          <p>
            O número <strong>{numInput}</strong> na base{" "}
            <strong>{knownBase.targetBase}</strong> é{" "}
            <strong>{knownBase.convertedNumber}</strong>.
          </p>
        </div>
      </>
    );
  });

  return (
    <>
      <div className={styles.description}>
        <p>
          <strong>Base: </strong> {baseInput}
        </p>
        <p>
          <strong>Número de Entrada: </strong> {numInput}
        </p>
      </div>
      <p>
        <strong>Métodos Necessários:</strong> {methodsRequired.join(", ")}
      </p>
      {methods.map((method) => method)}
    </>
  );
}
