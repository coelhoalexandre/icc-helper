import { useLayoutEffect, useRef, useState } from "react";
import styles from "./InputInformation.module.css";
import { ImInfo } from "react-icons/im";
import { useIsOutsideClick } from "../../hooks/useIsOutsideClick";

interface InputInformationProps {
  children: React.ReactNode;
  origin: string;
  content: string;
}

export default function InputInformation({
  children,
  origin,
  content,
}: InputInformationProps) {
  const infoContainerRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const infoContentRef = useRef<HTMLDivElement | null>(null);
  const [isInfoDivHidden, setIsInfoDivHidden] = useState(true);
  const [isFocusContent, setIsFocusContent] = useState(false);
  const isOutsideClick = useIsOutsideClick(infoContainerRef, !isInfoDivHidden);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Enter" || event.code === "Space") {
      setIsInfoDivHidden(!isInfoDivHidden);
      if (isInfoDivHidden && infoContentRef.current) setIsFocusContent(true);
    }
  };

  useLayoutEffect(() => {
    if (infoContentRef.current && isFocusContent)
      infoContentRef.current.focus();
  });

  useLayoutEffect(() => {
    if (isOutsideClick) setIsInfoDivHidden(true);
  }, [isInfoDivHidden, isOutsideClick]);

  return (
    <div className={styles.label}>
      {children}
      <div
        ref={(infoContainer) => (infoContainerRef.current = infoContainer)}
        className={styles.infoContainer}
        onMouseEnter={() => setIsInfoDivHidden(false)}
        onMouseLeave={() => setIsInfoDivHidden(true)}
      >
        <div
          ref={(info) => (infoRef.current = info)}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={`Informações sobre ${origin}`}
        >
          <ImInfo
            className={styles.infoIcon}
            size={12}
            color="var(--primary-hover-color)"
          />
        </div>
        <div
          ref={(div) => (infoContentRef.current = div)}
          className={styles.infoDiv}
          hidden={isInfoDivHidden}
          tabIndex={0}
          onBlur={() => setIsInfoDivHidden(true)}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
