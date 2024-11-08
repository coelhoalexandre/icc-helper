import { ArchitecturesForNumberParts } from "../enums/ArchitecturesForNumberParts";
import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import { OperationsValues } from "../enums/OperationsValues";
import { KnownBases } from "../types/KnownBases";
import NumParts from "../types/NumParts";
import { OperationResult } from "../types/OperationResult";
import RenderBinArithViewProps from "../types/RenderBinArithViewProps";
import { RenderData } from "../types/RenderData";
import RenderNumSysViewProps from "../types/RenderNumSysViewProps";
import BinArithController from "./BinArithController";
import NumSysController from "./NumSysController";

export default class MainController {
  private numSysController = new NumSysController();
  private binArithController = new BinArithController();

  private setViewUpdate;
  public viewElement: JSX.Element | undefined;

  constructor(
    setViewUpdate?: React.Dispatch<React.SetStateAction<RenderData | null>>
  ) {
    this.setViewUpdate = setViewUpdate;
  }

  public getNumInputPattern(baseInput: number): string {
    return this.numSysController.getNumInputPattern(baseInput);
  }

  public getVerifiedNum(num: string, includesCommaNumInput: boolean): string {
    return this.numSysController.getVerifiedNum(num, includesCommaNumInput);
  }

  public isNeedMaxNumDecPlaces(base: number): boolean {
    return this.numSysController.isNeedMaxNumDecPlaces(base);
  }

  public getIntegerFractionalParts(
    num: string,
    isFractional?: boolean
  ): NumParts {
    return this.numSysController.getIntegerFractionalParts(num, isFractional);
  }

  public getMethodsUsed(base: number): NumberingSystemsMethods[] {
    return this.numSysController.getMethodsUsed(base);
  }

  public getNumberConvertedToKnownBases(
    base: number,
    num: string,
    maxDecimalPlaces?: number
  ): KnownBases {
    return this.numSysController.getNumberConvertedToKnownBases(
      base,
      num,
      maxDecimalPlaces
    );
  }

  public getOperations(): OperationsValues[] {
    return this.binArithController.getOperations();
  }

  public getArchitecturesForNumberPart(): ArchitecturesForNumberParts[] {
    return this.binArithController.getArchitecturesForNumberPart();
  }

  public getComplementResult(
    num: string,
    commaPosition?: number
  ): OperationResult {
    return this.binArithController.getComplementResult(num, commaPosition);
  }

  public renderNumSysView(numSysProps: RenderNumSysViewProps) {
    const renderData = this.numSysController.getNumSysViewData(numSysProps);
    this.render(renderData);
  }

  public renderBinArithView(props: RenderBinArithViewProps) {
    const renderData = this.binArithController.getBinArithData(props);

    this.render(renderData);
  }

  private render(renderData: RenderData) {
    if (this.setViewUpdate) this.setViewUpdate(renderData);
  }
}
