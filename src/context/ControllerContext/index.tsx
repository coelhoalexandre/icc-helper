import { createContext } from "react";
import MainController from "../../controller/MainController";

export const ControllerContext = createContext<{
  controller: MainController;
  viewElement: JSX.Element | null;
}>({ controller: new MainController(() => {}), viewElement: null });
ControllerContext.displayName = "Controller Context";
