import { useContext, useEffect, useRef } from "react";
import { OperationsValues } from "../../../enums/OperationsValues";
import { ControllerContext } from "../../../context/ControllerContext";
import { BinArithFormContext } from "../../../context/BinArithFormContext";

export default function OperationSelector() {
  const operationSelectorRef = useRef<HTMLSelectElement | null>(null);
  const { controller } = useContext(ControllerContext);
  const {
    submitted,
    submittedWithSuccess,
    operationSelector,
    setOperationSelector,
    isNumInputModified,
    errorMsgs,
  } = useContext(BinArithFormContext);
  const operations = controller.getOperations();
  const operationSelectorErrorMsg = errorMsgs.operationSelector;

  useEffect(() => {
    if (operationSelectorRef.current && operationSelectorErrorMsg)
      operationSelectorRef.current.focus();
  }, [operationSelectorErrorMsg, submitted]);

  return (
    <>
      <label htmlFor="operationSelector">Selecione o a operação</label>
      <select
        ref={(select) => (operationSelectorRef.current = select)}
        name="operationSelector"
        id="operationSelector"
        required
        value={operationSelector}
        defaultValue={OperationsValues.ADD}
        onChange={(e) =>
          setOperationSelector(e.target.value as OperationsValues)
        }
        aria-invalid={
          submitted
            ? operationSelectorErrorMsg
              ? true
              : submittedWithSuccess
              ? false
              : undefined
            : undefined
        }
        aria-errormessage="operationSelectorError"
      >
        {operations.map((operation) => (
          <option
            key={operation}
            value={operation}
            disabled={
              isNumInputModified &&
              (operation === OperationsValues.MUL ||
                operation === OperationsValues.DIV)
                ? true
                : false
            }
          >
            {operation}
          </option>
        ))}
      </select>
      <span id="operationSelectorError" className="--error-msg" tabIndex={0}>
        {operationSelectorErrorMsg}
      </span>
    </>
  );
}
