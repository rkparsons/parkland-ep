import { AnimationGroup, Vector3 } from '@babylonjs/core'

import { useScene } from 'react-babylonjs'

function useRMAnimation(animationName: string) {
    const scene = useScene()

    const reset = (animationGroup: AnimationGroup, valueOffset: Vector3) => {
        const newKeys = animationGroup.targetedAnimations[0].animation
            .getKeys()
            .map((x) => ({ ...x, value: (x.value as Vector3).add(valueOffset) }))
        animationGroup.targetedAnimations[0].animation.setKeys(newKeys)
        animationGroup?.play(false)
    }

    const init = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        const valueOffset = animationGroup?.targetedAnimations[0].animation.getKeys().slice(-1)[0]
            .value as Vector3

        animationGroup?.play(false)

        animationGroup?.onAnimationGroupEndObservable.add(() => reset(animationGroup, valueOffset))
    }

    const render = () => {
        console.log('render')
    }

    return {
        init,
        render
    }
}

export default useRMAnimation
