import { ArchitecturesForNumberParts } from "../enums/ArchitecturesForNumberParts";
import { OperationsValues } from "../enums/OperationsValues";
import ArchitectureSize from "../types/ArchitectureSize";
import NumParts from "../types/NumParts";
import NumTwoParts from "../types/NumTwoParts";
import NumWithComplement from "../types/NumWithComplement";
import OperationResults, {
  Diagnostic,
  OperationResult,
} from "../types/OperationResult";
import getNumWithComma from "../utils/getNumWithComma";

export default class BinaryArithmetic {
  private architectureSize: ArchitectureSize | null = null;
  public operations = Object.values(OperationsValues);

  public architectureForNumberPart = Object.values(ArchitecturesForNumberParts);

  public getComplementResult(
    num: string,
    commaPosition?: number
  ): OperationResult {
    const inverseNumber = num
      .split("")
      .map((digit) => {
        if (digit === "0") return "1";
        else return "0";
      })
      .join("");

    const oneMore = this.getNumPartsMagnitudeCorrection(
      { num: { integerPart: "1", fractionalPart: null }, isComplement: false },
      { total: num.length, integerPart: num.length, fractionalPart: 0 }
    );
    const numComplement = this.getAdditionResult(
      inverseNumber,
      oneMore.integerPart,
      true,
      "",
      false,
      false,
      commaPosition
    );

    if (numComplement.id !== OperationsValues.ADD) throw new Error();

    return { ...numComplement, isComplement: true };
  }

  public getOperationResult(
    architecturalSizeInput: ArchitectureSize,
    operationSelector: OperationsValues,
    num1PartsInput: NumWithComplement,
    num2PartsInput: NumWithComplement,
    isThereSignalBit: boolean,
    num1TwoParts?: NumTwoParts,
    num2TwoParts?: NumTwoParts
  ) {
    this.architectureSize = architecturalSizeInput;
    const num1PartsCorrected = this.getNumPartsMagnitudeCorrection(
      num1PartsInput,
      architecturalSizeInput,
      isThereSignalBit
    );
    const num2PartsCorrected = this.getNumPartsMagnitudeCorrection(
      num2PartsInput,
      architecturalSizeInput,
      isThereSignalBit
    );

    const num1Full = num1PartsCorrected.fractionalPart
      ? num1PartsCorrected.integerPart + num1PartsCorrected.fractionalPart
      : num1PartsCorrected.integerPart;

    const num2Full = num2PartsCorrected.fractionalPart
      ? num2PartsCorrected.integerPart + num2PartsCorrected.fractionalPart
      : num2PartsCorrected.integerPart;

    let operationResults: OperationResults;

    const num1 = num1TwoParts ? num1TwoParts.partTwo : num1Full;
    const num2 = num2TwoParts ? num2TwoParts.partTwo : num2Full;
    const num3 = num1TwoParts ? num1TwoParts.partOne : null;
    const num4 = num2TwoParts ? num2TwoParts.partOne : null;
    let operation: OperationResult;
    let lastCarry = "0";
    switch (operationSelector) {
      case OperationsValues.ADD:
        operation = this.getAdditionResult(num1, num2, isThereSignalBit);
        if (operation.id === OperationsValues.ADD)
          lastCarry = operation.carries[0];
        operationResults = {
          id: OperationsValues.ADD,
          signal: "+",
          registers: [num1, num4 ? num4 : num2, num3, num4],
          results: [operation],
        };
        if (num3 && num4)
          operationResults.results.push(
            this.getAdditionResult(num3, num4, isThereSignalBit, lastCarry)
          );
        break;

      case OperationsValues.SUB:
        operationResults = {
          id: OperationsValues.SUB,
          signal: "-",
          registers: [num1Full, num2Full, null, null],
          results: this.getSubtractionResults(num1Full, num2Full),
        };
        break;

      case OperationsValues.MUL:
        operationResults = {
          id: OperationsValues.MUL,
          signal: "x",
          registers: [num1Full, num2Full, null, null],
          results: this.getMultiplicationResults(
            num1PartsCorrected,
            num2PartsCorrected,
            num1Full,
            num2Full
          ),
        };
        break;

      case OperationsValues.DIV:
        operationResults = {
          id: OperationsValues.DIV,
          signal: "÷",
          registers: [num1Full, num2Full, null, null],
          results: this.getDivisionResults(num1Full, num2Full),
        };
        break;

      default:
        throw new Error("Invalid Operation Selector");
    }
    return operationResults;
  }

  private getNumPartsMagnitudeCorrection(
    numInput: NumWithComplement,
    architecturalSize: ArchitectureSize,
    isThereSignalBit?: boolean
  ): NumParts {
    const num = numInput.num as NumParts;
    const isComplement = numInput.isComplement;

    let remainingZeros: number;
    if (num.integerPart.length < architecturalSize.integerPart) {
      remainingZeros = architecturalSize.integerPart - num.integerPart.length;

      num.integerPart = num.integerPart.padStart(
        num.integerPart.length + remainingZeros,
        isComplement ? "1" : "0"
      );
    }
    if (isThereSignalBit) {
      if (isComplement && num.integerPart[0] === "0") {
        alert("Complemento do Número tem bit de maior magnitude 0");
        throw new Error(
          "Number Complement has the bit with the highest magnitude 0"
        );
      }

      if (!isComplement && num.integerPart[0] === "1") {
        alert("Número, sem ser complemento, tem bit de maior magnitude 1");
        throw new Error(
          "Number, without being complementary, has bit of greater magnitude 1"
        );
      }
    }

    if (
      num.fractionalPart &&
      num.fractionalPart.length < architecturalSize.fractionalPart
    ) {
      remainingZeros =
        architecturalSize.fractionalPart - num.fractionalPart.length;

      num.fractionalPart = num.fractionalPart.padEnd(
        num.fractionalPart.length + remainingZeros,
        "0"
      );
    }

    const numPartsMagnitudeCorrection = num;

    return numPartsMagnitudeCorrection;
  }

  private getAdditionResult(
    num1: string,
    num2: string,
    isThereSignalBit: boolean,
    firstCarry?: string,
    isPartialProduct: boolean = false,
    isPartialRest: boolean = false,
    commaPosition?: number
  ): OperationResult {
    const sums: string[] = [];
    const carriesArr: string[] = firstCarry
      ? firstCarry.length
        ? [firstCarry]
        : ["0"]
      : ["0"];

    for (let i = num1.length - 1; i >= 0; i--)
      this.addUp(num1.at(i), num2.at(i), carriesArr, sums);

    console.log(sums, carriesArr);
    const registerResult = sums.join("");
    const visualResult = this.getVisualResult(registerResult, commaPosition);
    const carries = carriesArr.join("");

    let diagnostic: Diagnostic = "OK";

    if (isThereSignalBit) {
      if (carriesArr[0] !== carriesArr[1])
        if (Number(registerResult)) diagnostic = "OVERFLOW";
        else diagnostic = "UNDERFLOW";
    } else if (Number(carriesArr[0])) diagnostic = "OVERFLOW";

    return {
      id: OperationsValues.ADD,
      signal: "+",
      leftOperand: num1,
      rightOperand: num2,
      registerResult,
      visualResult,
      carries,
      diagnostic,
      isComplement: false,
      isPartialProduct,
      isPartialRest,
    };
  }

  private addUp(
    rightParcel: string | undefined,
    leftParcel: string | undefined,
    carriesArr: string[],
    sums: string[]
  ) {
    let carry = carriesArr[0];
    if (!rightParcel || !leftParcel) throw new Error("Undefined Parcels");

    let sum = (
      Number(rightParcel) +
      Number(leftParcel) +
      Number(carry)
    ).toString();

    switch (sum) {
      case "2":
        sum = "0";
        carry = "1";
        break;

      case "3":
        sum = "1";
        carry = "1";
        break;

      default:
        carry = "0";
        break;
    }

    sums.unshift(sum);
    carriesArr.unshift(carry);
  }

  private getSubtractionResults(
    num1: string,
    num2: string,
    isPartialRest: boolean = false
  ): OperationResult[] {
    const complementResult = this.getComplementResult(num2);
    const num2Complement = complementResult.registerResult;
    const additionResult = this.getAdditionResult(
      num1,
      num2Complement,
      true,
      "",
      false,
      isPartialRest
    );
    return [complementResult, additionResult];
  }

  private getMultiplicationResults(
    num1Parts: NumParts,
    num2Parts: NumParts,
    num1: string,
    num2: string
  ) {
    const isReversed = num1[0] === "0" && num2[0] === "1";
    const isDoubleNegative = num1[0] === "1" && num2[0] === "1";

    let diagnostic: Diagnostic = "OK";
    const num1IntegerPartPositive =
      num1Parts.integerPart[0] === "1"
        ? this.getComplementResult(num1Parts.integerPart).registerResult
        : num1Parts.integerPart;
    const num1PartsLength = {
      integerPart:
        Number(num1IntegerPartPositive) !== 0
          ? Number(num1IntegerPartPositive).toString().length
          : 0,
      fractionalPart:
        Number(
          num1Parts.fractionalPart
            ? num1Parts.fractionalPart.split("").reverse().join("")
            : ""
        ) !== 0
          ? Number(
              num1Parts.fractionalPart
                ? num1Parts.fractionalPart.split("").reverse().join("")
                : ""
            ).toString().length
          : 0,
    };
    const num2IntegerPartPositive =
      num2Parts.integerPart[0] === "1"
        ? this.getComplementResult(num2Parts.integerPart).registerResult
        : num2Parts.integerPart;
    const num2PartsLength = {
      integerPart:
        Number(num2IntegerPartPositive) !== 0
          ? Number(num2IntegerPartPositive).toString().length
          : 0,
      fractionalPart:
        Number(
          num2Parts.fractionalPart
            ? num2Parts.fractionalPart.split("").reverse().join("")
            : ""
        ) !== 0
          ? Number(
              num2Parts.fractionalPart
                ? num2Parts.fractionalPart.split("").reverse().join("")
                : ""
            ).toString().length
          : 0,
    };

    if (
      this.architectureSize &&
      (this.architectureSize.integerPart <=
        num1PartsLength.integerPart + num2PartsLength.integerPart ||
        (this.architectureSize.fractionalPart
          ? this.architectureSize.fractionalPart <
            num1PartsLength.fractionalPart + num2PartsLength.fractionalPart
          : false)) &&
      !(
        Number(
          num1IntegerPartPositive + num1Parts.fractionalPart
            ? num1Parts.fractionalPart
            : ""
        ) === 1 ||
        Number(
          num2IntegerPartPositive + num2Parts.fractionalPart
            ? num2Parts.fractionalPart
            : ""
        ) === 1
      )
    )
      diagnostic = "OVERFLOW";

    if (isReversed) {
      const temp = num1;
      num1 = num2;
      num2 = temp;
    }

    let partialProducts: string[] = [];

    for (let i = num2.length - 1; i >= 0; i--) {
      const digit = Number(num2[i]);
      let res: string;
      if (i == 0 && isDoubleNegative)
        res = this.getComplementResult(num1).registerResult;
      else if (digit) {
        res = num1;
      } else
        res = num1
          .split("")
          .map(() => "0")
          .join("");

      const partialProduct = res.padEnd(num1.length + num2.length - 1 - i, "0");

      partialProducts.push(partialProduct);
    }

    const lastPartialProductLength =
      partialProducts[partialProducts.length - 1].length;

    partialProducts = partialProducts.map((partialProduct) =>
      partialProduct.padStart(
        lastPartialProductLength,
        partialProduct[0] === "0" ? "0" : "1"
      )
    );

    const operationResults: OperationResult[] = [
      {
        id: OperationsValues.MUL,
        signal: "x",
        diagnostic,
        partialProducts,
        isReversed,
        registerResult: partialProducts[0],
        visualResult: this.getVisualResult(partialProducts[0]),
      },
    ];

    if (partialProducts[1]) {
      operationResults.push(
        this.getAdditionResult(
          partialProducts[0],
          partialProducts[1],
          true,
          "",
          true
        )
      );

      for (let i = 2; i < partialProducts.length; i++) {
        operationResults.push(
          this.getAdditionResult(
            operationResults[i - 1].registerResult,
            partialProducts[i],
            true,
            "",
            true
          )
        );
      }

      const lastRegisterResult =
        operationResults[operationResults.length - 1].registerResult;
      if (this.architectureSize) {
        const shifts = this.architectureSize.fractionalPart;
        const integerPart = lastRegisterResult.slice(0, -(shifts * 2));
        const fractionalPart = shifts
          ? lastRegisterResult.slice(-(shifts * 2))
          : "";

        const lastVisualResult = fractionalPart.length
          ? integerPart.slice(-this.architectureSize.integerPart) +
            "," +
            fractionalPart.slice(0, this.architectureSize.fractionalPart)
          : lastRegisterResult.slice(-this.architectureSize.integerPart);

        operationResults[operationResults.length - 1].visualResult =
          lastVisualResult;
      }
    }

    return operationResults;
  }

  private getDivisionResults(num1: string, num2: string) {
    const isNegativeResult = num1[0] !== num2[0];

    const operationResults: OperationResult[] = [
      {
        id: OperationsValues.DIV,
        signal: "÷",
        diagnostic: "NaN",
        leftSide: [],
        nums: { num1: "", num2: "" },
        isNegativeResult,
        complementsOf: [],
        registerResult: "NaN",
        visualResult: "NaN",
      },
    ];

    if (!Number(num2)) return operationResults;

    operationResults[0].diagnostic = "OK";

    const quotients: string[] = [];

    let num1Positive = num1;
    let num2Positive = num2;

    if (num1Positive[0] === "1") {
      if (operationResults[0].id === OperationsValues.DIV)
        operationResults[0].complementsOf.push(num1Positive);
      const complementResult = this.getComplementResult(num1Positive);
      operationResults.push(complementResult);
      num1Positive = complementResult.registerResult;
    }

    if (num2Positive[0] === "1") {
      if (operationResults[0].id === OperationsValues.DIV)
        operationResults[0].complementsOf.push(num2Positive);
      const complementResult = this.getComplementResult(num2Positive);
      operationResults.push(complementResult);
      num2Positive = complementResult.registerResult;
    }

    const num1SignificantBits = "0" + Number(num1Positive).toString();
    const num2SignificantBits = "0" + Number(num2Positive).toString();

    let num1Modified = num1SignificantBits;
    let isInteger = true;

    if (num1Modified.length < num2SignificantBits.length) {
      num1Modified = num1Modified.padEnd(num1Modified.length + 1, "0");
      quotients.push(...["0", ","]);
      isInteger = false;
    }

    while (num1Modified.length < num2SignificantBits.length) {
      num1Modified = num1Modified.padEnd(num1Modified.length + 1, "0");
      quotients.push("0");
    }

    const restLeftOperand = num1Modified
      .slice(num2SignificantBits.length)
      .split("");
    const leftOperands: string[] = [
      num1Modified.slice(0, num2SignificantBits.length),
    ];
    const leftSide: { id: "subtraction" | "leftOperand"; value: string }[] = [];

    if (operationResults[0].id === OperationsValues.DIV)
      operationResults[0].complementsOf.push(num1SignificantBits);
    let wasItSubtraction = true;
    let doAlreadyGotComplement = false;
    let fractionalPartLength = 0;
    do {
      if (
        Number(leftOperands[leftOperands.length - 1]) <
        Number(num2SignificantBits)
      ) {
        if (restLeftOperand.length) {
          leftOperands.push(
            leftOperands[leftOperands.length - 1] + restLeftOperand[0]
          );
          if (wasItSubtraction)
            leftSide.push({
              id: "leftOperand",
              value: leftOperands[leftOperands.length - 1],
            });
          else
            leftSide[leftSide.length - 1].value =
              leftOperands[leftOperands.length - 1];

          restLeftOperand.shift();
          if (
            Number(leftOperands[leftOperands.length - 1]) <
            Number(num2SignificantBits)
          )
            quotients.push("0");
          wasItSubtraction = false;
        } else {
          if (!this.architectureSize?.fractionalPart) break;
          const newLeftOperand = Number(
            leftOperands[leftOperands.length - 1] + "0"
          )
            .toString()
            .padStart(num1Modified.length, "0");
          leftOperands.push(newLeftOperand);
          if (
            !leftSide[leftSide.length - 1] ||
            leftSide[leftSide.length - 1].id === "subtraction"
          )
            leftSide.push({
              id: "leftOperand",
              value: leftOperands[leftOperands.length - 1],
            });
          else
            leftSide[leftSide.length - 1].value =
              leftOperands[leftOperands.length - 1];
          quotients.push(
            quotients.includes(",") ? "0" : quotients.length ? "," : "0,"
          );
          if (!(quotients.length - 1)) {
            quotients.push(...quotients[quotients.length - 1].split(""));
            quotients.shift();
          }
          isInteger = false;
          wasItSubtraction = false;
        }
      } else {
        quotients.push("1");
        leftSide.push({ id: "subtraction", value: `-${num2SignificantBits}` });
        const [leftOperand, num2] = this.getNumMagnitudeCorrection(
          leftOperands[leftOperands.length - 1],
          num2SignificantBits
        );
        const subtractionResults = this.getSubtractionResults(
          leftOperand,
          num2,
          true
        );
        if (doAlreadyGotComplement) subtractionResults.shift();
        operationResults.push(...subtractionResults);
        doAlreadyGotComplement = true;
        leftOperands.push(
          operationResults[operationResults.length - 1].registerResult
        );
        leftSide.push({
          id: "leftOperand",
          value: leftOperands[leftOperands.length - 1],
        });
        wasItSubtraction = true;
      }

      if (
        isInteger &&
        quotients.join("").length + 1 === this.architectureSize?.integerPart
      ) {
        operationResults[0].diagnostic = "OVERFLOW";
        break;
      }

      if (
        !isInteger &&
        fractionalPartLength === this.architectureSize?.fractionalPart
      )
        break;

      if (!isInteger) fractionalPartLength++;
    } while (
      Number(leftOperands[leftOperands.length - 1]) ||
      restLeftOperand.length
    );

    if (quotients[quotients.length - 1] === ",") quotients.pop();

    operationResults[0].registerResult = 0 + quotients.join("");

    if (this.architectureSize) {
      const quotientsString = quotients.join("");
      const commaPosition =
        quotientsString.indexOf(",") !== -1
          ? quotientsString.indexOf(",")
          : undefined;
      const firstHalf = quotientsString
        .slice(0, commaPosition)
        .padStart(this.architectureSize.integerPart, "0");
      const secondHalf = commaPosition
        ? quotientsString
            .replace(",", "")
            .slice(commaPosition)
            .padEnd(this.architectureSize.fractionalPart, "0")
        : "";
      operationResults[0].visualResult = secondHalf.length
        ? firstHalf + "," + secondHalf
        : firstHalf;
    }

    if (operationResults[0].id === OperationsValues.DIV) {
      operationResults[0].leftSide = leftSide;
      operationResults[0].nums = {
        num1: num1Modified,
        num2: num2SignificantBits,
      };
      operationResults[0].isNegativeResult = isNegativeResult;
    }

    return operationResults;
  }

  private getVisualResult(registerResult: string, commaPosition?: number) {
    if (commaPosition) {
      if (commaPosition === -1) return registerResult;
      return getNumWithComma(registerResult, commaPosition);
    }
    if (this.architectureSize) {
      const firstHalf = registerResult.slice(
        0,
        this.architectureSize.integerPart
      );
      const secondHalf = registerResult.slice(
        this.architectureSize.integerPart
      );
      return secondHalf ? firstHalf + "," + secondHalf : firstHalf;
    }
    throw new Error("Architecture size not defined");
  }

  private getNumMagnitudeCorrection(num1: string, num2: string) {
    const longerLength = num1.length > num2.length ? num1.length : num2.length;
    const num1MagnitudeCorrected = num1.padStart(longerLength, "0");
    const num2MagnitudeCorrected = num2.padStart(longerLength, "0");
    return [num1MagnitudeCorrected, num2MagnitudeCorrected];
  }
}
