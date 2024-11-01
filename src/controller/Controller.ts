import { OperationsValues } from "../enums/OperationsValues";
import BinaryArithmetic from "../models/BinaryArithmetic";
import NumberingSystems from "../models/NumberingSystems";
import { KnownBases } from "../types/KnownBases";
import { NumberingSystemData } from "../types/NumberingSystemData";

export default class Controller {
  private numberingSystem = new NumberingSystems();
  private binaryArithmetic = new BinaryArithmetic();

  private setViewUpdate;
  public viewElement: JSX.Element | undefined;

  constructor(
    setViewUpdate: React.Dispatch<
      React.SetStateAction<NumberingSystemData | null>
    >
  ) {
    this.setViewUpdate = setViewUpdate;
  }

  public getNumInputPattern(baseInput: number) {
    return this.numberingSystem.getNumInputPattern(baseInput);
  }

  public isNeedMaxNumDecPlaces(base: number): boolean {
    return this.numberingSystem.isNeedMaxNumDecPlaces(base);
  }

  public renderNumSysView(
    baseInput: number,
    numInput: string,
    maxDecimalPlaces: number | undefined
  ) {
    const knownBases = this.numberingSystem.getNumberConvertedToKnownBases(
      baseInput,
      numInput,
      maxDecimalPlaces
    );

    this.render({ knownBases, numInput, baseInput });
  }

  public renderBinArithView(
    architecturalSizeInput: number,
    operationSelector: OperationsValues,
    num1Input: string,
    num2Input: string
  ) {
    const num1PartsInput =
      this.numberingSystem.getIntegerFractionalParts(num1Input);
    const num2PartsInput =
      this.numberingSystem.getIntegerFractionalParts(num2Input);

    const operationResult = this.binaryArithmetic.getOperationResult(
      architecturalSizeInput,
      operationSelector,
      num1PartsInput,
      num2PartsInput
    );

    console.log(operationResult);
    // this.setViewUpdate({ operationResult });
  }

  private render(data: {
    knownBases: KnownBases;
    numInput: string;
    baseInput: number;
  }) {
    this.setViewUpdate(data);
  }
}
