import { AnimationGroup, Quaternion } from '@babylonjs/core'

import { useRef } from 'react'
import { useScene } from 'react-babylonjs'

function useRMRotationAnimation(animationName: string) {
    const initialQuaternion = useRef<Quaternion>(Quaternion.Zero())
    const scene = useScene()

    const getAnimationGroup = () => scene?.getAnimationGroupByName(animationName)

    const getQuaternionTargettedAnimation = (animationGroup: AnimationGroup) =>
        animationGroup.targetedAnimations.filter(
            (x) => x.target.name === 'Root' && x.animation.targetProperty === 'rotationQuaternion'
        )[0]

    const reset = () => {
        const animationGroup = getAnimationGroup()

        if (animationGroup) {
            // const quaternationOffset: Quaternion =
            //     getQuaternionTargettedAnimation(animationGroup).target._rotationQuaternion
            // const keys = getQuaternionTargettedAnimation(animationGroup).animation.getKeys()
            // const newKeys = keys.map((x) => ({
            //     ...x,
            //     value: quaternationOffset.multiply(x.value as Quaternion)
            // }))
            // getQuaternionTargettedAnimation(animationGroup).animation.setKeys(newKeys)
            // animationGroup.play(false)
        }
    }

    const init = () => {
        const animationGroup = getAnimationGroup()

        if (animationGroup) {
            animationGroup.setWeightForAllAnimatables(1)
            initialQuaternion.current =
                getQuaternionTargettedAnimation(animationGroup).target._rotationQuaternion
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
