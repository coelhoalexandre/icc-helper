import { OperationsValues } from "../enums/OperationsValues";
import NumParts from "../types/NumParts";
import { OperationResult } from "../types/OperationResult";

export default class BinaryArithmetic {
  public getOperationResult(
    architecturalSizeInput: number,
    operationSelector: OperationsValues,
    num1PartsInput: NumParts,
    num2PartsInput: NumParts
  ) {
    const num1Full = num1PartsInput.fractionalPart
      ? num1PartsInput.integerPart + num1PartsInput.fractionalPart
      : num1PartsInput.integerPart;
    const num2Full = num2PartsInput.fractionalPart
      ? num2PartsInput.integerPart + num2PartsInput.fractionalPart
      : num2PartsInput.integerPart;

    const num1FullCorrected = this.getNumMagnitudeCorrection(
      num1Full,
      architecturalSizeInput
    );
    const num2FullCorrected = this.getNumMagnitudeCorrection(
      num2Full,
      architecturalSizeInput
    );
    console.log(
      architecturalSizeInput,
      operationSelector,
      num1PartsInput,
      num2PartsInput
    );

    let operationResult: OperationResult;

    switch (operationSelector) {
      case OperationsValues.SUM:
        operationResult = this.getSumResult(
          num1FullCorrected,
          num2FullCorrected,
          architecturalSizeInput
        );
        break;

      case OperationsValues.SUBTRACTION:
        operationResult = {
          id: OperationsValues.SUBTRACTION,
          operationResult: "",
        };
        break;

      case OperationsValues.MULTIPLICATION:
        operationResult = {
          id: OperationsValues.MULTIPLICATION,
          operationResult: "",
        };
        break;

      case OperationsValues.DIVISION:
        operationResult = {
          id: OperationsValues.MULTIPLICATION,
          operationResult: "",
        };
        break;

      default:
        throw new Error("Invalid Operation Selector");
    }
    return operationResult;
  }

  private getNumMagnitudeCorrection(
    num: string,
    architecturalSize: number
  ): string {
    if (num.length === architecturalSize) return num;

    const remainingZeros = architecturalSize - num.length;

    const numMagnitudeCorrection = num.padStart(
      num.length + remainingZeros,
      "0"
    );

    return numMagnitudeCorrection;
  }

  private getSumResult(num1: string, num2: string, architecturalSize: number) {
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

    const operationResult = sums.join("");
    const carries = carriesArr.join("");

    return { id: OperationsValues.SUM, operationResult, carries };
  }
}
