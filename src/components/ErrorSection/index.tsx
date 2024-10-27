import { SectionValues } from "../../enums/SectionValues";

interface ErrorSectionProps {
  currentSection: SectionValues;
}

export default function ErrorSection({ currentSection }: ErrorSectionProps) {
  return (
    <>
      <h2>Error ao Buscar Seção Atual</h2>
      <p>Seção: {currentSection} não existe!</p>
    </>
  );
}
