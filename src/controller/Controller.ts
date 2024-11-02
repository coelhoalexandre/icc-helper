import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import { OperationsValues } from "../enums/OperationsValues";
import { SectionValues } from "../enums/SectionValues";
import BinaryArithmetic from "../models/BinaryArithmetic";
import NumberingSystems from "../models/NumberingSystems";
import ArchitectureSize from "../types/ArchitectureSize";
import { RenderData } from "../types/RenderData";

export default class Controller {
  private numberingSystem = new NumberingSystems();
  private binaryArithmetic = new BinaryArithmetic();

  private setViewUpdate;
  public viewElement: JSX.Element | undefined;

  constructor(
    setViewUpdate: React.Dispatch<React.SetStateAction<RenderData | null>>
  ) {
    this.setViewUpdate = setViewUpdate;
  }

  public getNumInputPattern(baseInput: number) {
    return this.numberingSystem.getNumInputPattern(baseInput);
  }

  public getVerifiedNum(num: string, includesCommaNumInput: boolean) {
    return this.numberingSystem.getVerifiedNum(num, includesCommaNumInput);
  }

  public isNeedMaxNumDecPlaces(base: number): boolean {
    return this.numberingSystem.isNeedMaxNumDecPlaces(base);
  }

  public getOperations() {
    return this.binaryArithmetic.operations;
  }

  public getArchitecturesForNumberPart() {
    return this.binaryArithmetic.architectureForNumberPart;
  }

  public getIntegerFractionalParts(num: string, isFractional?: boolean) {
    return this.numberingSystem.getIntegerFractionalParts(num, isFractional);
  }

  public renderNumSysView(
    baseInput: number,
    numInput: string,
    maxDecimalPlaces: number | undefined
  ) {
    numInput = this.checkNum(numInput);
    const knownBases = this.numberingSystem.getNumberConvertedToKnownBases(
      baseInput,
      numInput,
      maxDecimalPlaces
    );

    this.render({
      id: SectionValues.NUMBERING_SYSTEM,
      knownBases,
      numInput,
      baseInput,
    });
  }

  public renderBinArithView(
    architecturalSize: ArchitectureSize,
    operationSelector: OperationsValues,
    num1Input: string,
    num2Input: string
  ) {
    num1Input = this.checkNum(num1Input);
    num2Input = this.checkNum(num2Input);
    const num1PartsInput = this.getIntegerFractionalParts(
      num1Input,
      architecturalSize.fractionalPart ? true : false
    );
    const num2PartsInput = this.getIntegerFractionalParts(
      num2Input,
      architecturalSize.fractionalPart ? true : false
    );

    const operationResult = this.binaryArithmetic.getOperationResult(
      architecturalSize,
      operationSelector,
      num1PartsInput,
      num2PartsInput
    );

    const TFN = this.numberingSystem
      .getNumberConvertedToKnownBases(2, operationResult.visualResult)
      .find((knownBase) => knownBase.id === NumberingSystemsMethods.TFN);

    if (!TFN) throw new Error("It was not possible to convert with TFN");

    this.setViewUpdate({
      id: SectionValues.BINARY_ARITHMETIC,
      architecturalSize,
      operationResult,
      TFN,
    });
  }

  private render(renderData: RenderData) {
    this.setViewUpdate(renderData);
  }

  private checkNum(num: string) {
    if (num.at(num.length - 1) === ",") return (num += 0);

    return num;
  }
}
