import styles from "./BinaryArithmeticSection.module.css";
import { useContext, useLayoutEffect, useState } from "react";
import { OperationsValues } from "../../enums/OperationsValues";
import { ControllerContext } from "../../context/ControllerContext";

export default function BinaryArithmeticSection() {
  const { controller } = useContext(ControllerContext);
  const operations = [
    {
      id: OperationsValues.SUM,
      text: "Soma (+)",
    },
    {
      id: OperationsValues.SUBTRACTION,
      text: "Subtração (-)",
    },
    {
      id: OperationsValues.MULTIPLICATION,
      text: "Multiplicação (x)",
    },
    {
      id: OperationsValues.DIVISION,
      text: "Divisão (%)",
    },
  ];

  const [architecturalSizeInput, setArchitecturalSizeInput] = useState(1);
  const [integerPartQuantInput, setIntegerPartQuantInput] = useState(1);
  const [fractionalPartQuantInput, setFractionalPartQuantInput] = useState(0);
  const [operationSelector, setOperationSelector] = useState(
    OperationsValues.SUM
  );
  const [num1Input, setNum1Input] = useState("");
  const [num2Input, setNum2Input] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.renderBinArithView(
      architecturalSizeInput,
      operationSelector,
      num1Input,
      num2Input
    );
  };

  useLayoutEffect(() => {
    if (num1Input.length > architecturalSizeInput)
      setNum1Input(num1Input.slice(-1));
    if (num2Input.length > architecturalSizeInput)
      setNum2Input(num2Input.slice(-1));
  }, [num1Input, num2Input, architecturalSizeInput]);
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
          onChange={(e) => setArchitecturalSizeInput(Number(e.target.value))}
        />
        <fieldset className={styles.fieldsetParts}>
          <legend>Digite a quantidade de bits para a parte.</legend>
          <span>
            <label htmlFor="integerPartQuantInput">Inteira: </label>
            <input
              type="number"
              id="integerPartQuantInput"
              name="integerPartQuantInput"
              min={1}
              defaultValue={1}
              required
              value={integerPartQuantInput}
              onChange={(event) =>
                setIntegerPartQuantInput(Number(event.target.value))
              }
            />
          </span>
          <span>
            <label htmlFor="fractionalPartQuantInput">Fracionária: </label>
            <input
              type="number"
              id="fractionalPartQuantInput"
              name="fractionalPartQuantInput"
              min={0}
              defaultValue={0}
              required
              value={fractionalPartQuantInput}
              onChange={(event) =>
                setFractionalPartQuantInput(Number(event.target.value))
              }
            />
          </span>
        </fieldset>
        <label htmlFor="operationSelector">Selecione o a operação</label>
        <select
          name="operationSelector"
          id="operationSelector"
          required
          value={operationSelector}
          defaultValue={OperationsValues.SUM}
          onChange={(e) =>
            setOperationSelector(e.target.value as OperationsValues)
          }
        >
          {operations.map((operation) => (
            <option
              key={operation.id}
              value={operation.id}
              disabled={operation.id === OperationsValues.SUM ? false : true}
            >
              {operation.text}
            </option>
          ))}
        </select>

        <fieldset>
          <legend>
            Digite os números em binário, respeitando o tamanho da arquitetura.
          </legend>
          <label htmlFor="primeiroNum">Primeiro Número: </label>
          <input
            type="text"
            name="primeiroNum"
            id="primeiroNum"
            pattern={controller.getNumInputPattern(2)}
            required
            value={num1Input}
            onChange={(e) => setNum1Input(e.target.value)}
          />
          <label htmlFor="segundoNum">Segundo Número: </label>
          <input
            type="text"
            name="segundoNum"
            id="segundoNum"
            pattern={controller.getNumInputPattern(2)}
            required
            value={num2Input}
            onChange={(e) => setNum2Input(e.target.value)}
          />
        </fieldset>
        <button type="submit">Calcular</button>
      </form>
    </>
  );
}
