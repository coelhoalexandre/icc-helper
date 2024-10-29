import { createContext } from "react";
import Controller from "../../controller/Controller";

export const ControllerContext = createContext<{
  controller: Controller;
  viewElement: JSX.Element | null;
}>({ controller: new Controller(() => {}), viewElement: null });
ControllerContext.displayName = "Controller Context";
