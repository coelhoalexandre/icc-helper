import { useEffect, useMemo, useState } from "react";
import Controller from "../../controller/Controller";
import NumberingSystemView from "../../views/NumberingSystemsView";
import { ControllerContext } from ".";
import { NumberingSystemData } from "../../types/NumberingSystemData";

export const ControllerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [viewUpdate, setViewUpdate] = useState<NumberingSystemData | null>(
    null
  );
  const controller = useMemo(() => new Controller(setViewUpdate), []);
  const [viewElement, setViewElement] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (viewUpdate) {
      setViewElement(
        <NumberingSystemView
          knownBases={viewUpdate.knownBases}
          numInput={viewUpdate.numInput}
          baseInput={viewUpdate.baseInput}
        />
      );
    }
    setViewUpdate(null);
  }, [viewElement, viewUpdate]);

  return (
    <ControllerContext.Provider value={{ controller, viewElement }}>
      {children}
    </ControllerContext.Provider>
  );
};
