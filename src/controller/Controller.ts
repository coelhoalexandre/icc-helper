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

  public getNumInputPattern(baseInput: string) {
    return this.numberingSystem.getNumInputPattern(baseInput);
  }

  public render(baseInput: string, numInput: string) {
    const knownBases = this.numberingSystem.getNumberConvertedToKnownBases(
      baseInput,
      numInput
    );

    this.setViewUpdate({ knownBases, numInput, baseInput });
  }
}
