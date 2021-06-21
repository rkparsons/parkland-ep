import { Angle, Mesh, Quaternion } from '@babylonjs/core'
import { MutableRefObject, useRef } from 'react'

import { ILoadedModel } from 'react-babylonjs'
import useAnimationBlended from './useAnimationBlended'

function useTurnAction(
    angle: MutableRefObject<Angle>,
    distance: MutableRefObject<number>,
    model: MutableRefObject<ILoadedModel | undefined>,
    waypoint: MutableRefObject<Mesh | undefined>,
    getIsTurningLeft: () => boolean,
    getIsTurningRight: () => boolean
) {
    const rotationSpeed = 0.02
    const quaternationRef = useRef<Quaternion>(Quaternion.Identity())

    const leftAnimation = useAnimationBlended('TurnLeft', getIsTurningLeft)
    const rightAnimation = useAnimationBlended('TurnRight', getIsTurningRight)

    const rotateRoot = () => {
        if (!model.current || !waypoint.current || !model.current.rootMesh?.rotationQuaternion) {
            return
        }

        const isRotating = distance.current >= 1 && Math.abs(angle.current.degrees()) >= 5

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
