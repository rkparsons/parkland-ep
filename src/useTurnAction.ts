import { AbstractMesh, Angle, Mesh, Quaternion, Vector3 } from '@babylonjs/core'
import { MutableRefObject, useRef } from 'react'

import { ILoadedModel } from 'react-babylonjs'
import useAnimationBlended from './useAnimationBlended'

// todo: remove translation speed dependency

function useTurnAction(
    rotationSpeed: number,
    angle: MutableRefObject<Angle>,
    distance: MutableRefObject<number>,
    model: MutableRefObject<ILoadedModel | undefined>,
    waypoint: MutableRefObject<Mesh | undefined>
) {
    const quaternationRef = useRef<Quaternion>(Quaternion.Identity())

    const getLeftSpeed = () => {
        const degrees = angle.current.degrees()

        if (degrees < 180) {
            return 0
        }

        return Math.pow(2 - degrees / 180, 0.5)
    }

    const getRightSpeed = () => {
        const degrees = angle.current.degrees()

        if (degrees >= 180) {
            return 0
        }

        return Math.pow(degrees / 180, 0.5)
    }

    const leftAnimation = useAnimationBlended('TurnLeft', getLeftSpeed)
    const rightAnimation = useAnimationBlended('TurnRight', getRightSpeed)

    const getAngleBetweenMeshes = (mesh1: AbstractMesh, mesh2: AbstractMesh) => {
        const v0 = mesh1.getDirection(new Vector3(0, 0, 1)).normalize()
        const v1 = mesh2.position.subtract(mesh1.position).normalize()
        const direction = Vector3.Cross(v0, v1).y < 0 ? -1 : 1

        return Angle.FromRadians(direction * Math.acos(Vector3.Dot(v0, v1)))
    }

    const rotateRoot = () => {
        if (!model.current || !waypoint.current || !model.current.rootMesh?.rotationQuaternion) {
            return
        }

        angle.current = getAngleBetweenMeshes(model.current.rootMesh, waypoint.current)

        const isRotating = distance.current > 0 && Math.abs(angle.current.degrees()) >= 5

        if (isRotating) {
            quaternationRef.current.copyFrom(model.current.rootMesh.rotationQuaternion)

            model.current.rootMesh.lookAt(waypoint.current.position)

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
