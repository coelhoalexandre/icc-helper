import { useContext, useEffect, useRef, useState } from "react";
import styles from "./App.module.css";
import NumberingSystemSection from "./components/NumberingSystemSection";
import BinaryArithmeticSection from "./components/BinaryArithmeticSection";
import { SectionValues } from "./enums/SectionValues";
import ErrorSection from "./components/ErrorSection";
import { ControllerContext } from "./context/ControllerContext";
import { NumSysFormProvider } from "./context/NumSysFormContext/NumSysFormProvider";
import { NumSysFormContext } from "./context/NumSysFormContext";
import { BinArithFormProvider } from "./context/BinArithFormContext/BinArithFormProvider";
import { BinArithFormContext } from "./context/BinArithFormContext";

function App() {
  const { viewElement } = useContext(ControllerContext);
  const { submittedWithSuccess: numSysSubmittedWithSuccess } =
    useContext(NumSysFormContext);
  const { submittedWithSuccess: binArithSubmittedWithSuccess } =
    useContext(BinArithFormContext);
  const sectionRef = useRef<HTMLElement | null>(null);

  const options = [
    {
      id: SectionValues.NUMBERING_SYSTEM,
      text: "Sistemas de Numeração",
    },
    {
      id: SectionValues.BINARY_ARITHMETIC,
      text: "Aritmética Binária",
    },
  ];

  const [currentSection, setCurrentSection] = useState(
    SectionValues.NUMBERING_SYSTEM
  );

  const renderSection = () => {
    switch (currentSection) {
      case SectionValues.NUMBERING_SYSTEM:
        return (
          <NumSysFormProvider>
            <NumberingSystemSection />
          </NumSysFormProvider>
        );
      case SectionValues.BINARY_ARITHMETIC:
        return (
          <BinArithFormProvider>
            <BinaryArithmeticSection />
          </BinArithFormProvider>
        );
      default:
        return <ErrorSection currentSection={currentSection} />;
    }
  };

  useEffect(() => {
    if (
      (numSysSubmittedWithSuccess || binArithSubmittedWithSuccess) &&
      sectionRef.current
    )
      sectionRef.current.focus();
  }, [binArithSubmittedWithSuccess, numSysSubmittedWithSuccess]);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.options}>
          {options.map((option) => (
            <button
              className={
                currentSection === option.id ? styles.selectedButton : ""
              }
              disabled={currentSection === option.id}
              key={option.id}
              onClick={() => setCurrentSection(option.id)}
              aria-label={`Formulário de ${option.text}`}
            >
              {option.text}
            </button>
          ))}
        </div>

        <section className={styles.section} tabIndex={0}>
          {renderSection()}
        </section>
        {viewElement ? (
          <section
            className={styles.section}
            ref={(section) => (sectionRef.current = section)}
            tabIndex={0}
          >
            {viewElement}
          </section>
        ) : (
          ""
        )}
      </main>
      <footer className={styles.footer}>
        <p>
          <strong>
            Desenvolvido por{" "}
            <a href="https://github.com/coelhoalexandre" target="_blank">
              Alexandre Coelho
            </a>
          </strong>
        </p>
      </footer>
    </>
  );
}

export default App;
