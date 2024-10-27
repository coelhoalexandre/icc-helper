import { useState } from "react";

export default function NumberingSystemSection() {
  const [baseInput, setBaseInput] = useState("2");
  const [numInput, setNumInput] = useState("");

  return (
    <>
      <h2>Sistemas de Numeração</h2>
      <form>
        <label htmlFor="baseInput">Digite a base: </label>
        <input
          type="number"
          id="baseInput"
          name="baseInput"
          min={2}
          defaultValue={2}
          value={baseInput}
          onChange={(event) => setBaseInput(event.target.value)}
        />
        <label htmlFor="numInput">Digite o numero na respectiva base: </label>
        <input
          type="text"
          id="numInput"
          name="numInput"
          value={numInput}
          onChange={(event) => setNumInput(event.target.value)}
        />
        <button type="submit">Converter</button>
      </form>
    </>
  );
}
