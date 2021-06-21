import { useRef } from 'react'
import { useScene } from 'react-babylonjs'

function useBlendedAnimation(animationName: string, getTargetSpeed: () => number) {
    const scene = useScene()
    const speed = useRef(0)
    const acceleration = 0.02

    const init = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        animationGroup?.play(true)
        animationGroup?.setWeightForAllAnimatables(0)
    }

    const render = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)
        const targetSpeed = getTargetSpeed()

        if (targetSpeed > speed.current) {
            speed.current += acceleration
        } else if (targetSpeed < speed.current) {
            speed.current = targetSpeed
        }

        animationGroup?.setWeightForAllAnimatables(speed.current)
    }

    return {
        speed,
        init,
        render
    }
}

export default useBlendedAnimation
