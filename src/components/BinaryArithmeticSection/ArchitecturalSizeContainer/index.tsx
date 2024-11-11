import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import styles from "../BinaryArithmeticSection.module.css";
import { BinArithFormContext } from "../../../context/BinArithFormContext";

export default function ArchitecturalSizeContainer() {
  const architecturalSizeRef = useRef<HTMLInputElement | null>(null);
  const {
    submitted,
    submittedWithSuccess,
    errorMsgs,
    architecturalSize,
    isThereSignalBit,
    setIsThereSignalBit,
    isThereSignalBitDisabled,
    checkPartsQuant,
  } = useContext(BinArithFormContext);

  const architecturalSizeErroMsg = errorMsgs.architecturalSize;

  useEffect(() => {
    if (architecturalSizeRef.current && architecturalSizeErroMsg)
      architecturalSizeRef.current.focus();
  }, [architecturalSizeErroMsg, submitted]);

  useLayoutEffect(() => {
    if (architecturalSize.total < (isThereSignalBit ? 2 : 1))
      checkPartsQuant(`${isThereSignalBit ? 2 : 1}`, "ArchitecturalSize");
  }, [architecturalSize.total, checkPartsQuant, isThereSignalBit]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <label htmlFor="architecturalSizeInput">
          Diga o tamanho da arquitetura:
        </label>
        <input
          ref={(input) => (architecturalSizeRef.current = input)}
          type="number"
          id="architecturalSizeInput"
          name="architecturalSizeInput"
          required
          value={architecturalSize.total}
          onChange={(event) =>
            checkPartsQuant(event.target.value, "ArchitecturalSize")
          }
          aria-invalid={
            submitted
              ? architecturalSizeErroMsg
                ? true
                : submittedWithSuccess
                ? false
                : undefined
              : undefined
          }
          aria-errormessage="architecturalSizeError"
        />
        <span id="architecturalSizeError" className="--error-msg" tabIndex={0}>
          {architecturalSizeErroMsg}
        </span>
      </div>
      <span>
        <label htmlFor="isThereSignalBit">Tem bit de Sinal?</label>
        <input
          type="checkbox"
          id="isThereSignalBit"
          name="isThereSignalBit"
          disabled={isThereSignalBitDisabled}
          checked={isThereSignalBit}
          onChange={(event) => setIsThereSignalBit(event.target.checked)}
        />
      </span>
    </div>
  );
}
