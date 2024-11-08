import { MethodsDisplay } from "./INumberingSystemsMethod/MethodsDisplay";

export default interface RenderNumSysViewProps {
  baseInput: number;
  numInput: string;
  maxDecimalPlaces: number | undefined;
  isNumComplement: boolean;
  methodsDisplay: MethodsDisplay;
}
