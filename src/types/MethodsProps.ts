import Aggregation from "./INumberingSystemsMethod/Aggregation";
import Disaggregation from "./INumberingSystemsMethod/Disaggregation";
import InverseTFN from "./INumberingSystemsMethod/InverseTFN";
import TFN from "./INumberingSystemsMethod/TFN";

export default interface MethodsProps {
  knownBase: TFN | InverseTFN | Aggregation | Disaggregation;
}
