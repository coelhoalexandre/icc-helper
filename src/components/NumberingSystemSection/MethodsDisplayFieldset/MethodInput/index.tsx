import styles from "../MethodsDisplayFieldset.module.css";
import { MethodItem } from "..";
import { useCallback, useContext } from "react";
import { ControllerContext } from "../../../../context/ControllerContext";
import { NumberingSystemsMethods } from "../../../../enums/NumberingSystemsMethods";
import { NumSysFormContext } from "../../../../context/NumSysFormContext";

interface MethodInputProps {
  methodItem: MethodItem;
}

export default function MethodInput({ methodItem }: MethodInputProps) {
  const { controller } = useContext(ControllerContext);
  const { baseInput, methodsDisplay, setMethodsDisplay } =
    useContext(NumSysFormContext);

  const onChangeOneMethod = (
    keyMethod: NumberingSystemsMethods,
    isChecked: boolean
  ) => {
    const currentMethod = getCheckedMethod(keyMethod);
    currentMethod[1] = isChecked;
    const filteredMethods = methodsDisplay.filter(
      (method) => method !== currentMethod
    );
    const updatedMethods = [...filteredMethods, currentMethod];
    setMethodsDisplay(updatedMethods);
  };

  const getCheckedMethod = (keyMethod: NumberingSystemsMethods) => {
    const method = methodsDisplay.find((method) => method[0] === keyMethod);
    if (!method) throw new Error("Method Not Found");
    return method;
  };

  const getIsMethodDisabled = useCallback(
    (keyMethod: NumberingSystemsMethods) => {
      const methodsUsed = controller.getMethodsUsed(baseInput);
      const foundMethod = methodsUsed.find(
        (methodUsed) => keyMethod === methodUsed
      );
      const isMethodDisabled = foundMethod ? false : true;
      return isMethodDisabled;
    },
    [baseInput, controller]
  );

  return (
    <>
      <input
        type="checkbox"
        name={methodItem.name}
        id={methodItem.name}
        disabled={getIsMethodDisabled(methodItem.method)}
        defaultChecked
        checked={getCheckedMethod(methodItem.method)[1]}
        onChange={(event) =>
          onChangeOneMethod(methodItem.method, event.target.checked)
        }
      />
      <label
        htmlFor={methodItem.name}
        className={
          getIsMethodDisabled(methodItem.method) ? styles.isDisabled : ""
        }
      >
        {methodItem.label}
      </label>
    </>
  );
}
