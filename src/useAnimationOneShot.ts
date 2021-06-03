import useInputMapContext from "./useInputMapContext";
import { useScene } from "react-babylonjs";

function useAnimationOneShot(key: string, animationName: string) {
  const { inputMap } = useInputMapContext();
  const scene = useScene();

  const init = () => {};

  const render = () => {
    const animationGroup = scene?.getAnimationGroupByName(animationName);

    if (inputMap.current[key] && !animationGroup?.isPlaying) {
      animationGroup?.stop();
      animationGroup?.play(false);
      animationGroup?.setWeightForAllAnimatables(1);
    }
  };

  return {
    init,
    render,
  };
}

export default useAnimationOneShot;
