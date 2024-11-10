import { useContext, useEffect } from "react";
import styles from "./MethodsDisplayFieldset.module.css";
import { NumSysFormContext } from "../../../context/NumSysFormContext";
import { NumberingSystemsMethods } from "../../../enums/NumberingSystemsMethods";
import MethodInput from "./MethodInput";

const numberingSystemsMethodsEntries = Object.entries(NumberingSystemsMethods);

export interface MethodItem {
  name: string;
  method: NumberingSystemsMethods;
  label: string;
}

export default function MethodsDisplayFieldset() {
  const {
    submitted,
    methodsDisplay,
    setMethodsDisplay,
    isAllMethods,
    setIsAllMethods,
    errorMsgs,
  } = useContext(NumSysFormContext);
  const methodsDisplayErrorMsg = errorMsgs.methodsDisplay;
  const methodsLabels = ["TFN", "Agregação", "Desagregação", "Inverso da TFN"];
  const methodsList: MethodItem[] = numberingSystemsMethodsEntries.map(
    (numberingSystemsMethodsEntry, index) => ({
      name: `${numberingSystemsMethodsEntry[0]}_METHOD`,
      method: numberingSystemsMethodsEntry[1],
      label: methodsLabels[index],
    })
  );

  const onChangeAllMethods = (isChecked: boolean) => {
    setMethodsDisplay((methods) =>
      methods.map((method) => {
        method[1] = isChecked;
        return method;
      })
    );
  };

  useEffect(() => {
    let isAllMethods = true;
    for (let i = 0; i < methodsDisplay.length; i++)
      if (!methodsDisplay[i][1]) {
        isAllMethods = false;
        break;
      }
    setIsAllMethods(isAllMethods);
  }, [methodsDisplay, setIsAllMethods]);

  return (
    <>
      <fieldset
        className={styles.fieldset}
        aria-invalid={
          submitted ? (methodsDisplayErrorMsg ? true : false) : undefined
        }
        aria-errormessage="methodsDisplayError"
      >
        <legend>Selecione qual(is) método(s) deseja exibir: </legend>
        <div className={styles.methodInput}>
          <input
            type="checkbox"
            name="allMethods"
            id="allMethods"
            defaultChecked
            checked={isAllMethods}
            onChange={(event) => onChangeAllMethods(event.target.checked)}
          />
          <label htmlFor="allMethods">Todos os Métodos</label>
        </div>
        <ul className={styles.methodsContainer}>
          {methodsList.map((methodItem) => (
            <li className={styles.methodInput}>
              {<MethodInput methodItem={methodItem} />}
            </li>
          ))}
        </ul>
      </fieldset>
      <span id="methodDisplayError" className="--error-msg" tabIndex={0}>
        {methodsDisplayErrorMsg}
      </span>
    </>
  );
}
