import { createContext } from "react";
import RenderNumSysViewProps from "../../types/RenderNumSysViewProps";
import { NumberingSystemsMethods } from "../../enums/NumberingSystemsMethods";
import { MethodsDisplay } from "../../types/INumberingSystemsMethod/MethodsDisplay";
import ErrorMsgs, { errorMsgsDefault } from "../../types/ErrorMsgs";

interface NumSysFormContextValue extends RenderNumSysViewProps {
  submitted: boolean;
  submittedWithSuccess: boolean;
  setBaseInput: React.Dispatch<React.SetStateAction<number>>;
  setNumInput: React.Dispatch<React.SetStateAction<string>>;
  setIsNumComplement: React.Dispatch<React.SetStateAction<boolean>>;
  includesCommaNumInput: boolean;
  setIncludesCommaNumInput: React.Dispatch<React.SetStateAction<boolean>>;
  setMaxDecimalPlaces: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMethodsDisplay: React.Dispatch<React.SetStateAction<MethodsDisplay>>;
  isAllMethods: boolean;
  setIsAllMethods: React.Dispatch<React.SetStateAction<boolean>>;
  isValidForm: () => boolean;
  getRenderProps: () => RenderNumSysViewProps;
  errorMsgs: ErrorMsgs;
}

export const NumSysFormContext = createContext<NumSysFormContextValue>({
  submitted: false,
  submittedWithSuccess: false,
  baseInput: 2,
  isNumComplement: false,
  maxDecimalPlaces: 4,
  methodsDisplay: [
    [NumberingSystemsMethods.TFN, true],
    [NumberingSystemsMethods.AGGREGATION, true],
    [NumberingSystemsMethods.DISAGGREGATION, true],
    [NumberingSystemsMethods.INVERSE_TFN, true],
  ],
  numInput: "",
  setBaseInput: () => {},
  setNumInput: () => {},
  setIsNumComplement: () => {},
  includesCommaNumInput: false,
  setIncludesCommaNumInput: () => {},
  setMaxDecimalPlaces: () => {},
  setMethodsDisplay: () => {},
  isValidForm: () => false,
  isAllMethods: true,
  setIsAllMethods: () => {},
  getRenderProps: () => ({
    baseInput: 2,
    isNumComplement: false,
    maxDecimalPlaces: 4,
    methodsDisplay: [
      [NumberingSystemsMethods.TFN, true],
      [NumberingSystemsMethods.AGGREGATION, true],
      [NumberingSystemsMethods.DISAGGREGATION, true],
      [NumberingSystemsMethods.INVERSE_TFN, true],
    ],
    numInput: "",
  }),
  errorMsgs: errorMsgsDefault,
});

NumSysFormContext.displayName = "NumSysForm Context";
