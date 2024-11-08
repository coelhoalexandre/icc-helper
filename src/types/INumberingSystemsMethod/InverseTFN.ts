import { NumberingSystemsMethods } from "../../enums/NumberingSystemsMethods";
import INumberingSystemsMethod from ".";
import NumParts from "../NumParts";

export default interface InverseTFN extends INumberingSystemsMethod {
  id: NumberingSystemsMethods.INVERSE_TFN;
  originalNum: string;
  numParts: NumParts;
  divisions: Divisions[];
  multiplications: Multiplications[];
}

export interface Divisions {
  dividend: number;
  divider: number;
  quotient: number;
  rest: number;
}

export interface Multiplications {
  factorLeft: number;
  factorRight: number;
  integer: number;
  product: NumParts;
  rest: number;
}
