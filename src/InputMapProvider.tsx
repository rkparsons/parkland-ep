import { KeyboardEventTypes, KeyboardInfo } from "@babylonjs/core";
import React, { FC, ReactNode, useEffect, useRef } from "react";

import InputMapContext from "./inputMapContext";
import { useScene } from "react-babylonjs";

type ViewProps = {
  children: ReactNode;
};

const InputMapProvider: FC<ViewProps> = ({ children }) => {
  const scene = useScene();
  const inputMap = useRef<Record<string, boolean>>({});

  const handleKeyPress = ({ type, event }: KeyboardInfo) =>
    (inputMap.current[event.key] = type === KeyboardEventTypes.KEYDOWN);

  useEffect(() => {
    scene?.onKeyboardObservable.add(handleKeyPress);
  }, [scene]);

  return (
    <InputMapContext.Provider value={{ inputMap, handleKeyPress }}>
      {children}
    </InputMapContext.Provider>
  );
};

export default InputMapProvider;
