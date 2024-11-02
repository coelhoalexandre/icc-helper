import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import Aggregation from "../types/INumberingSystemsMethod/Aggregation";
import Disaggregation from "../types/INumberingSystemsMethod/Disaggregation";
import InverseTFN, {
  Divisions,
  Multiplications,
} from "../types/INumberingSystemsMethod/InverseTFN";
import { KnownBases } from "../types/KnownBases";
import NumParts from "../types/NumParts";
import TFN, { Parcel } from "../types/INumberingSystemsMethod/TFN";

export default class NumberingSystems {
  private symbols = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  public getNumInputPattern(baseInput: number): string {
    const regExComma = "?:,";

    if (baseInput <= 10) return `(${regExComma}|[0-${baseInput - 1}])*`;
    else
      return `(${regExComma}|[0-9${this.symbols[0]}-${
        this.symbols[baseInput - 11]
      }])*`;
  }

  public isNeedMaxNumDecPlaces(base: number): boolean {
    const basesThatNotNeed = [2, 4, 8, 16];
    if (basesThatNotNeed.includes(base)) return false;

    return true;
  }

  public getIntegerFractionalParts(
    num: string,
    isFractional?: boolean
  ): NumParts {
    const indexOfComma = num.indexOf(",");

    if (indexOfComma === -1) {
      if (!isFractional) return { integerPart: num, fractionalPart: null };
      else return { integerPart: num, fractionalPart: "0" };
    }

    const integerPart = num.slice(0, indexOfComma);
    const fractionalPart = num.slice(indexOfComma + 1);

    return { integerPart, fractionalPart };
  }

  getVerifiedNum = (num: string, includesCommaNumInput: boolean) => {
    const numInputUpperCase = num.toUpperCase();

    let verifiedNum = numInputUpperCase;

    if (includesCommaNumInput) {
      const numInputNoDot = verifiedNum.replace(".", ",");

      const numInputNoCommaStart = !numInputNoDot.indexOf(",")
        ? numInputNoDot.padStart(verifiedNum.length + 1, "0")
        : numInputNoDot;

      const numInputNoRepeatedCommas = numInputNoCommaStart
        .split("")
        .filter((char, i, arr) => char !== "," || arr.indexOf(char) === i)
        .join("");

      verifiedNum = numInputNoRepeatedCommas;
    }

    return verifiedNum;
  };

  public getNumberConvertedToKnownBases(
    baseInput: number,
    numInput: string,

    maxDecimalPlaces?: number
  ): KnownBases {
    let decimalNumber: TFN;

    let binaryNumber: Disaggregation | InverseTFN;

    let octalNumber: Aggregation;

    let hexaNumber: Aggregation;

    const { integerPart, fractionalPart } =
      this.getIntegerFractionalParts(numInput);

    switch (baseInput) {
      case 2:
        decimalNumber = this.TFN(2, { integerPart, fractionalPart });
        octalNumber = this.aggregation(8, { integerPart, fractionalPart });
        hexaNumber = this.aggregation(16, { integerPart, fractionalPart });
        return [decimalNumber, octalNumber, hexaNumber];
      case 4:
        binaryNumber = this.disaggregation(baseInput, {
          integerPart,
          fractionalPart,
        });
        decimalNumber = this.TFN(2, binaryNumber.numParts);
        octalNumber = this.aggregation(8, binaryNumber.numParts);
        hexaNumber = this.aggregation(16, binaryNumber.numParts);
        return [binaryNumber, decimalNumber, octalNumber, hexaNumber];
      case 8:
        binaryNumber = this.disaggregation(baseInput, {
          integerPart,
          fractionalPart,
        });
        decimalNumber = this.TFN(2, binaryNumber.numParts);
        hexaNumber = this.aggregation(16, binaryNumber.numParts);
        return [binaryNumber, decimalNumber, hexaNumber];
      case 10:
        binaryNumber = this.inverseTFN(
          2,
          { integerPart, fractionalPart },
          maxDecimalPlaces
        );
        octalNumber = this.aggregation(8, binaryNumber.numParts);
        hexaNumber = this.aggregation(16, binaryNumber.numParts);
        return [binaryNumber, octalNumber, hexaNumber];
      case 16:
        binaryNumber = this.disaggregation(baseInput, {
          integerPart,
          fractionalPart,
        });
        decimalNumber = this.TFN(2, binaryNumber.numParts);
        octalNumber = this.aggregation(8, binaryNumber.numParts);
        return [binaryNumber, decimalNumber, octalNumber];
      default:
        decimalNumber = this.TFN(
          baseInput,
          { integerPart, fractionalPart },
          maxDecimalPlaces
        );
        binaryNumber = this.inverseTFN(
          2,
          decimalNumber.numParts,
          maxDecimalPlaces
        );
        octalNumber = this.aggregation(8, binaryNumber.numParts);
        hexaNumber = this.aggregation(16, binaryNumber.numParts);
        return [decimalNumber, binaryNumber, octalNumber, hexaNumber];
    }
  }

  private TFN(
    base: number,
    { integerPart, fractionalPart }: NumParts,
    maxDecimalPlaces?: number
  ): TFN {
    const products: number[] = [];
    const parcels: Parcel[] = [];

    const resIntegerPart = this.getTFNResult(integerPart, base);

    products.push(...resIntegerPart.products);
    parcels.push(...resIntegerPart.parcels);

    const numParts: NumParts = {
      integerPart: resIntegerPart.products
        .reduce((acc, product) => (acc += product))
        .toString(),
      fractionalPart: null,
    };

    if (fractionalPart) {
      const resFractionalPart = this.getTFNResult(
        fractionalPart,
        base,
        false,
        maxDecimalPlaces
      );

      products.push(...resFractionalPart.products);
      parcels.push(...resFractionalPart.parcels);

      numParts.fractionalPart = resFractionalPart.products
        .reduce((acc, product) => (acc += product))
        .toString();
    }

    const convertedNumber = (
      Number(numParts.integerPart) + Number(numParts.fractionalPart)
    )
      .toString()
      .replace(".", ",");

    if (numParts.fractionalPart)
      numParts.fractionalPart = (
        Number(numParts.fractionalPart) *
        10 ** numParts.fractionalPart.length
      ).toString();

    return {
      id: NumberingSystemsMethods.TFN,
      targetBase: 10,
      numParts,
      convertedNumber,
      products,
      parcels,
    };
  }

  private inverseTFN(
    base: number,
    { integerPart, fractionalPart }: NumParts,
    maxDecimalPlaces?: number
  ): InverseTFN {
    const divisions: Divisions[] = [];

    const multiplications: Multiplications[] = [];

    let quotient = Number(integerPart);
    const divider = base;
    do {
      const dividend = quotient;
      quotient = Math.trunc(dividend / divider);
      const rest = dividend % divider;

      divisions.push({
        dividend,
        divider,
        quotient,
        rest,
      });
    } while (quotient > 0);

    const numParts: NumParts = {
      integerPart: divisions
        .map((division) => division.rest.toString())
        .reverse()
        .join(""),
      fractionalPart: null,
    };

    if (fractionalPart) {
      if (!maxDecimalPlaces)
        throw new Error(
          "Maximum number of decimal places has not been defined"
        );

      let decimalPlaces = 0;
      let rest = Number(fractionalPart) / 10 ** fractionalPart.length;

      const factorRight = base;
      do {
        const factorLeft = rest;
        rest = factorLeft * factorRight;
        const integer = Math.trunc(rest);
        const product = this.getIntegerFractionalParts(
          rest.toString().replace(".", ",")
        );

        rest = Number((rest - integer).toFixed(maxDecimalPlaces));

        multiplications.push({
          factorLeft,
          factorRight,
          product,
          integer,
          rest,
        });
        decimalPlaces++;
      } while (rest !== 0 && decimalPlaces < maxDecimalPlaces);

      numParts.fractionalPart = multiplications
        .map((multiplication) => multiplication.integer.toString())
        .join("");
    }

    const convertedNumber = numParts.fractionalPart
      ? numParts.integerPart + "," + numParts.fractionalPart
      : numParts.integerPart;

    return {
      id: NumberingSystemsMethods.INVERSE_TFN,
      targetBase: base,
      convertedNumber,
      numParts,
      divisions,
      multiplications,
    };
  }

  private aggregation(
    base: number,
    { integerPart, fractionalPart }: NumParts
  ): Aggregation {
    const isThereFractionalPart = fractionalPart ? true : false;
    const aggregations: string[] = [];
    const convertedAggregations: string[] = [];

    const aggregationOf = Math.log2(base);

    const resIntegerPart = this.getAggregationResult(
      integerPart,
      aggregationOf
    );

    aggregations.push(...resIntegerPart.aggregations);
    convertedAggregations.push(...resIntegerPart.convertedAggregations);

    if (isThereFractionalPart) {
      aggregations[aggregations.length - 1] += ",";
      convertedAggregations[convertedAggregations.length - 1] += ",";
    }

    let magnitudeCorrectedNumber = resIntegerPart.magnitudeCorrectedNumber;

    if (fractionalPart) {
      const resFractionalPart = this.getAggregationResult(
        fractionalPart,
        aggregationOf,
        false
      );

      aggregations.push(...resFractionalPart.aggregations);
      convertedAggregations.push(...resFractionalPart.convertedAggregations);

      magnitudeCorrectedNumber += `,${resFractionalPart.magnitudeCorrectedNumber}`;
    }

    const convertedNumber = convertedAggregations.join("");
    return {
      id: NumberingSystemsMethods.AGGREGATION,
      targetBase: base,
      convertedNumber,
      magnitudeCorrectedNumber,
      aggregations,
      convertedAggregations,
    };
  }

  private disaggregation(
    base: number,
    { integerPart, fractionalPart }: NumParts
  ): Disaggregation {
    const isThereFractionalPart = fractionalPart ? true : false;
    const digits: string[] = [];
    const disaggregations: string[] = [];

    const disaggregationOf = Math.log2(base);

    const resIntegerPart = this.getDisaggregationResult(
      integerPart,
      disaggregationOf
    );

    disaggregations.push(...resIntegerPart.disaggregations);
    digits.push(...resIntegerPart.digits);

    let convertedNumber = resIntegerPart.disaggregations.join("");

    if (isThereFractionalPart) {
      disaggregations[disaggregations.length - 1] += ",";
      digits[digits.length - 1] += ",";
      convertedNumber += ",";
    }

    const numParts: NumParts = {
      integerPart: resIntegerPart.disaggregations.join(""),
      fractionalPart: null,
    };

    if (fractionalPart) {
      const resFractionalPart = this.getDisaggregationResult(
        fractionalPart,
        disaggregationOf
      );
      disaggregations.push(...resFractionalPart.disaggregations);
      digits.push(...resFractionalPart.digits);
      numParts.fractionalPart = resFractionalPart.disaggregations.join("");

      convertedNumber += resFractionalPart.disaggregations.join("");
    }

    return {
      id: NumberingSystemsMethods.DISAGGREGATION,
      targetBase: 2,
      numParts,
      convertedNumber,
      digits,
      disaggregations,
    };
  }

  private getTFNResult(
    part: string,
    base: number,
    isInteger: boolean = true,
    maxDecimalPlaces?: number
  ) {
    const parcels: Parcel[] = [];
    const products: number[] = [];

    for (let i = 0; i < part.length; i++) {
      const char = part.charAt(i);
      const digit = isNaN(Number(char))
        ? this.getCharacterEquivalentInNumber(char)
        : Number(char);
      const exponent = isInteger ? part.length - 1 - i : -i - 1;
      const product = maxDecimalPlaces
        ? Number((digit * Math.pow(base, exponent)).toFixed(maxDecimalPlaces))
        : digit * Math.pow(base, exponent);
      const parcel = {
        digit,
        base,
        exponent,
      };

      parcels.push(parcel);
      products.push(product);
    }

    return {
      parcels,
      products,
    };
  }

  private getCharacterEquivalentInNumber(char: string): number {
    const letterCodeA = 65;
    const numericalValueEquivalentToA = 10;
    const charCode = char.charCodeAt(0);
    const equivalentNumber =
      charCode - letterCodeA + numericalValueEquivalentToA;
    return equivalentNumber;
  }

  private getAggregationResult(
    part: string,
    aggregationOf: number,
    isInteger: boolean = true
  ) {
    const aggregations: string[] = [];
    const convertedAggregations: string[] = [];

    let isMultiple = part.length % aggregationOf ? false : true;

    while (!isMultiple) {
      part = isInteger
        ? part.padStart(part.length + 1, "0")
        : part.padEnd(part.length + 1, "0");
      isMultiple = part.length % aggregationOf ? false : true;
    }

    const magnitudeCorrectedNumber = part;

    for (let i = 0; i < magnitudeCorrectedNumber.length; i += aggregationOf) {
      const aggregation = magnitudeCorrectedNumber.slice(i, aggregationOf + i);
      const binaryAggregation = Number(aggregation);
      const convertedAggregation =
        this.getConvertedAggregation(binaryAggregation);

      aggregations.push(aggregation);
      convertedAggregations.push(convertedAggregation);
    }

    return { aggregations, convertedAggregations, magnitudeCorrectedNumber };
  }

  private getDisaggregationResult(part: string, disaggregationOf: number) {
    const digits: string[] = [];
    const disaggregations: string[] = [];

    for (let i = 0; i < part.length; i++) {
      const digit = part.charAt(i);
      let bits = this.getConvertedDisaggregation(digit);

      while (bits.length < disaggregationOf)
        bits = bits.padStart(bits.length + 1, "0");

      const disaggregation = bits;

      digits.push(digit);
      disaggregations.push(disaggregation);
    }

    return { digits, disaggregations };
  }

  private getConvertedAggregation(binaryAggregation: number) {
    switch (binaryAggregation) {
      case 0:
        return "0";
      case 1:
        return "1";
      case 10:
        return "2";
      case 11:
        return "3";
      case 100:
        return "4";
      case 101:
        return "5";
      case 110:
        return "6";
      case 111:
        return "7";
      case 1000:
        return "8";
      case 1001:
        return "9";
      case 1010:
        return "A";
      case 1011:
        return "B";
      case 1100:
        return "C";
      case 1101:
        return "D";
      case 1110:
        return "E";
      case 1111:
        return "F";
      default:
        throw new Error("Binary Aggregation Number Not Found");
    }
  }

  private getConvertedDisaggregation(digit: string) {
    switch (digit) {
      case "0":
        return "0";
      case "1":
        return "1";
      case "2":
        return "10";
      case "3":
        return "11";
      case "4":
        return "100";
      case "5":
        return "101";
      case "6":
        return "110";
      case "7":
        return "111";
      case "8":
        return "1000";
      case "9":
        return "1001";
      case "A":
        return "1010";
      case "B":
        return "1011";
      case "C":
        return "1100";
      case "D":
        return "1101";
      case "E":
        return "1110";
      case "F":
        return "1111";
      default:
        throw new Error("Binary Disaggregation Number Not Found");
    }
  }
}
