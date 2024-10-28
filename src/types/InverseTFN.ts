import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import INumberingSystemsMethod from "./INumberingSystemsMethod";

export default interface InverseTFN extends INumberingSystemsMethod {
  id: NumberingSystemsMethods.INVERSE_TFN;
  divisions: Divisions[];
  num: string;
}

interface Divisions {
  dividend: number;
  divider: number;
  quotient: number;
  rest: number;
}
