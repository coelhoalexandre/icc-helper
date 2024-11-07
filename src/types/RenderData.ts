import OperationResults, { OperationResult } from "./OperationResult";
import { KnownBases } from "./KnownBases";
import { SectionValues } from "../enums/SectionValues";
import ArchitectureSize from "./ArchitectureSize";
import TFN from "./INumberingSystemsMethod/TFN";
import { MethodsDisplay } from "./INumberingSystemsMethod/MethodsDisplay";

export type RenderData = NumSysData | BinArithData;

interface NumSysData {
  id: SectionValues.NUMBERING_SYSTEM;
  knownBases: KnownBases;
  numInput: string;
  baseInput: number;
  complementOperation: OperationResult | undefined;
  isNegative: boolean;
  methodsDisplay: MethodsDisplay;
}

interface BinArithData {
  id: SectionValues.BINARY_ARITHMETIC;
  architecturalSize: ArchitectureSize;
  operationResults: OperationResults;
  isThereSignalBit: boolean;
  TFN: TFN | "NaN" | undefined;
  isComplementResult: boolean;
}
