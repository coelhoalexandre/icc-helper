import { ArchitecturesForNumberParts } from "../enums/ArchitecturesForNumberParts";
import { OperationsValues } from "../enums/OperationsValues";
import ArchitectureSize from "../types/ArchitectureSize";
import NumParts from "../types/NumParts";
import NumWithComplement from "../types/NumWithComplement";
import OperationResults, {
  Diagnostic,
  OperationResult,
} from "../types/OperationResult";

export default class BinaryArithmetic {
  private architectureSize: ArchitectureSize | null = null;
  public operations = Object.values(OperationsValues);

  public architectureForNumberPart = Object.values(ArchitecturesForNumberParts);

  public getComplementResult(num: string): OperationResult {
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
      true
    );

    if (numComplement.id !== OperationsValues.ADD) throw new Error();

    console.log(numComplement);

    return { ...numComplement, isComplement: true };
  }

  public getOperationResult(
    architecturalSizeInput: ArchitectureSize,
    operationSelector: OperationsValues,
    num1PartsInput: NumWithComplement,
    num2PartsInput: NumWithComplement,
    isThereSignalBit: boolean
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

    switch (operationSelector) {
      case OperationsValues.ADD:
        operationResults = {
          id: OperationsValues.ADD,
          signal: "+",
          register1: num1Full,
          register2: num2Full,
          results: [
            this.getAdditionResult(num1Full, num2Full, isThereSignalBit),
          ],
        };
        break;

      case OperationsValues.SUB:
        operationResults = {
          id: OperationsValues.SUB,
          signal: "-",
          register1: num1Full,
          register2: num2Full,
          results: this.getSubtractionResults(num1Full, num2Full),
        };
        break;

      case OperationsValues.MUL:
        operationResults = {
          id: OperationsValues.MUL,
          signal: "x",
          register1: num1Full,
          register2: num2Full,
          results: [
            {
              id: OperationsValues.MUL,
              registerResult: "",
              visualResult: "",
              diagnostic: "OK",
              signal: "x",
            },
          ],
        };
        break;

      case OperationsValues.DIV:
        operationResults = {
          id: OperationsValues.DIV,
          signal: "÷",

          register1: num1Full,
          register2: num2Full,
          results: [
            {
              id: OperationsValues.DIV,
              registerResult: "",
              visualResult: "",
              diagnostic: "OK",
              signal: "÷",
            },
          ],
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
    isThereSignalBit: boolean
  ): OperationResult {
    const sums: string[] = [];
    const carriesArr: string[] = ["0"];

    for (let i = num1.length - 1; i >= 0; i--) {
      const rightParcel = num1.at(i);
      const leftParcel = num2.at(i);
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

    const registerResult = sums.join("");
    const visualResult = this.getVisualResult(registerResult);
    const carries = carriesArr.join("");

    let diagnostic: Diagnostic = "OK";

    if (isThereSignalBit) {
      if (carriesArr[0] !== carriesArr[1]) diagnostic = "OVERFLOW";
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
    };
  }

  private getSubtractionResults(num1: string, num2: string): OperationResult[] {
    const complementResult = this.getComplementResult(num2);
    const num2Complement = complementResult.registerResult;
    const additionResult = this.getAdditionResult(num1, num2Complement, true);
    return [complementResult, additionResult];
  }

  private getVisualResult(registerResult: string) {
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
}
