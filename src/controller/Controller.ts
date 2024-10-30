import NumberingSystems from "../models/NumberingSystems";
import { NumberingSystemData } from "../types/NumberingSystemData";

export default class Controller {
  private numberingSystem = new NumberingSystems();

  private setViewUpdate;
  public viewElement: JSX.Element | undefined;

  constructor(
    setViewUpdate: React.Dispatch<
      React.SetStateAction<NumberingSystemData | null>
    >
  ) {
    this.setViewUpdate = setViewUpdate;
  }

  public getNumInputPattern(baseInput: number) {
    return this.numberingSystem.getNumInputPattern(baseInput);
  }

  public isNeedMaxNumDecPlaces(base: number): boolean {
    return this.numberingSystem.isNeedMaxNumDecPlaces(base);
  }

  public render(
    baseInput: number,
    numInput: string,
    maxDecimalPlaces: number | undefined
  ) {
    const knownBases = this.numberingSystem.getNumberConvertedToKnownBases(
      baseInput,
      numInput,
      maxDecimalPlaces
    );

    this.setViewUpdate({ knownBases, numInput, baseInput });
  }
}
