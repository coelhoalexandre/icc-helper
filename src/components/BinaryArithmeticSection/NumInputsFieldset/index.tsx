import { useContext } from "react";
import styles from "./NumInputsFieldset.module.css";
import { BinArithFormContext } from "../../../context/BinArithFormContext";
import InputNumber from "./InputNumber";

export default function NumInputsFieldset() {
  const {
    numInputType,
    setNumInputType,
    num1Input,
    setNum1Input,
    setIsNum1Complement,
    num2Input,
    setNum2Input,
    setIsNum2Complement,
    errorMsgs,
  } = useContext(BinArithFormContext);

  return (
    <fieldset>
      <legend>
        Digite os números em binário, sem passar o tamanho da arquitetura:
      </legend>
      <div className={styles.containerNumInputType}>
        <p>Entrada de Números em: </p>
        <div className={styles.radioWrapper}>
          <div className={styles.numInputType}>
            <input
              type="radio"
              name="numInputType"
              id="inBin"
              value="inBin"
              checked={numInputType === "inBin"}
              onChange={(event) =>
                setNumInputType(event.target.value as "inBin")
              }
            />
            <label htmlFor="inBin">Binário</label>
          </div>
          <div className={styles.numInputType}>
            <input
              type="radio"
              name="numInputType"
              id="inDecimal"
              value="inDecimal"
              checked={numInputType === "inDecimal"}
              onChange={(event) =>
                setNumInputType(event.target.value as "inDecimal")
              }
            />
            <label htmlFor="inDecimal">Decimal</label>
          </div>
        </div>
      </div>
      <InputNumber
        id="primeiroNum"
        num={num1Input.num as string}
        setNum={setNum1Input}
        isComplement={num1Input.isComplement}
        setIsComplement={setIsNum1Complement}
        numMsgError={errorMsgs.num1}
      >
        Primeiro Número:{" "}
      </InputNumber>
      <InputNumber
        id="segundoNum"
        num={num2Input.num as string}
        setNum={setNum2Input}
        isComplement={num2Input.isComplement}
        setIsComplement={setIsNum2Complement}
        numMsgError={errorMsgs.num2}
      >
        Segundo Número:{" "}
      </InputNumber>
    </fieldset>
  );
}
