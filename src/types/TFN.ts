import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import INumberingSystemsMethod from "./INumberingSystemsMethod";

export default interface TFN extends INumberingSystemsMethod {
  id: NumberingSystemsMethods.TFN;
  products: number[];
  parcels: Parcel[];
}

export interface Parcel {
  digit: number;
  base: string;
  exponent: number;
}
