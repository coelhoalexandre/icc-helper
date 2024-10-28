import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import Aggregation from "../types/Aggregation";
import Disaggregation from "../types/Disaggregation";
import InverseTFN from "../types/InverseTFN";
import { KnownBases } from "../types/KnownBases";
import TFN, { Parcel } from "../types/TFN";

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

  public getNumInputPattern(baseInput: string): string {
    const base = Number(baseInput);

    if (base <= 10) return `[0-${base - 1}]{0,999}`;
    else return `[0-9${this.symbols[0]}-${this.symbols[base - 11]}]{0,999}`;
  }

  public getNumberConvertedToKnownBases(
    baseInput: string,
    numInput: string
  ): KnownBases {
    let decimalNumber: TFN;

    let binaryNumber: Disaggregation | InverseTFN;

    let octalNumber: Aggregation;

    let hexaNumber: Aggregation;

    switch (baseInput) {
      case "2":
        decimalNumber = this.TFN("2", numInput);
        octalNumber = this.aggregation(8, numInput);
        hexaNumber = this.aggregation(16, numInput);
        return [decimalNumber, octalNumber, hexaNumber];
      case "4":
        binaryNumber = this.disaggregation(baseInput, numInput);
        decimalNumber = this.TFN("2", binaryNumber.convertedNumber);
        octalNumber = this.aggregation(8, binaryNumber.convertedNumber);
        hexaNumber = this.aggregation(16, binaryNumber.convertedNumber);
        return [binaryNumber, decimalNumber, octalNumber, hexaNumber];
      case "8":
        binaryNumber = this.disaggregation(baseInput, numInput);
        decimalNumber = this.TFN("2", binaryNumber.convertedNumber);
        hexaNumber = this.aggregation(16, binaryNumber.convertedNumber);
        return [binaryNumber, decimalNumber, hexaNumber];
      case "10":
        binaryNumber = this.inverseTFN(2, numInput);
        octalNumber = this.aggregation(8, binaryNumber.convertedNumber);
        hexaNumber = this.aggregation(16, binaryNumber.convertedNumber);
        return [binaryNumber, octalNumber, hexaNumber];
      case "16":
        binaryNumber = this.disaggregation(baseInput, numInput);
        decimalNumber = this.TFN("2", binaryNumber.convertedNumber);
        octalNumber = this.aggregation(8, binaryNumber.convertedNumber);
        return [binaryNumber, decimalNumber, octalNumber];
      default:
        decimalNumber = this.TFN(baseInput, numInput);
        binaryNumber = this.inverseTFN(2, decimalNumber.convertedNumber);
        octalNumber = this.aggregation(8, binaryNumber.convertedNumber);
        hexaNumber = this.aggregation(16, binaryNumber.convertedNumber);
        return [decimalNumber, binaryNumber, octalNumber, hexaNumber];
    }
  }

  private TFN(base: string, num: string): TFN {
    const products: number[] = [];
    const parcels: Parcel[] = [];

    for (let i = 0; i < num.length; i++) {
      const char = num.charAt(i);
      const digit = isNaN(Number(char))
        ? this.getCharacterEquivalentInNumber(char)
        : Number(char);
      const exponent = num.length - 1 - i;
      const product = digit * Math.pow(Number(base), exponent);
      const parcel = {
        digit,
        base,
        exponent,
      };

      parcels.push(parcel);
      products.push(product);
    }

    const convertedNumber = products
      .reduce((acc, product) => (acc += product))
      .toString();

    return {
      id: NumberingSystemsMethods.TFN,
      targetBase: 10,
      convertedNumber,
      products,
      parcels,
    };
  }

  private inverseTFN(base: number, num: string): InverseTFN {
    const divisions: {
      dividend: number;
      divider: number;
      quotient: number;
      rest: number;
    }[] = [];

    let quotient = Number(num);
    do {
      const dividend = quotient;
      const divider = base;
      quotient = Math.trunc(dividend / divider);
      const rest = dividend % divider;

      divisions.push({
        dividend,
        divider,
        quotient,
        rest,
      });
    } while (quotient > 0);

    const convertedNumber = divisions
      .map((division) => division.rest.toString())
      .reverse()
      .join("");
    return {
      id: NumberingSystemsMethods.INVERSE_TFN,
      targetBase: base,
      convertedNumber,
      num,
      divisions,
    };
  }

  private aggregation(base: number, num: string): Aggregation {
    const aggregations: string[] = [];
    const convertedAggregations: string[] = [];

    const aggregationOf = Math.log2(base);
    let isMultiple = num.length % aggregationOf ? false : true;

    while (!isMultiple) {
      num = num.padStart(num.length + 1, "0");
      isMultiple = num.length % aggregationOf ? false : true;
    }

    const magnitudeCorrectedNumber = num;

    for (let i = 0; i < magnitudeCorrectedNumber.length; i += aggregationOf) {
      const aggregation = magnitudeCorrectedNumber.slice(i, aggregationOf + i);
      const binaryAggregation = Number(aggregation);
      const convertedAggregation =
        this.getConvertedAggregation(binaryAggregation);

      aggregations.push(aggregation);
      convertedAggregations.push(convertedAggregation);
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

  private disaggregation(base: string | number, num: string): Disaggregation {
    base = Number(base);
    const disaggregationOf = Math.log2(base);

    const digits: string[] = [];
    const disaggregations: string[] = [];

    for (let i = 0; i < num.length; i++) {
      const digit = num.charAt(i);
      let bits = this.getConvertedDisaggregation(digit);

      while (bits.length < disaggregationOf)
        bits = bits.padStart(bits.length + 1, "0");

      const disaggregation = bits;

      digits.push(digit);
      disaggregations.push(disaggregation);
    }

    const convertedNumber = disaggregations.join("");
    return {
      id: NumberingSystemsMethods.DISAGGREGATION,
      targetBase: 2,
      convertedNumber,
      digits,
      disaggregations,
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
