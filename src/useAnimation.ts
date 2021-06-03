import { useRef } from 'react'
import { useScene } from 'react-babylonjs'

function useAnimation(animationName: string, getIsActive: () => boolean) {
    const scene = useScene()
    const speed = useRef(0)
    const acceleration = 0.05

    const init = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        animationGroup?.play(true)
        animationGroup?.setWeightForAllAnimatables(0)
    }

    const render = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)
        const isActive = getIsActive()

        if (isActive && speed.current < 1) {
            speed.current += acceleration
        } else if (!isActive && speed.current > 0) {
            speed.current -= acceleration
        }

        animationGroup?.setWeightForAllAnimatables(speed.current)
    }

    return {
        init,
        render
    }
}

export default useAnimation
