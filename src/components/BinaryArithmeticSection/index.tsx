import styles from "./BinaryArithmeticSection.module.css";
import { useCallback, useContext, useLayoutEffect, useState } from "react";
import { OperationsValues } from "../../enums/OperationsValues";
import { ControllerContext } from "../../context/ControllerContext";
import { ArchitecturesForNumberParts } from "../../enums/ArchitecturesForNumberParts";

export default function BinaryArithmeticSection() {
  const { controller } = useContext(ControllerContext);
  const operations = controller.getOperations();
  const architecturesForNumberPart = controller.getArchitecturesForNumberPart();

  const [architecturalSizeInput, setArchitecturalSizeInput] = useState(1);
  const [
    architecturesForNumberPartsInput,
    setArchitecturesForNumberPartsInput,
  ] = useState(ArchitecturesForNumberParts.INT);
  const [isPartQuantInputDisabled, setIsPartQuantInputDisabled] =
    useState(true);
  const [integerPartQuantInput, setIntegerPartQuantInput] = useState(1);
  const [fractionalPartQuantInput, setFractionalPartQuantInput] = useState(0);
  const [operationSelector, setOperationSelector] = useState(
    OperationsValues.ADD
  );
  const [num1Input, setNum1Input] = useState("");
  const [num2Input, setNum2Input] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (num1Input.at(num1Input.length - 1) === ",") setNum1Input(num1Input + 0);
    if (num2Input.at(num2Input.length - 1) === ",") setNum2Input(num2Input + 0);
    controller.renderBinArithView(
      {
        total: architecturalSizeInput,
        integerPart: integerPartQuantInput,
        fractionalPart: fractionalPartQuantInput,
      },
      operationSelector,
      num1Input,
      num2Input
    );
  };

  const checkPartsQuant = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: "ArchitecturalSize" | "IntegerPart" | "FractionalPart"
  ) => {
    const value = Number(event.target.value);
    const difference = architecturalSizeInput - value;

    const checkPart = (
      partToBeChecked: number,
      setPartToBeChecked: (value: React.SetStateAction<number>) => void,
      setPartToBeMutated: (value: React.SetStateAction<number>) => void
    ) => {
      if (
        (id === "IntegerPart" && difference >= 0) ||
        (id === "FractionalPart" && difference > 0)
      ) {
        if (partToBeChecked > value) setPartToBeMutated(difference);
        else setPartToBeMutated(difference);
        setPartToBeChecked(value);
      }
    };

    let integerPartQuant = integerPartQuantInput;
    let fractionalPartQuant = fractionalPartQuantInput;
    switch (id) {
      case "ArchitecturalSize":
        if (difference < 0)
          for (let i = difference; i < 0; i++) {
            if (fractionalPartQuant < integerPartQuant) fractionalPartQuant++;
            else integerPartQuant++;
          }
        else
          for (let i = difference; i > 0; i--) {
            if (fractionalPartQuant > integerPartQuant) fractionalPartQuant--;
            else integerPartQuant--;
          }

        if (integerPartQuant === 0) {
          integerPartQuant++;
          fractionalPartQuant--;
        }

        setArchitecturalSizeInput(value);
        setIntegerPartQuantInput(integerPartQuant);
        setFractionalPartQuantInput(fractionalPartQuant);
        break;
      case "IntegerPart":
        checkPart(
          integerPartQuantInput,

          setIntegerPartQuantInput,
          setFractionalPartQuantInput
        );
        break;
      case "FractionalPart":
        checkPart(
          fractionalPartQuantInput,
          setFractionalPartQuantInput,
          setIntegerPartQuantInput
        );
        break;
    }
  };

  const checkNum = (num: string, id: "Num1" | "Num2") => {
    const includesCommaNumInput = num.includes(",") || num.includes(".");
    const verifiedNum = controller.getVerifiedNum(num, includesCommaNumInput);

    if (includesCommaNumInput && !fractionalPartQuantInput)
      throw new Error("There is no fractional part for this number");

    const numParts = controller.getIntegerFractionalParts(verifiedNum);

    if (numParts.integerPart.length > integerPartQuantInput)
      throw new Error(
        "The integer part cannot be larger than the space reserved for it"
      );

    if (
      numParts.fractionalPart &&
      numParts.fractionalPart.length > integerPartQuantInput
    )
      throw new Error(
        "The fractional part cannot be larger than the space reserved for it"
      );

    switch (id) {
      case "Num1":
        setNum1Input(verifiedNum);
        break;
      case "Num2":
        setNum2Input(verifiedNum);
        break;
      default:
        throw new Error("Id not found ");
    }
  };

  const getPartsQuant = useCallback(
    (integerMultiplier: number, fractionalMultiplier: number) => {
      const integerPartQuant = Math.ceil(
        architecturalSizeInput * integerMultiplier
      );
      const fractionalPartQuant = Math.floor(
        architecturalSizeInput * fractionalMultiplier
      );

      return { integerPartQuant, fractionalPartQuant };
    },
    [architecturalSizeInput]
  );

  useLayoutEffect(() => {
    setIsPartQuantInputDisabled(true);

    let parts: { integerPartQuant: number; fractionalPartQuant: number };

    switch (architecturesForNumberPartsInput) {
      case ArchitecturesForNumberParts.INT:
        setIntegerPartQuantInput(architecturalSizeInput);
        setFractionalPartQuantInput(0);
        break;

      case ArchitecturesForNumberParts.FLOAT_20:
        parts = getPartsQuant(0.8, 0.2);
        setIntegerPartQuantInput(parts.integerPartQuant);
        setFractionalPartQuantInput(parts.fractionalPartQuant);
        break;

      case ArchitecturesForNumberParts.FLOAT_40:
        parts = getPartsQuant(0.6, 0.4);
        setIntegerPartQuantInput(parts.integerPartQuant);
        setFractionalPartQuantInput(parts.fractionalPartQuant);
        break;

      case ArchitecturesForNumberParts.FLOAT_50:
        parts = getPartsQuant(0.5, 0.5);
        setIntegerPartQuantInput(parts.integerPartQuant);
        setFractionalPartQuantInput(parts.fractionalPartQuant);
        break;

      case ArchitecturesForNumberParts.FLOAT_60:
        parts = getPartsQuant(0.4, 0.6);
        setIntegerPartQuantInput(parts.integerPartQuant);
        setFractionalPartQuantInput(parts.fractionalPartQuant);
        break;

      case ArchitecturesForNumberParts.FLOAT_80:
        parts = getPartsQuant(0.2, 0.8);
        setIntegerPartQuantInput(parts.integerPartQuant);
        setFractionalPartQuantInput(parts.fractionalPartQuant);
        break;

      case ArchitecturesForNumberParts.MANUAL:
        setIsPartQuantInputDisabled(false);

        break;

      default:
        throw new Error("Architecture for Number Parts not found");
    }
  }, [architecturesForNumberPartsInput, architecturalSizeInput, getPartsQuant]);

  return (
    <>
      <h2>Aritmética Binária</h2>
      <form onSubmit={onSubmit} className={styles.binaryArithmeticForm}>
        <label htmlFor="architecturalSizeInput">
          Diga o tamanho da arquitetura:
        </label>
        <input
          type="number"
          id="architecturalSizeInput"
          name="architecturalSizeInput"
          min={1}
          required
          value={architecturalSizeInput}
          onChange={(event) => checkPartsQuant(event, "ArchitecturalSize")}
        />
        <fieldset className={styles.fieldsetParts}>
          <legend>Selecione a quantidade de bits para as partes: </legend>

          <select
            defaultValue={ArchitecturesForNumberParts.INT}
            onChange={(e) =>
              setArchitecturesForNumberPartsInput(
                e.target.value as ArchitecturesForNumberParts
              )
            }
          >
            {architecturesForNumberPart.map((architectureForNumberPart) => (
              <option
                key={architectureForNumberPart}
                value={architectureForNumberPart}
              >
                {architectureForNumberPart}
              </option>
            ))}
          </select>

          <div
            className={`${styles.wrapper} ${
              isPartQuantInputDisabled ? styles.wrapperDisabled : ""
            }`}
          >
            <label htmlFor="integerPartQuantInput">Inteira: </label>
            <input
              type="number"
              id="integerPartQuantInput"
              name="integerPartQuantInput"
              min={1}
              defaultValue={1}
              required
              disabled={isPartQuantInputDisabled}
              value={integerPartQuantInput}
              onChange={(event) => checkPartsQuant(event, "IntegerPart")}
            />
            <label htmlFor="fractionalPartQuantInput">Fracionária: </label>
            <input
              type="number"
              id="fractionalPartQuantInput"
              name="fractionalPartQuantInput"
              min={0}
              defaultValue={0}
              required
              disabled={isPartQuantInputDisabled}
              value={fractionalPartQuantInput}
              onChange={(event) => checkPartsQuant(event, "FractionalPart")}
            />
          </div>
        </fieldset>
        <label htmlFor="operationSelector">Selecione o a operação</label>
        <select
          name="operationSelector"
          id="operationSelector"
          required
          value={operationSelector}
          defaultValue={OperationsValues.ADD}
          onChange={(e) =>
            setOperationSelector(e.target.value as OperationsValues)
          }
        >
          {operations.map((operation) => (
            <option
              key={operation}
              value={operation}
              disabled={operation === OperationsValues.ADD ? false : true}
            >
              {operation}
            </option>
          ))}
        </select>

        <fieldset>
          <legend>
            Digite os números em binário, sem passar o tamanho da arquitetura.
          </legend>
          <label htmlFor="primeiroNum">Primeiro Número: </label>
          <input
            type="text"
            name="primeiroNum"
            id="primeiroNum"
            pattern={controller.getNumInputPattern(2)}
            required
            value={num1Input}
            onChange={(e) => checkNum(e.target.value, "Num1")}
          />
          <label htmlFor="segundoNum">Segundo Número: </label>
          <input
            type="text"
            name="segundoNum"
            id="segundoNum"
            pattern={controller.getNumInputPattern(2)}
            required
            value={num2Input}
            onChange={(e) => checkNum(e.target.value, "Num2")}
          />
        </fieldset>
        <button type="submit">Calcular</button>
      </form>
    </>
  );
}
