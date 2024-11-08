import { OperationsValues } from "../enums/OperationsValues";
import ArchitectureSize from "./ArchitectureSize";
import NumTwoParts from "./NumTwoParts";
import NumWithComplement from "./NumWithComplement";

export default interface RenderBinArithViewProps
  extends OperationDefault,
    TypeInput {}

export interface RenderBinArithViewPropsExtends extends OperationDefault {
  num1TwoParts?: NumTwoParts;
  num2TwoParts?: NumTwoParts;
}

interface OperationDefault {
  architecturalSize: ArchitectureSize;
  operationSelector: OperationsValues;
  num1Input: NumWithComplement;
  num2Input: NumWithComplement;
  isThereSignalBit: boolean;
}

interface TypeInput {
  numInputType: "inBin" | "inDecimal";
  isNumInputModified: boolean;
  isDecimalResult: boolean;
}
