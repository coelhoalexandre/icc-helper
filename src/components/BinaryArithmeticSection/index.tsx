import styles from "./BinaryArithmeticSection.module.css";
import { useContext } from "react";
import { ControllerContext } from "../../context/ControllerContext";
import ArchitecturalSizeContainer from "./ArchitecturalSizeContainer";
import { BinArithFormContext } from "../../context/BinArithFormContext";
import NumberPartsFieldset from "./NumberPartsFieldset";
import OperationSelector from "./OperationSelector";
import NumInputsFieldset from "./NumInputsFieldset";
import DetailedContainer from "./DetailedContainer";

export default function BinaryArithmeticSection() {
  const { controller } = useContext(ControllerContext);
  const { isValidForm, getRenderProps } = useContext(BinArithFormContext);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isValidForm()) controller.renderBinArithView(getRenderProps());
  };

  return (
    <>
      <h2>Aritmética Binária</h2>
      <form onSubmit={onSubmit} className={styles.binaryArithmeticForm}>
        <ArchitecturalSizeContainer />
        <NumberPartsFieldset />
        <OperationSelector />
        <NumInputsFieldset />
        <DetailedContainer />

        <button type="submit">Calcular</button>
      </form>
    </>
  );
}
