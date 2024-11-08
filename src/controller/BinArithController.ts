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
  OperationResult,
} from "../types/OperationResult";
import RenderBinArithViewProps from "../types/RenderBinArithViewProps";
import { RenderData } from "../types/RenderData";
import checkNum from "../utils/checkNum";
import getIntegerFractionalParts from "../utils/getIntegerFractionalParts";
import getNumberConvertedToKnownBases from "../utils/getNumberConvertedToKnownBases";

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

    const inDecimalOperationResults: OperationResult[] = [];
    let num1TwoParts: NumTwoParts | undefined = undefined;
    let num2TwoParts: NumTwoParts | undefined = undefined;

    if (numInputType === "inDecimal") {
      const [num1TwoPartsCaught, num2TwoPartsCaught] = this.getBinNums(
        num1Input,
        num2Input,
        architecturalSize,
        isThereSignalBit,
        isNumInputModified,
        inDecimalOperationResults
      );

      num1Input.num = num1TwoPartsCaught.partOne;
      num2Input.num = num2TwoPartsCaught.partOne;

      if (
        Number(num1TwoPartsCaught.partTwo) &&
        Number(num2TwoPartsCaught.partTwo)
      ) {
        num1TwoParts = num1TwoPartsCaught;
        num2TwoParts = num2TwoPartsCaught;
      }
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
      isThereSignalBit
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
      isThereSignalBit,
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
    inDecimalOperationResults: OperationResult[]
  ): [NumTwoParts, NumTwoParts, OperationResult[]] {
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

    const num2InverseTFN = this.getInverseTFN(
      num2Input.num,
      fractionalPartSize
    );

    const additionalString = isThereSignalBit ? "0" : "";

    const num1TwoParts = this.getNum(
      additionalString + num1InverseTFN.convertedNumber,
      num1Input.isComplement,
      architecturalSize,
      isNumInputModified,
      inDecimalOperationResults
    );

    const num2TwoParts = this.getNum(
      additionalString + num2InverseTFN.convertedNumber,
      num2Input.isComplement,
      architecturalSize,
      isNumInputModified,
      inDecimalOperationResults
    );

    return [num1TwoParts, num2TwoParts, inDecimalOperationResults];
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
    isComplement: boolean,
    architecturalSize: ArchitectureSize,
    isNumInputModified: boolean,
    inDecimalOperationResults: OperationResult[]
  ): NumTwoParts {
    let { integerPart, fractionalPart } = getIntegerFractionalParts(
      num,
      num.includes(",")
    );

    if (isNumInputModified) {
      integerPart = integerPart.padStart(
        architecturalSize.integerPart * 2,
        "0"
      );
      fractionalPart = fractionalPart
        ? fractionalPart.padEnd(architecturalSize.fractionalPart * 2, "0")
        : null;
    }

    const multiplier = isNumInputModified ? 2 : 1;

    if (integerPart.length > architecturalSize.integerPart)
      num = fractionalPart
        ? integerPart.slice(0, architecturalSize.integerPart * multiplier) +
          fractionalPart
        : integerPart.slice(0, architecturalSize.integerPart * multiplier);

    if (isComplement)
      num = this.getNumComplement(num, inDecimalOperationResults);

    const numTwoParts: NumTwoParts = {
      partOne: num.slice(0, architecturalSize.total),
      partTwo: num.slice(architecturalSize.total),
    };

    return numTwoParts;
  }

  private getNumComplement(
    num: string,
    inDecimalOperationResults: OperationResult[]
  ) {
    const [numComplement, operationResult] =
      this.getComplementOperationForInDecimalOperation(num);
    inDecimalOperationResults.push(operationResult);
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

  // private operation({
  //   architecturalSize,
  //   operationSelector,
  //   num1Input,
  //   num2Input,
  //   isThereSignalBit,
  //   num1TwoParts,
  //   num2TwoParts,
  // }: RenderBinArithViewPropsExtends) {
  //   if (
  //     !(typeof num1Input.num === "string") ||
  //     !(typeof num2Input.num === "string")
  //   )
  //     throw new Error("The number is not a string");

  //     num1Input.num = checkNum(num1Input.num);
  //     num2Input.num = checkNum(num2Input.num);

  //     const num1PartsInput = this.getNumPartsWithComplement(
  //       num1Input.num,
  //       architecturalSize.fractionalPart,
  //       num1Input.isComplement
  //     );

  //     const num2PartsInput = this.getNumPartsWithComplement(
  //       num2Input.num,
  //       architecturalSize.fractionalPart,
  //       num2Input.isComplement
  //     );

  //     const operationResults = this.binaryArithmetic.getOperationResult(
  //       architecturalSize,
  //       operationSelector,
  //       num1PartsInput,
  //       num2PartsInput,
  //       isThereSignalBit,
  //       num1TwoParts,
  //       num2TwoParts
  //     );

  //     const [visualResult, isComplementResult] = this.getVisualResult(
  //       operationResults,
  //       isThereSignalBit
  //     );

  //     operationResults.results[operationResults.results.length - 1].visualResult =
  //       visualResult;
  //   return { operationResults, visualResult, isComplementResult };
  // }

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
    isThereSignalBit: boolean
  ): [string, boolean] {
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
