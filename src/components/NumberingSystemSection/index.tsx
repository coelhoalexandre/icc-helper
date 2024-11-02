import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ControllerContext } from "../../context/ControllerContext";

export default function NumberingSystemSection() {
  const { controller } = useContext(ControllerContext);
  const [baseInput, setBaseInput] = useState(2);
  const [numInput, setNumInput] = useState("");
  const [maxDecimalPlaces, setMaxDecimalPlaces] = useState<
    number | undefined
  >();
  const [includesCommaNumInput, setIncludesCommaNumInput] = useState(false);
  const getNumInputPattern = () => controller.getNumInputPattern(baseInput);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (numInput.at(numInput.length - 1) === ",") setNumInput(numInput + 0);
    controller.renderNumSysView(baseInput, numInput, maxDecimalPlaces);
  };

  useLayoutEffect(() => {
    setIncludesCommaNumInput(numInput.includes(",") || numInput.includes("."));
    setNumInput(controller.getVerifiedNum(numInput, includesCommaNumInput));
  }, [numInput, includesCommaNumInput, controller]);

  useEffect(() => {
    if (includesCommaNumInput) setMaxDecimalPlaces(4);
    else setMaxDecimalPlaces(undefined);
  }, [includesCommaNumInput]);
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

        <button type="submit">Converter</button>
      </form>
    </>
  );
}
