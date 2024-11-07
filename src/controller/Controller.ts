import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import { OperationsValues } from "../enums/OperationsValues";
import { SectionValues } from "../enums/SectionValues";
import BinaryArithmetic from "../models/BinaryArithmetic";
import NumberingSystems from "../models/NumberingSystems";
import ArchitectureSize from "../types/ArchitectureSize";
import { MethodsDisplay } from "../types/INumberingSystemsMethod/MethodsDisplay";
import TFN from "../types/INumberingSystemsMethod/TFN";
import NumWithComplement from "../types/NumWithComplement";
import { OperationResult } from "../types/OperationResult";
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

  public getComplementResult(num: string, commaPosition?: number) {
    return this.binaryArithmetic.getComplementResult(num, commaPosition);
  }

  public getMethodsUsed(base: number) {
    return this.numberingSystem.getMethodsUsed(base);
  }

  public renderNumSysView(
    baseInput: number,
    numInput: string,
    maxDecimalPlaces: number | undefined,
    isNumComplement: boolean,
    methodsDisplay: MethodsDisplay
  ) {
    numInput = this.checkNum(numInput);
    const originalNumInput = numInput;
    let isNegative = false;
    let complementOperation: OperationResult | undefined;

    if (isNumComplement && baseInput === 2) {
      const commaPosition = numInput.indexOf(",");
      complementOperation = this.getComplementResult(
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

    this.render({
      id: SectionValues.NUMBERING_SYSTEM,
      knownBases,
      numInput: originalNumInput,
      baseInput,
      complementOperation,
      isNegative,
      methodsDisplay,
    });
  }

  public renderBinArithView(
    architecturalSize: ArchitectureSize,
    operationSelector: OperationsValues,
    num1Input: NumWithComplement,
    num2Input: NumWithComplement,
    isThereSignalBit: boolean,
    numInputType: "inBin" | "inDecimal",
    isDecimalResult: boolean
  ) {
    if (
      !(typeof num1Input.num === "string") ||
      !(typeof num2Input.num === "string")
    )
      throw new Error("The number is not a string");

    if (numInputType === "inDecimal") {
      const inDecimalOperationResults: OperationResult[] = [];
      const num1InverseTFN = this.numberingSystem
        .getNumberConvertedToKnownBases(
          10,
          num1Input.num,
          architecturalSize.fractionalPart
        )
        .find(
          (knownBase) => knownBase.id === NumberingSystemsMethods.INVERSE_TFN
        );
      const num2InverseTFN = this.numberingSystem
        .getNumberConvertedToKnownBases(
          10,
          num2Input.num,
          architecturalSize.fractionalPart
        )
        .find(
          (knownBase) => knownBase.id === NumberingSystemsMethods.INVERSE_TFN
        );
      console.log(num1InverseTFN, num2InverseTFN);
      if (!num1InverseTFN || !num2InverseTFN)
        throw new Error("It was not possible to convert with Inverse TFN");

      num1Input.num = num1InverseTFN.convertedNumber;
      const num1CommaPosition = num1Input.num.indexOf(",");
      if (num1Input.isComplement) {
        const operationResult = this.getComplementResult(
          num1Input.num.replace(",", ""),
          num1CommaPosition
        );
        inDecimalOperationResults.push(operationResult);
        num1Input.num = operationResult.visualResult;
      }

      num2Input.num = num2InverseTFN.convertedNumber;
      const num2CommaPosition = num2Input.num.indexOf(",");
      if (num2Input.isComplement) {
        const operationResult = this.getComplementResult(
          num2Input.num.replace(",", ""),
          num2CommaPosition
        );
        inDecimalOperationResults.push(operationResult);
        num2Input.num = operationResult.visualResult;
      }
    }

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
      operationResults.id === OperationsValues.DIV
        ? operationResults.results[0]
        : operationResults.results[operationResults.results.length - 1];

    let isComplementResult = false;
    let visualResult = lastOperationResults.visualResult;

    const commaPosition =
      visualResult.indexOf(",") === -1 ? 0 : visualResult.indexOf(",");

    if (isThereSignalBit && visualResult[0] === "1") {
      operationResults.results.push(
        this.getComplementResult(visualResult.replace(",", ""))
      );
      isComplementResult = true;
    }

    visualResult =
      operationResults.id === OperationsValues.DIV && !isComplementResult
        ? operationResults.results[0].visualResult
        : operationResults.results[operationResults.results.length - 1]
            .visualResult;

    if (
      operationResults.id === OperationsValues.MUL &&
      isComplementResult &&
      visualResult.includes(",")
    ) {
      visualResult = visualResult.replace(",", "");
      const firstHalf = visualResult.slice(0, commaPosition);
      const secondHalf = visualResult.slice(commaPosition);
      visualResult = firstHalf + "," + secondHalf;
    }

    operationResults.results[operationResults.results.length - 1].visualResult =
      visualResult;

    let TFN: TFN | "NaN" | undefined = undefined;
    if (isDecimalResult) {
      TFN =
        operationResults.results[0].diagnostic !== "NaN"
          ? this.numberingSystem
              .getNumberConvertedToKnownBases(2, visualResult)
              .find((knownBase) => knownBase.id === NumberingSystemsMethods.TFN)
          : "NaN";

      if (!TFN) throw new Error("It was not possible to convert with TFN");
    }

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
