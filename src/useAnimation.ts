import { MutableRefObject } from 'react'
import { useScene } from 'react-babylonjs'

function useAnimation(animationName: string, speedFactor: MutableRefObject<number>) {
    const scene = useScene()

    const init = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        animationGroup?.play(true)
        animationGroup?.setWeightForAllAnimatables(1)
    }

    const render = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        if (animationGroup) {
            animationGroup.speedRatio = speedFactor.current
        }
    }

    return {
        init,
        render
    }
}

export default useAnimation
