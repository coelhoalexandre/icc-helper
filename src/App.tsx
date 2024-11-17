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
import { BiMoon, BiSun } from "react-icons/bi";
import { OrbitProgress } from "react-loading-indicators";

function App() {
  const cssRules = document.styleSheets[0].cssRules;
  const rootStyles = [...cssRules].find((cssRule) => {
    const cssStyleRule = cssRule as CSSStyleRule;
    if (cssStyleRule.selectorText === ":root") return cssStyleRule;
  }) as CSSStyleRule;

  const [isDisplayElement, setIsDisplayElement] = useState(false);
  const { viewElement, setViewElement } = useContext(ControllerContext);
  const { submittedWithSuccess: numSysSubmittedWithSuccess } =
    useContext(NumSysFormContext);
  const { submittedWithSuccess: binArithSubmittedWithSuccess } =
    useContext(BinArithFormContext);
  const sectionRef = useRef<HTMLElement | null>(null);

  const themeOptions: ("Claro" | "Escuro")[] = ["Claro", "Escuro"];
  const [themeOption, setThemeOption] = useState(themeOptions[0]);
  const toggleTheme = () => {
    switch (themeOption) {
      case "Claro":
        setThemeOption("Escuro");
        rootStyles.style.setProperty("--background-color", "#121212");
        rootStyles.style.setProperty("--foreground-color", "#f9f9f9");
        break;
      case "Escuro":
        setThemeOption("Claro");
        rootStyles.style.setProperty("--background-color", "#f9f9f9");
        rootStyles.style.setProperty("--foreground-color", "#121212");
        break;
    }
  };
  const colorOptions: ("Branco&Preto" | "Colorido")[] = [
    "Branco&Preto",
    "Colorido",
  ];
  const [isColorOptionsHidden, setIsColorOptionsHidden] = useState(true);
  const setColor = (color: "Branco&Preto" | "Colorido") => {
    if (color === "Branco&Preto") {
      rootStyles.style.setProperty(
        "--primary-color",
        "var(--foreground-color)"
      );
      rootStyles.style.setProperty(
        "--primary-hover-color",
        "var(--foreground-color)"
      );
    } else {
      if (themeOption === "Escuro") {
        rootStyles.style.setProperty(
          "--primary-color",
          "var(--save-primary-hover-color)"
        );
        rootStyles.style.setProperty(
          "--primary-hover-color",
          "var(--save-primary-color)"
        );
        console.log("sim");
      } else
        rootStyles.style.setProperty(
          "--primary-color",
          "var(--save-primary-color)"
        );
      rootStyles.style.setProperty(
        "--primary-hover-color",
        "var(--save-primary-hover-color)"
      );
    }
  };

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

  const getViewElement = () => {
    if (viewElement)
      return (
        <>
          <button
            className={styles.closeButton}
            onClick={() => setViewElement(null)}
            aria-label="Fechar a seção de resultados."
          >
            x
          </button>
          {viewElement}
        </>
      );
    else return "";
  };

  useEffect(() => {
    if (
      (numSysSubmittedWithSuccess || binArithSubmittedWithSuccess) &&
      sectionRef.current
    )
      sectionRef.current.focus();
  }, [binArithSubmittedWithSuccess, numSysSubmittedWithSuccess]);

  useEffect(() => {
    if (viewElement) {
      setIsDisplayElement(false);
      setTimeout(() => setIsDisplayElement(true), 1000);
    }
  }, [viewElement]);

  return (
    <>
      <header className={styles.header}>
        <h1>ICC HELPER</h1>
        <div className={styles.headerButtons}>
          <button
            onClick={() => toggleTheme()}
            aria-label={`Trocar Tema ${themeOption} para ${
              themeOptions.filter((theme) => theme !== themeOption)[0]
            }`}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px 10px",
            }}
          >
            {themeOption === "Claro" ? (
              <BiSun size={24} />
            ) : (
              <BiMoon size={24} />
            )}
          </button>
          <div className={styles.colorOptions}>
            <button
              onClick={() => setIsColorOptionsHidden(!isColorOptionsHidden)}
            >
              Opções de Cor
            </button>
            <ul hidden={isColorOptionsHidden}>
              {colorOptions.map((colorOption, index) => (
                <li key={index}>
                  <button onClick={() => setColor(colorOption)}>
                    {colorOption}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
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

        <section
          className={`${styles.section} ${styles.formSection} ${
            currentSection === SectionValues.NUMBERING_SYSTEM
              ? styles.numberingSection
              : styles.arithmeticSection
          }`}
          tabIndex={0}
        >
          {renderSection()}
        </section>
        {viewElement ? (
          <section
            className={`${styles.section} ${styles.resultSection}`}
            ref={(section) => (sectionRef.current = section)}
            tabIndex={0}
          >
            {isDisplayElement ? (
              getViewElement()
            ) : (
              <div className={styles.loading}>
                <OrbitProgress
                  dense
                  color="var(--primary-hover-color)"
                  size="medium"
                  text=""
                  textColor=""
                />
              </div>
            )}
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
        <p>
          Em caso de <strong>erros</strong>, <strong>bugs</strong> ou{" "}
          <strong>sugestões</strong>, entre em contato pelo email:{" "}
          <strong>
            <a href="mailto:alexandrecoelhocontato@gmail.com" target="_blank">
              alexandrecoelhocontato@gmail.com
            </a>
          </strong>
        </p>
      </footer>
    </>
  );
}

export default App;
