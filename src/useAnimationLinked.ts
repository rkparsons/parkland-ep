import { useScene } from "react-babylonjs";

function useAnimationLinked(animationName: string, getSpeed: () => number) {
  const scene = useScene();

  const init = () => {
    const animationGroup = scene?.getAnimationGroupByName(animationName);

    animationGroup?.play(true);
    animationGroup?.setWeightForAllAnimatables(0);
  };

  const render = () => {
    const animationGroup = scene?.getAnimationGroupByName(animationName);

    animationGroup?.setWeightForAllAnimatables(getSpeed());
  };

  return {
    init,
    render,
  };
}

export default useAnimationLinked;
