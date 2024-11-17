import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import styles from "./NumContainer.module.css";
import { NumSysFormContext } from "../../../context/NumSysFormContext";
import { ControllerContext } from "../../../context/ControllerContext";
import InputInformation from "../../InputInformation";

export default function NumContainer() {
  const numContainerRef = useRef<HTMLInputElement | null>(null);
  const { controller } = useContext(ControllerContext);
  const {
    submitted,
    submittedWithSuccess,
    baseInput,
    numInput,
    setNumInput,
    isNumComplement,
    setIsNumComplement,
    includesCommaNumInput,
    setIncludesCommaNumInput,
    errorMsgs,
  } = useContext(NumSysFormContext);
  const numInputErrorMsg = errorMsgs.numInput;

  useEffect(() => {
    if (numContainerRef.current && numInputErrorMsg)
      numContainerRef.current.focus();
  }, [numInputErrorMsg, submitted]);

  useLayoutEffect(() => {
    setIncludesCommaNumInput(numInput.includes(",") || numInput.includes("."));
    setNumInput(controller.getVerifiedNum(numInput, includesCommaNumInput));
  }, [
    controller,
    includesCommaNumInput,
    numInput,
    setIncludesCommaNumInput,
    setNumInput,
  ]);

  return (
    <>
      <div
        className={styles.numContainer}
        aria-invalid={submitted ? (numInputErrorMsg ? true : false) : undefined}
      >
        <div className={styles.numWrapper}>
          <InputInformation
            origin="Entrada do Número"
            content="O número deve respeitar a regra de N-1 (sendo N a base) símbolos. A entrada aceita número com virgulas."
          >
            <label htmlFor="numInput">
              Digite o número na respectiva base:{" "}
            </label>
          </InputInformation>
          <input
            ref={(input) => (numContainerRef.current = input)}
            type="text"
            id="numInput"
            name="numInput"
            value={numInput}
            onChange={(event) => setNumInput(event.target.value)}
            aria-invalid={
              submitted
                ? numInputErrorMsg
                  ? true
                  : submittedWithSuccess
                  ? false
                  : undefined
                : undefined
            }
            aria-errormessage="numContainerError"
          />
        </div>
        <span>
          <InputInformation
            origin="Caixa de Seleção se é Complemento"
            content={
              baseInput === 2
                ? "Se marcada, deve entrar com um número com o bit de maior magnitude 1. Caso não esteja marcada, será positivo independente do bit de maior magnitude."
                : "Se marcada, o número será considerado negativo. Não digite '-' na entrada do número."
            }
          >
            <label htmlFor="isNumComplement">É complemento?</label>
          </InputInformation>
          <input
            type="checkbox"
            name="isNumComplement"
            id="isNumComplement"
            checked={isNumComplement}
            onChange={(event) => setIsNumComplement(event.target.checked)}
          />
        </span>
      </div>
      <span id="numContainerError" className="--error-msg" tabIndex={0}>
        {numInputErrorMsg}
      </span>
    </>
  );
}
