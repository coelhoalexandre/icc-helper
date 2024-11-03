import { useEffect, useMemo, useState } from "react";
import Controller from "../../controller/Controller";
import NumberingSystemView from "../../views/NumberingSystemsView";
import { ControllerContext } from ".";
import { RenderData } from "../../types/RenderData";
import { SectionValues } from "../../enums/SectionValues";
import BinaryArithmeticView from "../../views/BinaryArithmeticView";

export const ControllerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [viewUpdate, setViewUpdate] = useState<RenderData | null>(null);
  const controller = useMemo(() => new Controller(setViewUpdate), []);
  const [viewElement, setViewElement] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (viewUpdate) {
      switch (viewUpdate.id) {
        case SectionValues.NUMBERING_SYSTEM:
          setViewElement(
            <NumberingSystemView
              knownBases={viewUpdate.knownBases}
              numInput={viewUpdate.numInput}
              baseInput={viewUpdate.baseInput}
            />
          );
          break;
        case SectionValues.BINARY_ARITHMETIC:
          setViewElement(
            <BinaryArithmeticView
              architecturalSize={viewUpdate.architecturalSize}
              operationResults={viewUpdate.operationResults}
              isThereSignalBit={viewUpdate.isThereSignalBit}
              TFN={viewUpdate.TFN}
              isComplementResult={viewUpdate.isComplementResult}
            />
          );
          break;
      }
    }
    setViewUpdate(null);
  }, [viewElement, viewUpdate]);

  return (
    <ControllerContext.Provider value={{ controller, viewElement }}>
      {children}
    </ControllerContext.Provider>
  );
};
