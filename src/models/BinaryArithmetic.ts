import { ArchitecturesForNumberParts } from "../enums/ArchitecturesForNumberParts";
import { OperationsValues } from "../enums/OperationsValues";
import ArchitectureSize from "../types/ArchitectureSize";
import NumParts from "../types/NumParts";
import { Diagnostic, OperationResult } from "../types/OperationResult";

export default class BinaryArithmetic {
  private architectureSize: ArchitectureSize | null = null;
  public operations = Object.values(OperationsValues);

  public architectureForNumberPart = Object.values(ArchitecturesForNumberParts);

  public getOperationResult(
    architecturalSizeInput: ArchitectureSize,
    operationSelector: OperationsValues,
    num1PartsInput: NumParts,
    num2PartsInput: NumParts
  ) {
    this.architectureSize = architecturalSizeInput;
    const num1PartsCorrected = this.getNumPartsMagnitudeCorrection(
      num1PartsInput,
      architecturalSizeInput
    );
    const num2PartsCorrected = this.getNumPartsMagnitudeCorrection(
      num2PartsInput,
      architecturalSizeInput
    );

    const num1Full = num1PartsCorrected.fractionalPart
      ? num1PartsCorrected.integerPart + num1PartsCorrected.fractionalPart
      : num1PartsCorrected.integerPart;

    const num2Full = num2PartsCorrected.fractionalPart
      ? num2PartsCorrected.integerPart + num2PartsCorrected.fractionalPart
      : num2PartsCorrected.integerPart;

    let operationResult: OperationResult;

    switch (operationSelector) {
      case OperationsValues.ADD:
        operationResult = {
          id: OperationsValues.ADD,
          signal: "+",
          ...this.getAdditionResult(
            num1Full,
            num2Full,
            architecturalSizeInput.total
          ),
        };
        break;

      case OperationsValues.SUB:
        operationResult = {
          id: OperationsValues.SUB,
          num1: "",
          num2: "",
          registerResult: "",
          visualResult: "",
          diagnostic: "OK",
          signal: "-",
        };
        break;

      case OperationsValues.MUL:
        operationResult = {
          id: OperationsValues.MUL,
          num1: "",
          num2: "",
          registerResult: "",
          visualResult: "",
          diagnostic: "OK",
          signal: "x",
        };
        break;

      case OperationsValues.DIV:
        operationResult = {
          id: OperationsValues.DIV,
          num1: "",
          num2: "",
          registerResult: "",
          visualResult: "",
          diagnostic: "OK",
          signal: "÷",
        };
        break;

      default:
        throw new Error("Invalid Operation Selector");
    }
    return operationResult;
  }

  private getNumPartsMagnitudeCorrection(
    num: NumParts,
    architecturalSize: ArchitectureSize
  ): NumParts {
    let remainingZeros: number;
    if (num.integerPart.length < architecturalSize.integerPart) {
      remainingZeros = architecturalSize.integerPart - num.integerPart.length;

      num.integerPart = num.integerPart.padStart(
        num.integerPart.length + remainingZeros,
        "0"
      );
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
    architecturalSize: number
  ) {
    const sums: string[] = [];
    const carriesArr: string[] = ["0"];

    for (let i = architecturalSize - 1; i >= 0; i--) {
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
    if (Number(carriesArr[0])) diagnostic = "OVERFLOW";

    return {
      num1,
      num2,
      registerResult,
      visualResult,
      carries,
      diagnostic,
    };
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
