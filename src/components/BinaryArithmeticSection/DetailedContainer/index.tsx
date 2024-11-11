import { useContext } from "react";
import styles from "./DetailedContainer.module.css";
import { BinArithFormContext } from "../../../context/BinArithFormContext";

export default function DetailedContainer() {
  const {
    fractionalPartQuantInput,
    isNumInputModified,
    setIsNumInputModified,
    isDecimalResult,
    setIsDecimalResult,
  } = useContext(BinArithFormContext);
  return (
    <div className={styles.containerDetailed}>
      <div className={styles.inputWrapper}>
        <label htmlFor="isNumInputModified">
          <strong>
            Aplicar Modificador {fractionalPartQuantInput ? "Double" : "Long"}?
          </strong>
        </label>
        <input
          type="checkbox"
          name="isNumInputModified"
          id="isNumInputModified"
          checked={isNumInputModified}
          onChange={(event) => setIsNumInputModified(event.target.checked)}
        />
      </div>
      <div className={styles.inputWrapper}>
        <label htmlFor="isDecimalResult">
          <strong>Representar em Decimal?</strong>
        </label>
        <input
          type="checkbox"
          name="isDecimalResult"
          id="isDecimalResult"
          checked={isDecimalResult}
          onChange={(event) => setIsDecimalResult(event.target.checked)}
        />
      </div>
    </div>
  );
}
