import { Vector3 } from '@babylonjs/core'
import { useRef } from 'react'
import { useScene } from 'react-babylonjs'

function useRMAnimation(animationName: string) {
    const scene = useScene()
    const valueOffset = useRef(Vector3.Zero())

    const getAnimationGroup = () => scene?.getAnimationGroupByName(animationName)

    const reset = () => {
        const animationGroup = getAnimationGroup()

        if (animationGroup) {
            const newKeys = animationGroup.targetedAnimations[0].animation
                .getKeys()
                .map((x) => ({ ...x, value: (x.value as Vector3).add(valueOffset.current) }))
            animationGroup.targetedAnimations[0].animation.setKeys(newKeys)
            animationGroup.play(false)
        }
    }

    const init = () => {
        const animationGroup = getAnimationGroup()

        if (animationGroup) {
            const keys = animationGroup.targetedAnimations[0].animation.getKeys()
            valueOffset.current = keys[keys.length - 1].value

            animationGroup.speedRatio = 0
            animationGroup.play(false)
            animationGroup.onAnimationGroupEndObservable.add(reset)
        }
    }

    const render = () => {
        const animationGroup = getAnimationGroup()

        if (animationGroup) {
            animationGroup.speedRatio = 0.5
        }
    }

    return {
        init,
        render
    }
}

export default useRMAnimation
