import { OperationResult } from "./OperationResult";
import { KnownBases } from "./KnownBases";
import { SectionValues } from "../enums/SectionValues";
import ArchitectureSize from "./ArchitectureSize";
import TFN from "./INumberingSystemsMethod/TFN";

export type RenderData = NumSysData | BinArithData;

interface NumSysData {
  id: SectionValues.NUMBERING_SYSTEM;
  knownBases: KnownBases;
  numInput: string;
  baseInput: number;
}

interface BinArithData {
  id: SectionValues.BINARY_ARITHMETIC;
  architecturalSize: ArchitectureSize;
  operationResult: OperationResult;
  TFN: TFN;
}
