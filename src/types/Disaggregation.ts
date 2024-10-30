import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import INumberingSystemsMethod from "./INumberingSystemsMethod";
import NumParts from "./NumParts";

export default interface Disaggregation extends INumberingSystemsMethod {
  id: NumberingSystemsMethods.DISAGGREGATION;
  numParts: NumParts;
  digits: string[];
  disaggregations: string[];
}
