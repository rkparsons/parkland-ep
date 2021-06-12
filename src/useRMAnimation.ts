import { Vector3 } from '@babylonjs/core'
import { useScene } from 'react-babylonjs'

function useRMAnimation(animationName: string) {
    const scene = useScene()

    const init = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        const animationOffset = animationGroup?.targetedAnimations[0].animation
            .getKeys()
            .slice(-1)[0].value as Vector3

        animationGroup?.play(false)
        animationGroup?.setWeightForAllAnimatables(1)

        animationGroup?.onAnimationGroupEndObservable.add(() => {
            const newKeys = animationGroup.targetedAnimations[0].animation
                .getKeys()
                .map((x) => ({ ...x, value: (x.value as Vector3).add(animationOffset) }))
            animationGroup.targetedAnimations[0].animation.setKeys(newKeys)
            animationGroup?.play(false)
        })
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
