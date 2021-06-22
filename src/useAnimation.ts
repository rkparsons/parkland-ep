import { useRef } from 'react'
import { useScene } from 'react-babylonjs'

function useAnimation(animationName: string) {
    const scene = useScene()
    const weight = useRef(0)
    const blendSpeed = 0.05

    function init() {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        if (animationGroup) {
            animationGroup.play(true)
            animationGroup?.setWeightForAllAnimatables(0)
        }
    }

    function render(speed: number, isActive: boolean) {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        if (!animationGroup) {
            return
        }

        animationGroup.speedRatio = speed

        if (isActive && weight.current < 1) {
            weight.current += blendSpeed
        } else if (!isActive && weight.current > 0) {
            weight.current -= blendSpeed
        }

        animationGroup.setWeightForAllAnimatables(weight.current)
    }

    return {
        init,
        render
    }
}

export default useAnimation
