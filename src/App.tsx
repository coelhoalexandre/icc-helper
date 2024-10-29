import { useContext, useState } from "react";
import styles from "./App.module.css";
import NumberingSystemSection from "./components/NumberingSystemSection";
import BinaryArithmeticSection from "./components/BinaryArithmeticSection";
import { SectionValues } from "./enums/SectionValues";
import ErrorSection from "./components/ErrorSection";
import { ControllerContext } from "./context/ControllerContext";

function App() {
  const { viewElement } = useContext(ControllerContext);
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
        return <NumberingSystemSection />;
      case SectionValues.BINARY_ARITHMETIC:
        return <BinaryArithmeticSection />;
      default:
        return <ErrorSection currentSection={currentSection} />;
    }
  };

  return (
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
          >
            {option.text}
          </button>
        ))}
      </div>

      <section className={styles.section}>{renderSection()}</section>
      {viewElement ? (
        <section className={styles.section}>{viewElement}</section>
      ) : (
        ""
      )}
    </main>
  );
}

export default App;
