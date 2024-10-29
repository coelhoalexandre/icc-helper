import { useContext, useLayoutEffect, useState } from "react";
import { ControllerContext } from "../../context/ControllerContext";

export default function NumberingSystemSection() {
  const { controller } = useContext(ControllerContext);
  const [baseInput, setBaseInput] = useState("2");
  const [numInput, setNumInput] = useState("");
  const getNumInputPattern = () => controller.getNumInputPattern(baseInput);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.render(baseInput, numInput);
  };

  useLayoutEffect(() => {
    setNumInput(numInput.toUpperCase());
  }, [numInput]);

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
          onChange={(event) => setBaseInput(event.target.value)}
        />
        <label htmlFor="numInput">Digite o número na respectiva base: </label>
        <input
          type="text"
          id="numInput"
          name="numInput"
          required
          pattern={getNumInputPattern()}
          value={numInput}
          onChange={(event) => setNumInput(event.target.value)}
        />
        <button type="submit">Converter</button>
      </form>
    </>
  );
}
