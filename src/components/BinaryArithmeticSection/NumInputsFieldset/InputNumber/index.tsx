import { useContext, useEffect, useRef, useState } from "react";
import styles from "../../BinaryArithmeticSection.module.css";
import { ControllerContext } from "../../../../context/ControllerContext";
import { BinArithFormContext } from "../../../../context/BinArithFormContext";
import InputInformation from "../../../InputInformation";

interface InputNumberProps {
  id: string;
  children: React.ReactNode;
  num: string;
  setNum: (value: React.SetStateAction<string>) => void;
  isComplement: boolean;
  setIsComplement: (value: React.SetStateAction<boolean>) => void;
  numMsgError: string;
}

export default function InputNumber({
  id,
  children,
  num,
  setNum,
  isComplement,
  setIsComplement,
  numMsgError,
}: InputNumberProps) {
  const numInputRef = useRef<HTMLInputElement | null>(null);
  const { controller } = useContext(ControllerContext);
  const {
    submitted,
    submittedWithSuccess,
    architecturalSize,
    numInputType,
    multiplier,
  } = useContext(BinArithFormContext);
  const [numMsgWarn, setNumMsgWarn] = useState("");
  const [keyDown, setKeyDown] = useState("");

  const checkNum = (inputNum: string) => {
    setNumMsgWarn("");
    const includesCommaNumInput =
      inputNum.includes(",") || inputNum.includes(".");

    const verifiedNum = controller.getVerifiedNum(
      inputNum,
      includesCommaNumInput
    );
    try {
      if (keyDown !== "Backspace" && numInputType === "inBin") {
        if (includesCommaNumInput && architecturalSize.fractionalPart <= 0)
          throw new Error("Não há parte fracionária para este número");

        const numParts = controller.getIntegerFractionalParts(verifiedNum);

        if (
          numParts.integerPart.length >
          architecturalSize.integerPart * multiplier
        )
          throw new Error(
            "A parte inteira não pode ser maior que o espaço reservado à ela"
          );

        if (
          numParts.fractionalPart &&
          numParts.fractionalPart.length >
            architecturalSize.fractionalPart * multiplier
        )
          throw new Error(
            "A parte fracionária não pode ser maior que o espaço reservado à ela"
          );
      }
    } catch (error) {
      if (error instanceof Error) {
        setNumMsgWarn(error.message);
        return;
      }
    }

    setNum(verifiedNum);
  };

  useEffect(() => {
    if (numInputRef.current && numMsgError) numInputRef.current.focus();
  }, [numMsgError, submitted]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <InputInformation
            origin="Entrada Númerica"
            content={
              numInputType === "inBin"
                ? "Entre com um número binário, respeitando a arquitetura. Obs.: O número pode ser menor que a arquitetura."
                : "Entre com um número decimal."
            }
          >
            <label htmlFor={id}>{children}</label>
          </InputInformation>
          <input
            ref={(input) => (numInputRef.current = input)}
            type="text"
            name={id}
            id={id}
            value={num}
            onChange={(e) => checkNum(e.target.value)}
            onKeyDown={(e) => setKeyDown(e.code)}
            aria-invalid={
              submitted
                ? numMsgError
                  ? true
                  : submittedWithSuccess
                  ? false
                  : undefined
                : undefined
            }
            aria-errormessage="numInputError"
          />
          <span id="numInputError" className="--error-msg" tabIndex={0}>
            {numMsgError}
          </span>
          {numMsgWarn ? (
            <span id="numInputWarn" className="--warn-msg" tabIndex={0}>
              {numMsgWarn}
            </span>
          ) : (
            ""
          )}
        </div>
        <span>
          <InputInformation
            origin="Caixa de Seleção de se é Complemento"
            content={`Marque se deseja um número negativo. ${
              numInputType === "inBin"
                ? "Na correção de magnitude, o bit de maior magnitude tem que ser 1."
                : "Não é necessário digitar -."
            }`}
          >
            <label htmlFor={`is${id}Complement`}>É complemento?</label>
          </InputInformation>
          <input
            type="checkbox"
            name={`is${id}Complement`}
            id={`is${id}Complement`}
            checked={isComplement}
            onChange={(event) => setIsComplement(event.target.checked)}
          />
        </span>
      </div>
    </>
  );
}
