import OperationResults, { OperationResult } from "./OperationResult";
import { KnownBases } from "./KnownBases";
import { SectionValues } from "../enums/SectionValues";
import ArchitectureSize from "./ArchitectureSize";
import TFN from "./INumberingSystemsMethod/TFN";
import { MethodsDisplay } from "./INumberingSystemsMethod/MethodsDisplay";
import InverseTFN from "./INumberingSystemsMethod/InverseTFN";

export type RenderData = NumSysData | BinArithData;

export interface NumberingSystemViewProps {
  knownBases: KnownBases;
  numInput: string;
  baseInput: number;
  complementOperation: OperationResult | undefined;
  isNegative: boolean;
  methodsDisplay: MethodsDisplay;
}

export interface BinaryArithmeticViewProps {
  architecturalSize: ArchitectureSize;
  operationResults: OperationResults;
  isThereSignalBit: boolean;
  inverseTFNs: InverseTFN[];
  TFN: TFN | "NaN" | undefined;
  isComplementResult: boolean;
}

interface NumSysData extends NumberingSystemViewProps {
  id: SectionValues.NUMBERING_SYSTEM;
}

interface BinArithData extends BinaryArithmeticViewProps {
  id: SectionValues.BINARY_ARITHMETIC;
}
