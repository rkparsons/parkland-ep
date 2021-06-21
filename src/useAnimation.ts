import { useScene } from 'react-babylonjs'

function useAnimation(animationName: string) {
    const scene = useScene()

    const init = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        if (animationGroup) {
            animationGroup.play(true)
            animationGroup.setWeightForAllAnimatables(1)
        }
    }

    const render = (speed: number) => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        if (animationGroup) {
            animationGroup.speedRatio = speed
        }
    }

    return {
        init,
        render
    }
}

export default useAnimation
