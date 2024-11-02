import { NumberingSystemsMethods } from "../../enums/NumberingSystemsMethods";
import INumberingSystemsMethod from ".";
import NumParts from "../NumParts";

export default interface TFN extends INumberingSystemsMethod {
  id: NumberingSystemsMethods.TFN;
  numParts: NumParts;
  products: number[];
  parcels: Parcel[];
}

export interface Parcel {
  digit: number;
  base: number;
  exponent: number;
}
