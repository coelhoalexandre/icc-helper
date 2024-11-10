import { ArchitecturesForNumberParts } from "../enums/ArchitecturesForNumberParts";
import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import { OperationsValues } from "../enums/OperationsValues";
import { SectionValues } from "../enums/SectionValues";
import BinaryArithmetic from "../models/BinaryArithmetic";
import ArchitectureSize from "../types/ArchitectureSize";
import InverseTFN from "../types/INumberingSystemsMethod/InverseTFN";
import TFN from "../types/INumberingSystemsMethod/TFN";
import NumTwoParts from "../types/NumTwoParts";
import NumWithComplement from "../types/NumWithComplement";
import OperationResults, {
  Diagnostic,
  InDecimalOperationResult,
  OperationResult,
} from "../types/OperationResult";
import RenderBinArithViewProps from "../types/RenderBinArithViewProps";
import { RenderData } from "../types/RenderData";
import checkNum from "../utils/checkNum";
import getIntegerFractionalParts from "../utils/getIntegerFractionalParts";
import getNumberConvertedToKnownBases from "../utils/getNumberConvertedToKnownBases";
import getNumWithComma from "../utils/getNumWithComma";

export default class BinArithController {
  private binaryArithmetic = new BinaryArithmetic();

  public getOperations(): OperationsValues[] {
    return this.binaryArithmetic.operations;
  }

  public getArchitecturesForNumberPart(): ArchitecturesForNumberParts[] {
    return this.binaryArithmetic.architectureForNumberPart;
  }

  public getComplementResult(
    num: string,
    commaPosition?: number
  ): OperationResult {
    return this.binaryArithmetic.getComplementResult(num, commaPosition);
  }

  public getBinArithData({
    architecturalSize,
    operationSelector,
    num1Input,
    num2Input,
    isThereSignalBit,
    numInputType,
    isNumInputModified,
    isDecimalResult,
  }: RenderBinArithViewProps): RenderData {
    if (
      !(typeof num1Input.num === "string") ||
      !(typeof num2Input.num === "string")
    )
      throw new Error("The number is not a string");

    const inverseTFNs: InverseTFN[] = [];
    const inDecimalOperationResults: InDecimalOperationResult[] = [];
    let num1TwoParts: NumTwoParts | undefined = undefined;
    let num2TwoParts: NumTwoParts | undefined = undefined;

    if (numInputType === "inDecimal") {
      const [num1TwoPartsCaught, num2TwoPartsCaught] = this.getBinNums(
        num1Input,
        num2Input,
        architecturalSize,
        isThereSignalBit,
        isNumInputModified,
        inverseTFNs,
        inDecimalOperationResults
      );

      num1Input.num = num1TwoPartsCaught.partOne;
      num2Input.num = num2TwoPartsCaught.partOne;

      if (
        num1TwoPartsCaught.partTwo.length &&
        num2TwoPartsCaught.partTwo.length
      ) {
        num1TwoParts = num1TwoPartsCaught;
        num2TwoParts = num2TwoPartsCaught;
      }
    } else if (isNumInputModified) {
      const [num1TwoPartsCaught] = this.getNum(
        num1Input.num,
        architecturalSize,
        isNumInputModified,
        num1Input.isComplement,
        false
      );

      const [num2TwoPartsCaught] = this.getNum(
        num2Input.num,
        architecturalSize,
        isNumInputModified,
        num2Input.isComplement,
        false,
        inDecimalOperationResults
      );

      num1TwoParts = num1TwoPartsCaught;
      num2TwoParts = num2TwoPartsCaught;
    }

    num1Input.num = checkNum(num1Input.num);
    num2Input.num = checkNum(num2Input.num);

    const num1PartsInput = this.getNumPartsWithComplement(
      num1Input.num,
      architecturalSize.fractionalPart,
      num1Input.isComplement
    );

    const num2PartsInput = this.getNumPartsWithComplement(
      num2Input.num,
      architecturalSize.fractionalPart,
      num2Input.isComplement
    );

    const operationResults = this.binaryArithmetic.getOperationResult(
      architecturalSize,
      operationSelector,
      num1PartsInput,
      num2PartsInput,
      isThereSignalBit,
      num1TwoParts,
      num2TwoParts
    );

    const [visualResult, isComplementResult] = this.getVisualResult(
      operationResults,
      isThereSignalBit,
      isNumInputModified,
      architecturalSize.fractionalPart ? architecturalSize.integerPart * 2 : 0
    );

    operationResults.results[operationResults.results.length - 1].visualResult =
      visualResult;

    const TFN = this.getTFN(
      isDecimalResult,
      operationResults.results[0].diagnostic,
      visualResult
    );

    const data: RenderData = {
      id: SectionValues.BINARY_ARITHMETIC,
      architecturalSize,
      operationResults,
      isNumInputModified,
      isThereSignalBit,
      inverseTFNs,
      inDecimalOperationResults,
      TFN,
      isComplementResult,
    };

    return data;
  }

  private getBinNums(
    num1Input: NumWithComplement,
    num2Input: NumWithComplement,
    architecturalSize: ArchitectureSize,
    isThereSignalBit: boolean,
    isNumInputModified: boolean,
    inverseTFN: InverseTFN[],
    inDecimalOperationResults: InDecimalOperationResult[]
  ): [NumTwoParts, NumTwoParts] {
    if (
      !(typeof num1Input.num === "string") ||
      !(typeof num2Input.num === "string")
    )
      throw new Error("The number is not a string");

    const fractionalPartSize = isNumInputModified
      ? architecturalSize.fractionalPart * 2
      : architecturalSize.fractionalPart;

    const num1InverseTFN = this.getInverseTFN(
      num1Input.num,
      fractionalPartSize
    );

    num1InverseTFN.originalNum = num1Input.isComplement
      ? `-${num1InverseTFN.originalNum}`
      : num1InverseTFN.originalNum;

    const num2InverseTFN = this.getInverseTFN(
      num2Input.num,
      fractionalPartSize
    );

    num2InverseTFN.originalNum = num2Input.isComplement
      ? `-${num2InverseTFN.originalNum}`
      : num2InverseTFN.originalNum;

    const additionalString = isThereSignalBit ? "0" : "";

    const [num1TwoParts, num1CommaPosition] = this.getNum(
      additionalString + num1InverseTFN.convertedNumber,
      architecturalSize,
      isNumInputModified,
      false,
      num1Input.isComplement,
      inDecimalOperationResults
    );

    const [num2TwoParts, num2CommaPosition] = this.getNum(
      additionalString + num2InverseTFN.convertedNumber,
      architecturalSize,
      isNumInputModified,
      false,
      num2Input.isComplement,
      inDecimalOperationResults
    );

    num1InverseTFN.convertedNumber = this.getConvertedNum(
      num1TwoParts,
      num1CommaPosition
    );

    num2InverseTFN.convertedNumber = this.getConvertedNum(
      num2TwoParts,
      num2CommaPosition
    );

    inverseTFN.push(...[num1InverseTFN, num2InverseTFN]);

    if (!isNumInputModified) {
      num1TwoParts.partOne = num1InverseTFN.convertedNumber;
      num2TwoParts.partOne = num2InverseTFN.convertedNumber;
    }

    return [num1TwoParts, num2TwoParts];
  }

  private getInverseTFN(
    num: string,
    architecturalFractionalPart: number
  ): InverseTFN {
    const inverseTFN = getNumberConvertedToKnownBases(
      10,
      num,
      architecturalFractionalPart
    ).find((knownBase) => knownBase.id === NumberingSystemsMethods.INVERSE_TFN);

    if (!inverseTFN)
      throw new Error(`It was not possible to convert ${num} with Inverse TFN`);

    return inverseTFN;
  }

  private getNum(
    num: string,
    architecturalSize: ArchitectureSize,
    isNumInputModified: boolean,
    isBinNegative: boolean,
    isComplement?: boolean,
    inDecimalOperationResults?: InDecimalOperationResult[]
  ): [NumTwoParts, number] {
    let { integerPart, fractionalPart } = getIntegerFractionalParts(
      num,
      architecturalSize.fractionalPart ? true : false
    );

    const multiplier = isNumInputModified ? 2 : 1;

    integerPart = integerPart.padStart(
      architecturalSize.integerPart * multiplier,
      isBinNegative ? "1" : "0"
    );

    fractionalPart = fractionalPart
      ? fractionalPart.padEnd(
          architecturalSize.fractionalPart * multiplier,
          "0"
        )
      : null;

    num = fractionalPart ? integerPart + "," + fractionalPart : integerPart;

    if (integerPart.length > architecturalSize.integerPart)
      num = fractionalPart
        ? integerPart.slice(0, architecturalSize.integerPart * multiplier) +
          "," +
          fractionalPart
        : integerPart.slice(0, architecturalSize.integerPart * multiplier);

    const commaPosition = num.indexOf(",") !== -1 ? num.indexOf(",") : 0;

    num = num.replace(",", "");

    if (isComplement)
      num = this.getNumComplement(
        num,
        inDecimalOperationResults as InDecimalOperationResult[]
      );

    const numTwoParts: NumTwoParts = {
      partOne: num.slice(0, architecturalSize.total),
      partTwo: num.slice(architecturalSize.total),
    };

    return [numTwoParts, commaPosition];
  }

  private getConvertedNum(
    numTwoParts: NumTwoParts,
    commaPosition: number
  ): string {
    if (numTwoParts.partTwo.length)
      if (commaPosition) return numTwoParts.partOne + "," + numTwoParts.partTwo;
      else return numTwoParts.partOne + numTwoParts.partTwo;

    if (commaPosition)
      return getNumWithComma(numTwoParts.partOne, commaPosition);

    return numTwoParts.partOne;
  }

  private getNumComplement(
    num: string,
    inDecimalOperationResults: InDecimalOperationResult[]
  ) {
    const [numComplement, operationResult] =
      this.getComplementOperationForInDecimalOperation(num);
    inDecimalOperationResults.push({
      originalNum: num,
      operation: operationResult,
    });
    return numComplement;
  }

  private getComplementOperationForInDecimalOperation(
    num: string
  ): [string, OperationResult] {
    const numCommaPosition = num.indexOf(",");
    const operationResult = this.getComplementResult(
      num.replace(",", ""),
      numCommaPosition
    );

    const numComplement = operationResult.visualResult;

    return [numComplement, operationResult];
  }

  private getNumPartsWithComplement(
    num: string,
    architecturalFractionalPart: number,
    isComplement: boolean
  ) {
    return {
      num: getIntegerFractionalParts(
        num,
        architecturalFractionalPart ? true : false
      ),
      isComplement: isComplement,
    };
  }

  private getVisualResult(
    operationResults: OperationResults,
    isThereSignalBit: boolean,
    isNumInputModified: boolean,
    twoPartsCommaPosition: number
  ): [string, boolean] {
    const lastOperationResults =
      operationResults.id === OperationsValues.DIV
        ? operationResults.results[0]
        : operationResults.results[operationResults.results.length - 1];
    const secondToLastOperationResults =
      operationResults.id === OperationsValues.SUB
        ? operationResults.results[operationResults.results.length - 3]
        : operationResults.results[operationResults.results.length - 2];

    if (isNumInputModified) {
      lastOperationResults.visualResult =
        lastOperationResults.visualResult.replace(",", "");
      secondToLastOperationResults.visualResult =
        secondToLastOperationResults.visualResult.replace(",", "");
    }
    let isComplementResult = false;
    let visualResult = isNumInputModified
      ? getNumWithComma(
          lastOperationResults.visualResult +
            secondToLastOperationResults.visualResult,
          twoPartsCommaPosition
        )
      : lastOperationResults.visualResult;

    operationResults.results[operationResults.results.length - 1].visualResult =
      visualResult;

    const commaPosition = visualResult.indexOf(",");

    if (isThereSignalBit && visualResult[0] === "1") {
      operationResults.results.push(
        this.getComplementResult(visualResult.replace(",", ""), commaPosition)
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
    )
      visualResult = getNumWithComma(visualResult, commaPosition);

    return [visualResult, isComplementResult];
  }

  private getTFN(
    isDecimalResult: boolean,
    diagnostic: Diagnostic,
    visualResult: string
  ) {
    let TFN: TFN | "NaN" | undefined = undefined;
    if (isDecimalResult) {
      TFN =
        diagnostic !== "NaN"
          ? getNumberConvertedToKnownBases(2, visualResult).find(
              (knownBase) => knownBase.id === NumberingSystemsMethods.TFN
            )
          : "NaN";

      if (!TFN) throw new Error("It was not possible to convert with TFN");

      return TFN;
    }
  }
}
