import styles from "./NumberPartsFieldset.module.css";
import { useContext } from "react";
import { ArchitecturesForNumberParts } from "../../../enums/ArchitecturesForNumberParts";
import { BinArithFormContext } from "../../../context/BinArithFormContext";
import { ControllerContext } from "../../../context/ControllerContext";

export default function NumberPartsFieldset() {
  const { controller } = useContext(ControllerContext);
  const {
    setArchitecturesForNumberPartsInput,
    isThereSignalBit,
    isPartQuantInputDisabled,
    integerPartQuantInput,
    fractionalPartQuantInput,
    checkPartsQuant,
  } = useContext(BinArithFormContext);
  const architecturesForNumberPart = controller.getArchitecturesForNumberPart();

  return (
    <fieldset className={styles.fieldsetParts}>
      <legend>Selecione a quantidade de bits para as partes: </legend>

      <select
        defaultValue={ArchitecturesForNumberParts.INT}
        onChange={(e) =>
          setArchitecturesForNumberPartsInput(
            e.target.value as ArchitecturesForNumberParts
          )
        }
      >
        {architecturesForNumberPart.map((architectureForNumberPart) => (
          <option
            key={architectureForNumberPart}
            value={architectureForNumberPart}
          >
            {architectureForNumberPart}
          </option>
        ))}
      </select>

      <div
        className={`${styles.wrapper} ${
          isPartQuantInputDisabled ? styles.wrapperDisabled : ""
        }`}
      >
        <label htmlFor="integerPartQuantInput">Inteira: </label>
        <input
          type="number"
          id="integerPartQuantInput"
          name="integerPartQuantInput"
          min={isThereSignalBit ? 2 : 1}
          defaultValue={1}
          required
          disabled={isPartQuantInputDisabled}
          value={integerPartQuantInput}
          onChange={(event) => checkPartsQuant(event, "IntegerPart")}
        />
        <label htmlFor="fractionalPartQuantInput">Fracionária: </label>
        <input
          type="number"
          id="fractionalPartQuantInput"
          name="fractionalPartQuantInput"
          min={0}
          defaultValue={0}
          required
          disabled={isPartQuantInputDisabled}
          value={fractionalPartQuantInput}
          onChange={(event) => checkPartsQuant(event, "FractionalPart")}
        />
      </div>
    </fieldset>
  );
}
