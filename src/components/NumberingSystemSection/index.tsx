import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ControllerContext } from "../../context/ControllerContext";

export default function NumberingSystemSection() {
  const { controller } = useContext(ControllerContext);
  const [baseInput, setBaseInput] = useState(2);
  const [numInput, setNumInput] = useState("");
  const [maxDecimalPlaces, setMaxDecimalPlaces] = useState<
    number | undefined
  >();
  const [includesCommaNumInput, setincludesCommaNumInput] = useState(false);
  const getNumInputPattern = () => controller.getNumInputPattern(baseInput);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (numInput.at(numInput.length - 1) === ",") setNumInput(numInput + 0);
    controller.render(baseInput, numInput, maxDecimalPlaces);
  };

  useLayoutEffect(() => {
    const getVerifiedInput = () => {
      setincludesCommaNumInput(
        numInput.includes(",") || numInput.includes(".")
      );

      const numInputUpperCase = numInput.toUpperCase();

      let verifiedInput = numInputUpperCase;

      if (includesCommaNumInput) {
        const numInputNoDot = verifiedInput.replace(".", ",");

        const numInputNoCommaStart = !numInputNoDot.indexOf(",")
          ? numInputNoDot.padStart(verifiedInput.length + 1, "0")
          : numInputNoDot;

        const numInputNoRepeatedCommas = numInputNoCommaStart
          .split("")
          .filter((char, i, arr) => char !== "," || arr.indexOf(char) === i)
          .join("");

        verifiedInput = numInputNoRepeatedCommas;
      }

      return verifiedInput;
    };
    setNumInput(getVerifiedInput());
  }, [numInput, includesCommaNumInput]);

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
