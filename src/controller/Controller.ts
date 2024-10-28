import { NumberingSystemsMethods } from "../enums/NumberingSystemsMethods";
import NumberingSystems from "../models/NumberingSystems";

export default class Controller {
  private numberingSystem = new NumberingSystems();

  public getNumInputPattern(baseInput: string) {
    return this.numberingSystem.getNumInputPattern(baseInput);
  }

  public render(baseInput: string, numInput: string) {
    const knownBases = this.numberingSystem.getNumberConvertedToKnownBases(
      baseInput,
      numInput
    );

    return knownBases.map((knownBase) => {
      console.log(
        "Método: " + knownBase.id + " para a base " + knownBase.targetBase
      );
      switch (knownBase.id) {
        case NumberingSystemsMethods.TFN:
          console.log(
            knownBase.parcels
              .map(
                (parcel) =>
                  `${parcel.digit} x ${parcel.base}^${parcel.exponent}`
              )
              .join(" + ")
          );
          console.log(
            knownBase.products.join(" + ") + " = " + knownBase.convertedNumber
          );
          break;

        case NumberingSystemsMethods.INVERSE_TFN:
          knownBase.divisions.map((division) => {
            console.log(
              division.dividend +
                " / " +
                division.divider +
                " = " +
                division.quotient +
                " | " +
                "Resto: " +
                division.rest
            );
          });
          break;
        case NumberingSystemsMethods.AGGREGATION:
          console.log("Adicionando zeros:", knownBase.magnitudeCorrectedNumber);
          console.log(
            knownBase.aggregations.join("|") +
              " = " +
              knownBase.convertedAggregations.join("|")
          );
          break;

        case NumberingSystemsMethods.DISAGGREGATION:
          console.log(
            knownBase.digits.join("|") +
              " = " +
              knownBase.disaggregations.join("|")
          );
          break;
      }

      console.log(
        "O número " +
          numInput +
          " na base " +
          knownBase.targetBase +
          " é " +
          knownBase.convertedNumber
      );
      console.log("");
    });
  }
}
