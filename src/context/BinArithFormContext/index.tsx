import { createContext } from "react";
import RenderBinArithViewProps from "../../types/RenderBinArithViewProps";
import { OperationsValues } from "../../enums/OperationsValues";
import { ArchitecturesForNumberParts } from "../../enums/ArchitecturesForNumberParts";
import {
  BinArithErrorMsgs,
  binArithErrorMsgsDefault,
} from "../../types/ErrorMsgs";

interface BinArithFormContextValue extends RenderBinArithViewProps {
  submitted: boolean;
  submittedWithSuccess: boolean;
  setIsThereSignalBit: React.Dispatch<React.SetStateAction<boolean>>;
  isThereSignalBitDisabled: boolean;
  setArchitecturesForNumberPartsInput: React.Dispatch<
    React.SetStateAction<ArchitecturesForNumberParts>
  >;
  isPartQuantInputDisabled: boolean;
  integerPartQuantInput: number;
  fractionalPartQuantInput: number;
  setOperationSelector: React.Dispatch<React.SetStateAction<OperationsValues>>;
  setNumInputType: React.Dispatch<React.SetStateAction<"inBin" | "inDecimal">>;
  setNum1Input: React.Dispatch<React.SetStateAction<string>>;
  setIsNum2Complement: React.Dispatch<React.SetStateAction<boolean>>;
  setNum2Input: React.Dispatch<React.SetStateAction<string>>;
  setIsNum1Complement: React.Dispatch<React.SetStateAction<boolean>>;
  multiplier: number;
  setIsNumInputModified: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDecimalResult: React.Dispatch<React.SetStateAction<boolean>>;
  checkPartsQuant: (
    valueEvent: string,
    id: "ArchitecturalSize" | "IntegerPart" | "FractionalPart"
  ) => void;
  isValidForm: () => boolean;
  getRenderProps: () => RenderBinArithViewProps;
  errorMsgs: BinArithErrorMsgs;
}

export const BinArithFormContext = createContext<BinArithFormContextValue>({
  submitted: false,
  submittedWithSuccess: false,
  architecturalSize: {
    total: 1,
    integerPart: 1,
    fractionalPart: 0,
  },
  operationSelector: OperationsValues.ADD,
  setOperationSelector: () => {},
  num1Input: { num: "", isComplement: false },
  num2Input: { num: "", isComplement: false },
  isThereSignalBit: false,
  setIsThereSignalBit: () => {},
  isThereSignalBitDisabled: false,
  setArchitecturesForNumberPartsInput: () => {},
  isPartQuantInputDisabled: true,
  numInputType: "inBin",
  isNumInputModified: false,
  isDecimalResult: false,
  integerPartQuantInput: 1,
  fractionalPartQuantInput: 0,
  setNum1Input: () => {},
  setIsNum1Complement: () => {},
  setNum2Input: () => {},
  setIsNum2Complement: () => {},
  multiplier: 1,
  setNumInputType: () => {},
  checkPartsQuant: () => {},
  setIsNumInputModified: () => {},
  setIsDecimalResult: () => {},
  isValidForm: () => false,
  getRenderProps: () => ({
    architecturalSize: {
      total: 1,
      integerPart: 1,
      fractionalPart: 0,
    },
    operationSelector: OperationsValues.ADD,
    num1Input: { num: "", isComplement: false },
    num2Input: { num: "", isComplement: false },
    isThereSignalBit: false,
    numInputType: "inBin",
    isNumInputModified: false,
    isDecimalResult: false,
  }),
  errorMsgs: binArithErrorMsgsDefault,
});

BinArithFormContext.displayName = "BinArithForm Context";
