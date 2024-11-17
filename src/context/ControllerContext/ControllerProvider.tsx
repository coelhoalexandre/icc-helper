import { useEffect, useMemo, useState } from "react";
import MainController from "../../controller/MainController";
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
  const controller = useMemo(() => new MainController(setViewUpdate), []);
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
              complementOperation={viewUpdate.complementOperation}
              isNegative={viewUpdate.isNegative}
              methodsDisplay={viewUpdate.methodsDisplay}
            />
          );
          break;
        case SectionValues.BINARY_ARITHMETIC:
          setViewElement(
            <BinaryArithmeticView
              architecturalSize={viewUpdate.architecturalSize}
              operationResults={viewUpdate.operationResults}
              isNumInputModified={viewUpdate.isNumInputModified}
              isThereSignalBit={viewUpdate.isThereSignalBit}
              inDecimalOperationResults={viewUpdate.inDecimalOperationResults}
              inverseTFNs={viewUpdate.inverseTFNs}
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
    <ControllerContext.Provider
      value={{ controller, viewElement, setViewElement }}
    >
      {children}
    </ControllerContext.Provider>
  );
};
