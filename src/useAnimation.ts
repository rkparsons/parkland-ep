import { AbstractMesh, Space, Vector3 } from '@babylonjs/core'
import { MutableRefObject, useRef } from 'react'

import { useScene } from 'react-babylonjs'

function useAnimation(animationName: string, modelRef: MutableRefObject<AbstractMesh | undefined>) {
    const scene = useScene()
    const rootVector = useRef<Vector3>(Vector3.Zero())
    const isPendingRestart = useRef(false)

    const init = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        if (!animationGroup) {
            return
        }

        rootVector.current =
            animationGroup.targetedAnimations[0].animation.getKeys().slice(-1)[0].value ||
            Vector3.Zero()

        animationGroup.play(false)
        animationGroup.setWeightForAllAnimatables(1)

        animationGroup.onAnimationGroupEndObservable.add(() => {
            isPendingRestart.current = true
            const newKeys = animationGroup.targetedAnimations[0].animation
                .getKeys()
                .map((x) => ({ ...x, value: (x.value as Vector3).add(rootVector.current) }))
            animationGroup.targetedAnimations[0].animation.setKeys(newKeys)
            animationGroup?.play(false)
            // modelRef.current?.translate(rootVector.current, 1, Space.LOCAL)
        })
    }

    const render = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)
    }

    return {
        init,
        render
    }
}

export default useAnimation
