import Aggregation from "./INumberingSystemsMethod/Aggregation";
import Disaggregation from "./INumberingSystemsMethod/Disaggregation";
import InverseTFN from "./INumberingSystemsMethod/InverseTFN";
import TFN from "./INumberingSystemsMethod/TFN";

export type KnownBases =
  | (TFN | Disaggregation | Aggregation)[]
  | (TFN | InverseTFN | Aggregation)[];
