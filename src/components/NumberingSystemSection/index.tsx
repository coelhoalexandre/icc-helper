import styles from "./NumberingSystemSection.module.css";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ControllerContext } from "../../context/ControllerContext";
import { MethodsDisplay } from "../../types/INumberingSystemsMethod/MethodsDisplay";
import { NumberingSystemsMethods } from "../../enums/NumberingSystemsMethods";

export default function NumberingSystemSection() {
  const { controller } = useContext(ControllerContext);
  const [baseInput, setBaseInput] = useState(2);
  const [numInput, setNumInput] = useState("");
  const [maxDecimalPlaces, setMaxDecimalPlaces] = useState<
    number | undefined
  >();
  const [includesCommaNumInput, setIncludesCommaNumInput] = useState(false);
  const [isNumComplement, setIsNumComplement] = useState(false);
  const [methodsDisplay, setMethodsDisplay] = useState<MethodsDisplay>([
    [NumberingSystemsMethods.TFN, true],
    [NumberingSystemsMethods.AGGREGATION, true],
    [NumberingSystemsMethods.DISAGGREGATION, true],
    [NumberingSystemsMethods.INVERSE_TFN, true],
  ]);
  const [isAllMethods, setIsAllMethods] = useState(true);
  const getNumInputPattern = () => controller.getNumInputPattern(baseInput);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isNumComplement && baseInput === 2 && numInput[0] === "0")
      throw new Error(
        "A negative number in base 2 must have the bit with the highest magnitude 1"
      );
    if (numInput.at(numInput.length - 1) === ",") setNumInput(numInput + 0);
    controller.renderNumSysView({
      baseInput,
      numInput,
      maxDecimalPlaces,
      isNumComplement,
      methodsDisplay,
    });
  };

  const onChangeAllMethods = (isChecked: boolean) => {
    setMethodsDisplay((methods) =>
      methods.map((method) => {
        method[1] = isChecked;
        return method;
      })
    );
  };

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

  useLayoutEffect(() => {
    setIncludesCommaNumInput(numInput.includes(",") || numInput.includes("."));
    setNumInput(controller.getVerifiedNum(numInput, includesCommaNumInput));
  }, [numInput, includesCommaNumInput, controller]);

  useEffect(() => {
    if (includesCommaNumInput) setMaxDecimalPlaces(4);
    else setMaxDecimalPlaces(undefined);
  }, [includesCommaNumInput]);

  useEffect(() => {
    let isAllMethods = true;

    for (let i = 0; i < methodsDisplay.length; i++)
      if (!methodsDisplay[i][1]) {
        isAllMethods = false;
        break;
      }

    setIsAllMethods(isAllMethods);
  }, [methodsDisplay]);

  return (
    <>
      <h2>Sistemas de Numeração</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="baseInput">Digite a base:</label>
        <input
          type="number"
          id="baseInput"
          name="baseInput"
          min={2}
          max={36}
          defaultValue={2}
          required
          value={baseInput}
          onChange={(event) => setBaseInput(Number(event.target.value))}
        />

        <div className={styles.numContainer}>
          <div className={styles.numWrapper}>
            <label htmlFor="numInput">
              Digite o número na respectiva base:{" "}
            </label>
            <input
              type="text"
              id="numInput"
              name="numInput"
              required
              pattern={getNumInputPattern()}
              value={numInput}
              onChange={(event) => setNumInput(event.target.value)}
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

        {controller.isNeedMaxNumDecPlaces(baseInput) &&
        includesCommaNumInput ? (
          <>
            <label htmlFor="maxDecimalPlaces">
              Digite o número máximo de casas decimais:{" "}
            </label>
            <input
              type="number"
              id="maxDecimalPlaces"
              name="maxDecimalPlaces"
              required
              min={1}
              defaultValue={4}
              value={maxDecimalPlaces}
              onChange={(event) =>
                setMaxDecimalPlaces(Number(event.target.value))
              }
            />
          </>
        ) : (
          ""
        )}
        <fieldset className={styles.fieldset}>
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
          <div className={styles.methodsContainer}>
            <div className={styles.methodInput}>
              <input
                type="checkbox"
                name="tfnMethod"
                id="tfnMethod"
                disabled={getIsMethodDisabled(NumberingSystemsMethods.TFN)}
                defaultChecked
                checked={getCheckedMethod(NumberingSystemsMethods.TFN)[1]}
                onChange={(event) =>
                  onChangeOneMethod(
                    NumberingSystemsMethods.TFN,
                    event.target.checked
                  )
                }
              />
              <label
                htmlFor="tfnMethod"
                className={
                  getIsMethodDisabled(NumberingSystemsMethods.TFN)
                    ? styles.isDisabled
                    : ""
                }
              >
                TFN
              </label>
            </div>
            <div className={styles.methodInput}>
              <input
                type="checkbox"
                name="aggregationMethod"
                id="aggregationMethod"
                disabled={getIsMethodDisabled(
                  NumberingSystemsMethods.AGGREGATION
                )}
                defaultChecked
                checked={
                  getCheckedMethod(NumberingSystemsMethods.AGGREGATION)[1]
                }
                onChange={(event) =>
                  onChangeOneMethod(
                    NumberingSystemsMethods.AGGREGATION,
                    event.target.checked
                  )
                }
              />
              <label
                htmlFor="aggregationMethod"
                className={
                  getIsMethodDisabled(NumberingSystemsMethods.AGGREGATION)
                    ? styles.isDisabled
                    : ""
                }
              >
                {" "}
                Agregação
              </label>
            </div>
            <div className={styles.methodInput}>
              <input
                type="checkbox"
                name="disaggregationMethod"
                id="disaggregationMethod"
                disabled={getIsMethodDisabled(
                  NumberingSystemsMethods.DISAGGREGATION
                )}
                defaultChecked
                checked={
                  getCheckedMethod(NumberingSystemsMethods.DISAGGREGATION)[1]
                }
                onChange={(event) =>
                  onChangeOneMethod(
                    NumberingSystemsMethods.DISAGGREGATION,
                    event.target.checked
                  )
                }
              />
              <label
                htmlFor="disaggregationMethod"
                className={
                  getIsMethodDisabled(NumberingSystemsMethods.DISAGGREGATION)
                    ? styles.isDisabled
                    : ""
                }
              >
                Desagregação
              </label>
            </div>
            <div className={styles.methodInput}>
              <input
                type="checkbox"
                name="inverseTFNMethod"
                id="inverseTFNMethod"
                disabled={getIsMethodDisabled(
                  NumberingSystemsMethods.INVERSE_TFN
                )}
                defaultChecked
                checked={
                  getCheckedMethod(NumberingSystemsMethods.INVERSE_TFN)[1]
                }
                onChange={(event) =>
                  onChangeOneMethod(
                    NumberingSystemsMethods.INVERSE_TFN,
                    event.target.checked
                  )
                }
              />
              <label
                htmlFor="inverseTFNMethod"
                className={
                  getIsMethodDisabled(NumberingSystemsMethods.INVERSE_TFN)
                    ? styles.isDisabled
                    : ""
                }
              >
                Inverso da TFN
              </label>
            </div>
          </div>
        </fieldset>
        <button type="submit">Converter</button>
      </form>
    </>
  );
}
