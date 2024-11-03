import { useContext, useState } from "react";
import styles from "../BinaryArithmeticSection.module.css";
import { ControllerContext } from "../../../context/ControllerContext";
import ArchitectureSize from "../../../types/ArchitectureSize";

interface InputNumberProps {
  id: string;
  children: React.ReactNode;
  num: string;
  setNum: (value: React.SetStateAction<string>) => void;
  isComplement: boolean;
  setIsComplement: (value: React.SetStateAction<boolean>) => void;
  architectureSize: ArchitectureSize;
}

export default function InputNumber({
  id,
  children,
  num,
  setNum,
  isComplement,
  setIsComplement,
  architectureSize,
}: InputNumberProps) {
  const { controller } = useContext(ControllerContext);
  const [keyDown, setKeyDown] = useState("");

  const checkNum = (inputNum: string) => {
    const includesCommaNumInput =
      inputNum.includes(",") || inputNum.includes(".");

    const verifiedNum = controller.getVerifiedNum(
      inputNum,
      includesCommaNumInput
    );

    if (keyDown !== "Backspace") {
      if (includesCommaNumInput && architectureSize.fractionalPart <= 0)
        throw new Error("There is no fractional part for this number");

      const numParts = controller.getIntegerFractionalParts(verifiedNum);

      if (numParts.integerPart.length > architectureSize.integerPart)
        throw new Error(
          "The integer part cannot be larger than the space reserved for it"
        );

      if (
        numParts.fractionalPart &&
        numParts.fractionalPart.length > architectureSize.fractionalPart
      )
        throw new Error(
          "The fractional part cannot be larger than the space reserved for it"
        );
    }

    setNum(verifiedNum);
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <label htmlFor={id}>{children}</label>
        <input
          type="text"
          name={id}
          id="primeiroNum"
          pattern={controller.getNumInputPattern(2)}
          required
          value={num}
          onChange={(e) => checkNum(e.target.value)}
          onKeyDown={(e) => setKeyDown(e.code)}
        />
      </div>
      <span>
        <label htmlFor={`is${id}Complement`}>É complemento?</label>
        <input
          type="checkbox"
          name={`is${id}Complement`}
          id={`is${id}Complement`}
          checked={isComplement}
          onChange={(event) => setIsComplement(event.target.checked)}
        />
      </span>
    </div>
  );
}
