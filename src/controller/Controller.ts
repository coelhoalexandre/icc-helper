import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import { OperationsValues } from "../enums/OperationsValues";
import { SectionValues } from "../enums/SectionValues";
import BinaryArithmetic from "../models/BinaryArithmetic";
import NumberingSystems from "../models/NumberingSystems";
import ArchitectureSize from "../types/ArchitectureSize";
import NumWithComplement from "../types/NumWithComplement";
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
    num1Input: NumWithComplement,
    num2Input: NumWithComplement,
    isThereSignalBit: boolean
  ) {
    if (
      !(typeof num1Input.num === "string") ||
      !(typeof num2Input.num === "string")
    )
      throw new Error("The number is not a string");

    num1Input.num = this.checkNum(num1Input.num);
    num2Input.num = this.checkNum(num2Input.num);

    const num1PartsInput = {
      num: this.getIntegerFractionalParts(
        num1Input.num,
        architecturalSize.fractionalPart ? true : false
      ),
      isComplement: num1Input.isComplement,
    };
    const num2PartsInput = {
      num: this.getIntegerFractionalParts(
        num2Input.num,
        architecturalSize.fractionalPart ? true : false
      ),
      isComplement: num2Input.isComplement,
    };

    const operationResults = this.binaryArithmetic.getOperationResult(
      architecturalSize,
      operationSelector,
      num1PartsInput,
      num2PartsInput,
      isThereSignalBit
    );

    const lastOperationResults =
      operationResults.results[operationResults.results.length - 1];
    let isComplementResult = false;

    if (isThereSignalBit && lastOperationResults.visualResult[0] === "1") {
      operationResults.results.push(
        this.binaryArithmetic.getComplementResult(
          lastOperationResults.visualResult.replace(",", "")
        )
      );
      isComplementResult = true;
    }

    const TFN = this.numberingSystem
      .getNumberConvertedToKnownBases(
        2,
        operationResults.results[operationResults.results.length - 1]
          .visualResult
      )
      .find((knownBase) => knownBase.id === NumberingSystemsMethods.TFN);

    if (!TFN) throw new Error("It was not possible to convert with TFN");

    this.setViewUpdate({
      id: SectionValues.BINARY_ARITHMETIC,
      architecturalSize,
      operationResults,
      isThereSignalBit,
      TFN,
      isComplementResult,
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
