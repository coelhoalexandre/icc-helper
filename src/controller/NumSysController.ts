import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import { SectionValues } from "../enums/SectionValues";
import NumberingSystems from "../models/NumberingSystems";
import { KnownBases } from "../types/KnownBases";
import NumParts from "../types/NumParts";
import { OperationResult } from "../types/OperationResult";
import { RenderData } from "../types/RenderData";
import RenderNumSysViewProps from "../types/RenderNumSysViewProps";
import checkNum from "../utils/checkNum";
import getComplementResult from "../utils/getComplementResult";

export default class NumSysController {
  private numberingSystem = new NumberingSystems();

  public getNumInputPattern(baseInput: number): string {
    return this.numberingSystem.getNumInputPattern(baseInput);
  }

  public getVerifiedNum(num: string, includesCommaNumInput: boolean): string {
    return this.numberingSystem.getVerifiedNum(num, includesCommaNumInput);
  }

  public isNeedMaxNumDecPlaces(base: number): boolean {
    return this.numberingSystem.isNeedMaxNumDecPlaces(base);
  }

  public getIntegerFractionalParts(
    num: string,
    isFractional?: boolean
  ): NumParts {
    return this.numberingSystem.getIntegerFractionalParts(num, isFractional);
  }

  public getMethodsUsed(base: number): NumberingSystemsMethods[] {
    return this.numberingSystem.getMethodsUsed(base);
  }

  public getNumWithComma(num: string, commaPosition: number): string {
    return this.numberingSystem.getNumWithComma(num, commaPosition);
  }

  public getNumberConvertedToKnownBases(
    base: number,
    num: string,
    maxDecimalPlaces?: number
  ): KnownBases {
    return this.numberingSystem.getNumberConvertedToKnownBases(
      base,
      num,
      maxDecimalPlaces
    );
  }

  public getNumSysViewData({
    baseInput,
    numInput,
    maxDecimalPlaces,
    isNumComplement,
    methodsDisplay,
  }: RenderNumSysViewProps): RenderData {
    numInput = checkNum(numInput);

    const originalNumInput = numInput;
    let isNegative = false;
    let complementOperation: OperationResult | undefined;

    if (isNumComplement && baseInput === 2) {
      const commaPosition = numInput.indexOf(",");
      complementOperation = getComplementResult(
        numInput.replace(",", ""),
        commaPosition
      );
      numInput = complementOperation.visualResult;
    }

    if (isNumComplement) isNegative = true;

    const knownBases = this.numberingSystem.getNumberConvertedToKnownBases(
      baseInput,
      numInput,
      maxDecimalPlaces
    );

    const data: RenderData = {
      id: SectionValues.NUMBERING_SYSTEM,
      knownBases,
      numInput: originalNumInput,
      baseInput,
      complementOperation,
      isNegative,
      methodsDisplay,
    };

    return data;
  }
}
