import { NumberingSystemsMethods } from "../../enums/NumberingSystemsMethods";
import INumberingSystemsMethod from ".";

export default interface Aggregation extends INumberingSystemsMethod {
  id: NumberingSystemsMethods.AGGREGATION;
  magnitudeCorrectedNumber: string;
  aggregations: string[];
  convertedAggregations: string[];
}
