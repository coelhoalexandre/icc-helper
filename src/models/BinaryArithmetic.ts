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
          results: this.getMultiplicationResults(
            num1Full,
            num2Full,
            isThereSignalBit
          ),
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
    isThereSignalBit: boolean,
    isPartialProduct: boolean = false
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
    };
  }

  private getSubtractionResults(num1: string, num2: string): OperationResult[] {
    const complementResult = this.getComplementResult(num2);
    const num2Complement = complementResult.registerResult;
    const additionResult = this.getAdditionResult(num1, num2Complement, true);
    return [complementResult, additionResult];
  }

  private getMultiplicationResults(
    num1: string,
    num2: string,
    isThereSignalBit: boolean
  ) {
    const num1Number = isThereSignalBit
      ? num1[0] === "1"
        ? Number(this.getComplementResult(num1).registerResult)
        : Number(num1)
      : Number(num1);
    const num2Number = isThereSignalBit
      ? num2[0] === "1"
        ? Number(this.getComplementResult(num2).registerResult)
        : Number(num2)
      : Number(num2);

    const num1SignificantBits = num1Number.toString().length;
    const num2SignificantBits = num2Number.toString().length;
    const isReversed = isThereSignalBit && num1[0] === "0" && num2[0] === "1";
    const isDoubleNegative =
      isThereSignalBit && num1[0] === "1" && num2[0] === "1";

    let diagnostic: Diagnostic = "OK";
    if (
      this.architectureSize &&
      this.architectureSize.total < num1SignificantBits + num2SignificantBits &&
      !(num1Number === 1 || num2Number === 1)
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
          isThereSignalBit,
          true
        )
      );

      for (let i = 2; i < partialProducts.length; i++) {
        operationResults.push(
          this.getAdditionResult(
            operationResults[i - 1].registerResult,
            partialProducts[i],
            isThereSignalBit,
            true
          )
        );
      }

      const lastRegisterResult =
        operationResults[operationResults.length - 1].registerResult;
      if (this.architectureSize) {
        const excess = -(
          this.architectureSize.total - lastRegisterResult.length
        );

        const lastVisualResult = this.getVisualResult(
          lastRegisterResult.slice(excess)
        );

        operationResults[operationResults.length - 1].visualResult =
          lastVisualResult;
      }
    }

    return operationResults;
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
