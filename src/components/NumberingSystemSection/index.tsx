import { useContext } from "react";
import { ControllerContext } from "../../context/ControllerContext";
import BaseInput from "./BaseInput";
import { NumSysFormContext } from "../../context/NumSysFormContext";
import NumContainer from "./NumContainer";
import MaxDecimalPlacesInput from "./MaxDecimalPlacesInput";
import MethodsDisplayFieldset from "./MethodsDisplayFieldset";

export default function NumberingSystemSection() {
  const { controller } = useContext(ControllerContext);
  const { isValidForm, getRenderProps } = useContext(NumSysFormContext);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidForm()) controller.renderNumSysView(getRenderProps());
  };

  return (
    <>
      <h2>Sistemas de Numeração</h2>
      <form onSubmit={onSubmit}>
        <BaseInput />
        <NumContainer />
        <MaxDecimalPlacesInput />
        <MethodsDisplayFieldset />
        <button type="submit">Converter</button>
      </form>
    </>
  );
}
