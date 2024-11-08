import MainController from "../controller/MainController";
import { KnownBases } from "../types/KnownBases";

export default function getNumberConvertedToKnownBases(
  base: number,
  num: string,
  maxDecimalPlaces?: number
): KnownBases {
  const controller = new MainController();
  return controller.getNumberConvertedToKnownBases(base, num, maxDecimalPlaces);
}
