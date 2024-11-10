import { useContext, useEffect, useLayoutEffect } from "react";
import { ControllerContext } from "../../../context/ControllerContext";
import { NumSysFormContext } from "../../../context/NumSysFormContext";

export default function MaxDecimalPlacesInput() {
  const { controller } = useContext(ControllerContext);
  const {
    submitted,
    baseInput,
    includesCommaNumInput,
    maxDecimalPlaces,
    setMaxDecimalPlaces,
    errorMsgs,
  } = useContext(NumSysFormContext);
  const maxDecimalPlacesErrorMsg = errorMsgs.maxDecimalPlaces;

  useEffect(() => {
    if (includesCommaNumInput) setMaxDecimalPlaces(4);
    else setMaxDecimalPlaces(undefined);
  }, [includesCommaNumInput, setMaxDecimalPlaces]);

  useLayoutEffect(() => {
    if (typeof maxDecimalPlaces === "number" && maxDecimalPlaces < 1)
      setMaxDecimalPlaces(1);
  }, [maxDecimalPlaces, setMaxDecimalPlaces]);

  return (
    <>
      {controller.isNeedMaxNumDecPlaces(baseInput) && includesCommaNumInput ? (
        <>
          <label htmlFor="maxDecimalPlaces">
            Digite o número máximo de casas decimais:{" "}
          </label>
          <input
            type="number"
            id="maxDecimalPlaces"
            name="maxDecimalPlaces"
            required
            defaultValue={4}
            value={maxDecimalPlaces}
            onChange={(event) =>
              setMaxDecimalPlaces(Number(event.target.value))
            }
            aria-invalid={
              submitted ? (maxDecimalPlaces ? true : false) : undefined
            }
            aria-errormessage="maxDecimalError"
          />
        </>
      ) : (
        ""
      )}
      <span id="maxDecimalError" className="--error-msg" tabIndex={0}>
        {maxDecimalPlacesErrorMsg}
      </span>
    </>
  );
}
