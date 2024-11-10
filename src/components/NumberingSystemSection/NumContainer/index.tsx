import { useContext, useLayoutEffect } from "react";
import styles from "./NumContainer.module.css";
import { NumSysFormContext } from "../../../context/NumSysFormContext";
import { ControllerContext } from "../../../context/ControllerContext";

export default function NumContainer() {
  const { controller } = useContext(ControllerContext);
  const {
    submitted,
    numInput,
    setNumInput,
    isNumComplement,
    setIsNumComplement,
    includesCommaNumInput,
    setIncludesCommaNumInput,
    errorMsgs,
  } = useContext(NumSysFormContext);
  const numInputErrorMsg = errorMsgs.numInput;

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
          <label htmlFor="numInput">Digite o número na respectiva base: </label>
          <input
            type="text"
            id="numInput"
            name="numInput"
            value={numInput}
            onChange={(event) => setNumInput(event.target.value)}
            aria-invalid={
              submitted ? (numInputErrorMsg ? true : false) : undefined
            }
            aria-errormessage="numContainerError"
          />
        </div>
        <span>
          <label htmlFor="isNumComplement">É complemento?</label>
          <input
            type="checkbox"
            name="isNumComplement"
            id="isNumComplement"
            checked={isNumComplement}
            onChange={(event) => setIsNumComplement(event.target.checked)}
          />
        </span>
      </div>
      <span id="numContainerError" className="--error-msg">
        {numInputErrorMsg}
      </span>
    </>
  );
}
