import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import INumberingSystemsMethod from "./INumberingSystemsMethod";

export default interface Disaggregation extends INumberingSystemsMethod {
  id: NumberingSystemsMethods.DISAGGREGATION;
  digits: string[];
  disaggregations: string[];
}
