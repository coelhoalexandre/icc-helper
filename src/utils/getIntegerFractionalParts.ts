import MainController from "../controller/MainController";
import NumParts from "../types/NumParts";

export default function getIntegerFractionalParts(
  num: string,
  isFractional?: boolean
): NumParts {
  const controller = new MainController();
  return controller.getIntegerFractionalParts(num, isFractional);
}
