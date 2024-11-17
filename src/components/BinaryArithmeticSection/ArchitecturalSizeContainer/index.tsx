import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import styles from "../BinaryArithmeticSection.module.css";
import { BinArithFormContext } from "../../../context/BinArithFormContext";
import InputInformation from "../../InputInformation";

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
        <InputInformation
          origin="Tamanho da Arquitetura"
          content="Representa a quantidade de bits do número."
        >
          <label htmlFor="architecturalSizeInput">
            Diga o tamanho da arquitetura:
          </label>
        </InputInformation>

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
        <InputInformation
          origin="Caixa de Seleção de Bit de Sinal"
          content="Ao marcar essa caixa, o bit de maior magnitude será reservado para representa o sinal."
        >
          <label htmlFor="isThereSignalBit">Tem bit de Sinal?</label>
        </InputInformation>
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
