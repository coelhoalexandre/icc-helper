import { useContext, useState } from "react";
import { NumSysFormContext } from ".";
import { NumberingSystemsMethods } from "../../enums/NumberingSystemsMethods";
import RenderNumSysViewProps from "../../types/RenderNumSysViewProps";
import { MethodsDisplay } from "../../types/INumberingSystemsMethod/MethodsDisplay";
import {
  errorMsgsDefault,
  ErrorMsgsKey,
  requiredField,
} from "../../types/ErrorMsgs";
import { ControllerContext } from "../ControllerContext";

export const NumSysFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { controller } = useContext(ControllerContext);
  const [submitted, setSubmitted] = useState(false);
  const [submittedWithSuccess, setSubmittedWithSuccess] = useState(false);

  const [baseInput, setBaseInput] = useState(2);
  const [numInput, setNumInput] = useState("");
  const [maxDecimalPlaces, setMaxDecimalPlaces] = useState<
    number | undefined
  >();
  const [includesCommaNumInput, setIncludesCommaNumInput] = useState(false);
  const [isNumComplement, setIsNumComplement] = useState(false);
  const [methodsDisplay, setMethodsDisplay] = useState<MethodsDisplay>([
    [NumberingSystemsMethods.TFN, true],
    [NumberingSystemsMethods.AGGREGATION, true],
    [NumberingSystemsMethods.DISAGGREGATION, true],
    [NumberingSystemsMethods.INVERSE_TFN, true],
  ]);
  const [isAllMethods, setIsAllMethods] = useState(true);

  const [errorMsgs, setErrorMsgs] = useState(errorMsgsDefault);

  const isValidForm = (): boolean => {
    setSubmitted(true);
    setSubmittedWithSuccess(false);
    resetErrorMsgs();

    let isValidForm = true;
    if (numInput.at(numInput.length - 1) === ",") setNumInput(numInput + 0);

    isValidForm = getIsValidBase();

    isValidForm = getIsValidNumInput();

    isValidForm = getIsValidMaxDecimalPlaces();

    setSubmittedWithSuccess(isValidForm);
    return isValidForm;
  };

  const getIsValidBase = () => {
    let isValidBase = true;
    if (numInput.at(numInput.length - 1) === ",") setNumInput(numInput + 0);

    if (baseInput < 2)
      isValidBase = getError("base", "A base deve ser maior ou igual a 2.");

    if (baseInput > 36)
      isValidBase = getError("base", "A base deve ser menor ou igual a 36.");

    return isValidBase;
  };

  const getIsValidNumInput = () => {
    let isValidNumInput = true;

    if (!numInput.length) isValidNumInput = getError("numInput", requiredField);

    const match = numInput.match(controller.getNumInputPattern(baseInput));

    if (!(match && match[0] === match.input))
      isValidNumInput = getError(
        "numInput",
        "O número não é válido para a base."
      );

    if (baseInput === 2 && isNumComplement && numInput[0] === "0")
      isValidNumInput = getError(
        "numInput",
        "Um número negativo na base 2 deve ter o bit maior magnitude 1"
      );

    return isValidNumInput;
  };

  const getIsValidMaxDecimalPlaces = () => {
    let isValidMaxDecimalPlaces = true;

    if (typeof maxDecimalPlaces === "number" && maxDecimalPlaces < 1)
      isValidMaxDecimalPlaces = getError(
        "maxDecimalPlaces",
        "As casas decimais devem ser maior ou igual a 1."
      );

    return isValidMaxDecimalPlaces;
  };

  const getError = (key: ErrorMsgsKey, msg: string): false => {
    setErrorMsgs((errorMsgs) => ({ ...errorMsgs, [key]: msg }));
    return false;
  };

  const resetErrorMsgs = () => {
    setErrorMsgs(errorMsgsDefault);
  };

  const getRenderProps = (): RenderNumSysViewProps => ({
    baseInput,
    numInput,
    maxDecimalPlaces,
    isNumComplement,
    methodsDisplay,
  });

  return (
    <NumSysFormContext.Provider
      value={{
        submitted,
        submittedWithSuccess,
        baseInput,
        setBaseInput,
        numInput,
        setNumInput,
        isNumComplement,
        setIsNumComplement,
        includesCommaNumInput,
        setIncludesCommaNumInput,
        maxDecimalPlaces,
        setMaxDecimalPlaces,
        methodsDisplay,
        setMethodsDisplay,
        isAllMethods,
        setIsAllMethods,
        isValidForm,
        getRenderProps,
        errorMsgs,
      }}
    >
      {children}
    </NumSysFormContext.Provider>
  );
};
