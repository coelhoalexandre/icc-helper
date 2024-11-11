import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { BinArithFormContext } from ".";
import {
  binArithErrorMsgsDefault,
  BinArithErrorMsgsKey,
  requiredField,
} from "../../types/ErrorMsgs";
import RenderBinArithViewProps from "../../types/RenderBinArithViewProps";
import ArchitectureSize from "../../types/ArchitectureSize";
import { ArchitecturesForNumberParts } from "../../enums/ArchitecturesForNumberParts";
import { OperationsValues } from "../../enums/OperationsValues";
import getIntegerFractionalParts from "../../utils/getIntegerFractionalParts";
import { ControllerContext } from "../ControllerContext";

export const BinArithFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { controller } = useContext(ControllerContext);
  const [submitted, setSubmitted] = useState(false);
  const [submittedWithSuccess, setSubmittedWithSuccess] = useState(false);

  const [architecturalSizeInput, setArchitecturalSizeInput] = useState(1);
  const [isThereSignalBit, setIsThereSignalBit] = useState(false);
  const [isThereSignalBitDisabled, setIsThereSignalDisabled] = useState(false);
  const [
    architecturesForNumberPartsInput,
    setArchitecturesForNumberPartsInput,
  ] = useState(ArchitecturesForNumberParts.INT);
  const [isPartQuantInputDisabled, setIsPartQuantInputDisabled] =
    useState(true);
  const [integerPartQuantInput, setIntegerPartQuantInput] = useState(1);
  const [fractionalPartQuantInput, setFractionalPartQuantInput] = useState(0);
  const [architecturalSize, setArchitecturalSize] = useState<ArchitectureSize>({
    total: architecturalSizeInput,
    integerPart: integerPartQuantInput,
    fractionalPart: fractionalPartQuantInput,
  });
  const [operationSelector, setOperationSelector] = useState(
    OperationsValues.ADD
  );
  const [num1Input, setNum1Input] = useState("");
  const [num2Input, setNum2Input] = useState("");
  const [isNum1Complement, setIsNum1Complement] = useState(false);
  const [isNum2Complement, setIsNum2Complement] = useState(false);
  const [numInputType, setNumInputType] = useState<"inBin" | "inDecimal">(
    "inBin"
  );
  const [isNumInputModified, setIsNumInputModified] = useState(false);
  const [isDecimalResult, setIsDecimalResult] = useState(false);
  const multiplier = isNumInputModified ? 2 : 1;

  const [errorMsgs, setErrorMsgs] = useState(binArithErrorMsgsDefault);

  const isValidForm = (): boolean => {
    setSubmitted(false);
    setSubmitted(true);
    setSubmittedWithSuccess(false);
    resetErrorMsgs();

    if (num1Input.at(num1Input.length - 1) === ",") setNum1Input(num1Input + 0);
    if (num2Input.at(num2Input.length - 1) === ",") setNum2Input(num2Input + 0);

    const isValidForm = true;

    if (!isValidArchitecturalSize()) return false;

    if (!isValidOperationSelector()) return false;

    if (!isValidNum1()) return false;

    if (!isValidNum2()) return false;

    setSubmittedWithSuccess(isValidForm);
    return isValidForm;
  };

  const isValidArchitecturalSize = () => {
    let isValidArchitecturalSize = true;
    const minArchitecturalSize = isThereSignalBit ? 2 : 1;

    if (architecturalSizeInput < minArchitecturalSize)
      isValidArchitecturalSize = getError(
        "architecturalSize",
        `A arquitetura deve ser igual ou maior que ${minArchitecturalSize}`
      );

    return isValidArchitecturalSize;
  };

  const isValidOperationSelector = () => {
    let isValidOperationSelector = true;

    if (
      isNumInputModified &&
      (operationSelector === OperationsValues.MUL ||
        operationSelector === OperationsValues.DIV)
    )
      isValidOperationSelector = getError(
        "operationSelector",
        `A operação ${operationSelector} está desativada por causa do modificador.`
      );

    return isValidOperationSelector;
  };

  const isValidNum1 = () => {
    let isValidNum1 = true;

    if (!num1Input.length) isValidNum1 = getError("num1", requiredField);

    const { integerPart, fractionalPart } = getIntegerFractionalParts(
      num1Input,
      fractionalPartQuantInput ? true : false
    );

    if (numInputType === "inBin" && integerPart.length > integerPartQuantInput)
      isValidNum1 = getError(
        "num1",
        "A parte inteira da primeira entrada numérica é maior que ao que está reservado para a parte inteira na arquitetura."
      );

    if (
      numInputType === "inBin" &&
      fractionalPart &&
      fractionalPart.length > fractionalPartQuantInput
    )
      isValidNum1 = getError(
        "num1",
        "A parte fracionária da primeira entrada numérica é maior que ao que está reservado para a parte fracionária na arquitetura."
      );

    const match = num1Input.match(
      controller.getNumInputPattern(numInputType === "inBin" ? 2 : 10)
    );

    if (!(match && match[0] === match.input))
      isValidNum1 = getError("num1", "O número não é válido para a base.");

    return isValidNum1;
  };

  const isValidNum2 = () => {
    let isValidNum2 = true;

    if (!num2Input.length) isValidNum2 = getError("num2", requiredField);

    const { integerPart, fractionalPart } = getIntegerFractionalParts(
      num2Input,
      fractionalPartQuantInput ? true : false
    );

    if (numInputType === "inBin" && integerPart.length > integerPartQuantInput)
      isValidNum2 = getError(
        "num2",
        "A parte inteira da segunda entrada numérica é maior que ao que está reservado para a parte inteira na arquitetura."
      );

    if (
      numInputType === "inBin" &&
      fractionalPart &&
      fractionalPart.length > fractionalPartQuantInput
    )
      isValidNum2 = getError(
        "num2",
        "A parte fracionária da segunda entrada numérica é maior que ao que está reservado para a parte fracionária na arquitetura."
      );

    const match = num2Input.match(
      controller.getNumInputPattern(numInputType === "inBin" ? 2 : 10)
    );

    if (!(match && match[0] === match.input))
      isValidNum2 = getError("num2", "O número não é válido para a base.");

    return isValidNum2;
  };

  const getError = (key: BinArithErrorMsgsKey, msg: string): false => {
    setErrorMsgs((errorMsgs) => ({ ...errorMsgs, [key]: msg }));
    return false;
  };

  const resetErrorMsgs = () => {
    setErrorMsgs(binArithErrorMsgsDefault);
  };

  const checkPartsQuant = (
    valueEvent: string,
    id: "ArchitecturalSize" | "IntegerPart" | "FractionalPart"
  ) => {
    const value = Number(valueEvent);
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

        if (isThereSignalBit && integerPartQuant < 2) {
          integerPartQuant = 2;
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

  const getRenderProps = (): RenderBinArithViewProps => ({
    architecturalSize,
    isDecimalResult,
    isNumInputModified,
    isThereSignalBit,
    num1Input: { num: num1Input, isComplement: isNum1Complement },
    num2Input: { num: num2Input, isComplement: isNum2Complement },
    numInputType,
    operationSelector,
  });

  useEffect(() => {
    setArchitecturalSize({
      total: architecturalSizeInput,
      integerPart: integerPartQuantInput,
      fractionalPart: fractionalPartQuantInput,
    });
  }, [architecturalSizeInput, fractionalPartQuantInput, integerPartQuantInput]);

  const getPartsQuant = useCallback(
    (integerMultiplier: number, fractionalMultiplier: number) => {
      const integerPartQuant = Math.ceil(
        architecturalSizeInput * integerMultiplier
      );

      const fractionalPartQuant = Math.floor(
        architecturalSizeInput * fractionalMultiplier
      );

      if (isThereSignalBit && integerPartQuant < 2)
        return {
          integerPartQuant: 2,
          fractionalPartQuant: fractionalPartQuant - 1,
        };

      return { integerPartQuant, fractionalPartQuant };
    },
    [architecturalSizeInput, isThereSignalBit]
  );

  useLayoutEffect(() => {
    if (isNum1Complement || isNum2Complement) {
      setIsThereSignalBit(true);
      setIsThereSignalDisabled(true);
    }

    if (!(isNum1Complement || isNum2Complement))
      setIsThereSignalDisabled(false);

    if (operationSelector !== OperationsValues.ADD) {
      setIsThereSignalBit(true);
      setIsThereSignalDisabled(true);
    }
  }, [isNum1Complement, isNum2Complement, operationSelector]);

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
    <BinArithFormContext.Provider
      value={{
        submitted,
        submittedWithSuccess,
        architecturalSize,
        setArchitecturesForNumberPartsInput,
        num1Input: { num: num1Input, isComplement: isNum1Complement },
        setNum1Input,
        setIsNum1Complement,
        num2Input: { num: num2Input, isComplement: isNum2Complement },
        setNum2Input,
        setIsNum2Complement,
        isDecimalResult,
        setIsDecimalResult,
        isNumInputModified,
        setIsNumInputModified,
        isThereSignalBit,
        setIsThereSignalBit,
        isThereSignalBitDisabled,
        isPartQuantInputDisabled,
        integerPartQuantInput,
        fractionalPartQuantInput,
        numInputType,
        setNumInputType,
        multiplier,
        operationSelector,
        setOperationSelector,
        checkPartsQuant,
        isValidForm,
        getRenderProps,
        errorMsgs,
      }}
    >
      {children}
    </BinArithFormContext.Provider>
  );
};
