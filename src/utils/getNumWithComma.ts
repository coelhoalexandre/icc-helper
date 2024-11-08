import MainController from "../controller/MainController";

export default function getNumWithComma(
  num: string,
  commaPosition: number
): string {
  const controller = new MainController();
  return controller.getNumWithComma(num, commaPosition);
}
