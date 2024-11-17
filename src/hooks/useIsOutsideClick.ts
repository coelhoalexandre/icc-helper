"use client";
import { MutableRefObject, useCallback, useEffect, useState } from "react";

export const useIsOutsideClick = (
  ref: MutableRefObject<HTMLElement | null>,
  isActive: boolean
) => {
  const [isOutsideClick, setIsOutsideClick] = useState(false);

  const handleWindowClick = useCallback(
    (event: Event) => {
      const target = event.target;

      if (
        ref &&
        ref.current &&
        target &&
        !ref.current.contains(event.target as Node)
      )
        setIsOutsideClick(true);
    },
    [ref]
  );

  useEffect(() => {
    if (isActive) window.addEventListener("mousedown", handleWindowClick, true);

    return () => {
      setIsOutsideClick(false);
      window.removeEventListener("mousedown", handleWindowClick, true);
    };
  }, [isActive, handleWindowClick]);

  return isOutsideClick;
};
