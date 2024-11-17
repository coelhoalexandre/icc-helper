import { createContext } from "react";
import MainController from "../../controller/MainController";

export const ControllerContext = createContext<{
  controller: MainController;
  viewElement: JSX.Element | null;
  setViewElement: React.Dispatch<React.SetStateAction<JSX.Element | null>>;
}>({
  controller: new MainController(() => {}),
  viewElement: null,
  setViewElement: () => {},
});
ControllerContext.displayName = "Controller Context";
