import MainController from "../controller/MainController";
import { OperationResult } from "../types/OperationResult";

export default function getComplementResult(
  num: string,
  commaPosition?: number
): OperationResult {
  const controller = new MainController();
  return controller.getComplementResult(num, commaPosition);
}
