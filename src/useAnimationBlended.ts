import useInputMapContext from "./useInputMapContext";
import { useRef } from "react";
import { useScene } from "react-babylonjs";

function useBlendedAnimation(key: string, animationName: string) {
  const { inputMap } = useInputMapContext();
  const scene = useScene();
  const speed = useRef(0);
  const acceleration = 0.05;

  const init = () => {
    const animationGroup = scene?.getAnimationGroupByName(animationName);

    animationGroup?.play(true);
    animationGroup?.setWeightForAllAnimatables(0);
  };

  const render = () => {
    const animationGroup = scene?.getAnimationGroupByName(animationName);

    if (inputMap.current[key] && speed.current < 1) {
      speed.current += acceleration;
    } else if (!inputMap.current[key] && speed.current > 0) {
      speed.current -= acceleration;
    }

    animationGroup?.setWeightForAllAnimatables(speed.current);
  };

  return {
    speed,
    init,
    render,
  };
}

export default useBlendedAnimation;
