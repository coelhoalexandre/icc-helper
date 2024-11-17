import { useContext } from "react";
import styles from "./DetailedContainer.module.css";
import { BinArithFormContext } from "../../../context/BinArithFormContext";
import InputInformation from "../../InputInformation";

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
        <InputInformation
          origin="a Caixa de Seleção do Modificador do número."
          content="Ao aplicar o modificador aceitará o dobro de bits e usará mais registradores."
        >
          <label htmlFor="isNumInputModified">
            <strong>
              Aplicar Modificador {fractionalPartQuantInput ? "Double" : "Long"}
              ?
            </strong>
          </label>
        </InputInformation>
        <input
          type="checkbox"
          name="isNumInputModified"
          id="isNumInputModified"
          checked={isNumInputModified}
          onChange={(event) => setIsNumInputModified(event.target.checked)}
        />
      </div>
      <div className={styles.inputWrapper}>
        <InputInformation
          origin="a Caixa de Seleção da Representação em Decimal do número."
          content="Ao marcar a representação em decimal, ao final dos resultados haverá uma TFN e a representação do número em decimal (base 10)."
        >
          <label htmlFor="isDecimalResult">
            <strong>Representar em Decimal?</strong>
          </label>
        </InputInformation>
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
