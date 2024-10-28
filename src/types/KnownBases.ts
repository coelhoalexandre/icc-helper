import Aggregation from "./Aggregation";
import Disaggregation from "./Disaggregation";
import InverseTFN from "./InverseTFN";
import TFN from "./TFN";

export type KnownBases =
  | (TFN | Disaggregation | Aggregation)[]
  | (TFN | InverseTFN | Aggregation)[];
