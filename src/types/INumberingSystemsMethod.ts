import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";

export default interface INumberingSystemsMethod {
  id: NumberingSystemsMethods;
  targetBase: number;
  convertedNumber: string;
}
