import { useState } from "react";
import { OperationsValues } from "../../enums/OperationsValues";

export default function BinaryArithmeticSection() {
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

  const [architecturalSizeInput, setArchitecturalSizeInput] = useState("1");
  const [operationSelector, setOperationSelector] = useState("");
  const [num1Input, setNum1Input] = useState("");
  const [num2Input, setNum2Input] = useState("");

  return (
    <>
      <h2>Aritmética Binária</h2>
      <form>
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
          onChange={(e) => setArchitecturalSizeInput(e.target.value)}
        />
        <label htmlFor="operationSelector">Selecione o a operação</label>
        <select
          name="operationSelector"
          id="operationSelector"
          required
          value={operationSelector}
          onChange={(e) => setOperationSelector(e.target.value)}
        >
          {operations.map((operation) => (
            <option key={operation.id} value={operation.id}>
              {operation.text}
            </option>
          ))}
        </select>

        <label htmlFor="primeiroNum">
          Digite o primeiro número da entrada em binário
        </label>
        <input
          type="text"
          name="primeiroNum"
          id="primeiroNum"
          required
          value={num1Input}
          onChange={(e) => setNum1Input(e.target.value)}
        />
        <label htmlFor="segundoNum">
          Digite o segundo número da entrada em binário
        </label>
        <input
          type="text"
          name="segundoNum"
          id="segundoNum"
          required
          value={num2Input}
          onChange={(e) => setNum2Input(e.target.value)}
        />
        <button type="submit">Calcular</button>
      </form>
    </>
  );
}
