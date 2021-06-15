import { AbstractMesh, Mesh, Quaternion, Vector3 } from '@babylonjs/core'
import { MutableRefObject, useRef } from 'react'

import { ILoadedModel } from 'react-babylonjs'
import useAnimationBlended from './useAnimationBlended'

// todo: remove translation speed dependency

function useTurnAction(
    rotationSpeed: number,
    translationSpeed: number,
    angleRef: MutableRefObject<number>,
    distVecRef: MutableRefObject<number>,
    model: MutableRefObject<ILoadedModel | undefined>,
    waypointRef: MutableRefObject<Mesh | undefined>
) {
    const quaternationRef = useRef<Quaternion>(Quaternion.Identity())
    const leftAnimation = useAnimationBlended(
        'TurnLeft',
        () => distVecRef.current >= translationSpeed && angleRef.current < -50 * rotationSpeed
    )
    const rightAnimation = useAnimationBlended(
        'TurnRight',
        () => distVecRef.current >= translationSpeed && angleRef.current > 50 * rotationSpeed
    )

    const getAngleBetweenMeshes = (mesh1: AbstractMesh, mesh2: AbstractMesh) => {
        const v0 = mesh1.getDirection(new Vector3(0, 0, 1)).normalize()
        const v1 = mesh2.position.subtract(mesh1.position).normalize()
        const direction = Vector3.Cross(v0, v1).y < 0 ? -1 : 1

        return direction * Math.acos(Vector3.Dot(v0, v1))
    }

    const rotateRoot = () => {
        if (!model.current || !waypointRef.current || !model.current.rootMesh?.rotationQuaternion) {
            return
        }

        angleRef.current = getAngleBetweenMeshes(model.current.rootMesh, waypointRef.current)

        const isRotating = distVecRef.current > 0 && Math.abs(angleRef.current) >= rotationSpeed

        if (isRotating) {
            quaternationRef.current.copyFrom(model.current.rootMesh.rotationQuaternion)

            model.current.rootMesh.lookAt(waypointRef.current.position)

            Quaternion.SlerpToRef(
                quaternationRef.current,
                model.current.rootMesh.rotationQuaternion,
                rotationSpeed,
                model.current.rootMesh.rotationQuaternion
            )
        }
    }

    const init = () => {
        leftAnimation.init()
        rightAnimation.init()
    }

    const render = () => {
        rotateRoot()
        leftAnimation.render()
        rightAnimation.render()
    }

    return {
        init,
        render
    }
}

export default useTurnAction
