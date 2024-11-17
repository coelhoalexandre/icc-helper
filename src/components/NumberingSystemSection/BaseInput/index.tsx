import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { NumSysFormContext } from "../../../context/NumSysFormContext";
import InputInformation from "../../InputInformation";

export default function BaseInput() {
  const baseInputRef = useRef<HTMLInputElement | null>(null);
  const {
    submitted,
    submittedWithSuccess,
    baseInput,
    setBaseInput,
    errorMsgs,
  } = useContext(NumSysFormContext);
  const baseErrorMsg = errorMsgs.base;

  useEffect(() => {
    if (baseInputRef.current && baseErrorMsg) baseInputRef.current.focus();
  }, [baseErrorMsg, submitted]);

  useLayoutEffect(() => {
    if (baseInput < 2) setBaseInput(1);
    if (baseInput > 36) setBaseInput(36);
  }, [baseInput, setBaseInput]);
  return (
    <>
      <InputInformation
        origin="a Base do número"
        content="A base deve ser no mínimo 2 e máximo 36."
      >
        <label htmlFor="baseInput">Digite a base:</label>
      </InputInformation>
      <input
        ref={(input) => (baseInputRef.current = input)}
        type="number"
        id="baseInput"
        name="baseInput"
        defaultValue={2}
        required
        value={baseInput}
        onChange={(event) => setBaseInput(Number(event.target.value))}
        aria-invalid={
          submitted
            ? baseErrorMsg
              ? true
              : submittedWithSuccess
              ? false
              : undefined
            : undefined
        }
        aria-errormessage="baseInputError"
      />
      <span id="baseInputError" className="--error-msg" tabIndex={0}>
        {baseErrorMsg}
      </span>
    </>
  );
}
