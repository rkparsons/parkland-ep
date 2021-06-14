import { AnimationGroup, Quaternion, Vector3 } from '@babylonjs/core'

import { useRef } from 'react'
import { useScene } from 'react-babylonjs'

function useRMRotationAnimation(animationName: string) {
    const scene = useScene()
    const quaternionOffset = useRef(Quaternion.Zero())

    const getAnimationGroup = () => scene?.getAnimationGroupByName(animationName)

    const getQuaternionAnimation = (animationGroup: AnimationGroup) =>
        animationGroup.targetedAnimations.filter(
            (x) => x.target.name === 'Root' && x.animation.targetProperty === 'rotationQuaternion'
        )[0].animation

    const reset = () => {
        const animationGroup = getAnimationGroup()

        if (animationGroup) {
            const newKeys = getQuaternionAnimation(animationGroup)
                .getKeys()
                .map((x) => ({
                    ...x,
                    value: (x.value as Quaternion).add(quaternionOffset.current)
                }))
            getQuaternionAnimation(animationGroup).setKeys(newKeys)
            animationGroup.play(false)
        }
    }

    const init = () => {
        const animationGroup = getAnimationGroup()

        if (animationGroup) {
            const keys = getQuaternionAnimation(animationGroup).getKeys()

            quaternionOffset.current = keys[keys.length - 1].value

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

export default useRMRotationAnimation
