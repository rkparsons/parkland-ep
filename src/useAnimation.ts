import { AbstractMesh, Vector3 } from '@babylonjs/core'

import { MutableRefObject } from 'react'
import { useScene } from 'react-babylonjs'

function useAnimation(animationName: string, modelRef: MutableRefObject<AbstractMesh | undefined>) {
    const scene = useScene()

    const init = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)

        animationGroup?.play(true)
        animationGroup?.setWeightForAllAnimatables(1)

        animationGroup?.onAnimationGroupEndObservable.add(() => {
            console.log(modelRef.current)
            modelRef.current!.subMeshes[0].getMesh().position.z += 10
            // animationGroup?.play(false)
        })
    }

    const render = () => {
        const animationGroup = scene?.getAnimationGroupByName(animationName)
        // console.log(modelRef.current?.skeleton)
    }

    return {
        init,
        render
    }
}

export default useAnimation
