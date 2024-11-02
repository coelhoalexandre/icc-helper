import { useCallback, useEffect, useState } from "react";

export const useBodyWidth = () => {
  const [windowScreen, setWindowScreen] = useState(0);

  const handleResizeWindow = useCallback((e: UIEvent) => {
    const window = e.target as Window;
    setWindowScreen(window.document.body.clientWidth);
  }, []);

  useEffect(() => {
    if (window) setWindowScreen(window.document.body.clientWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResizeWindow);
    return () => window.removeEventListener("resize", handleResizeWindow);
  }, [handleResizeWindow]);

  return windowScreen;
};
