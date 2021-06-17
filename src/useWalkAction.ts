import { Angle, GroundMesh, Matrix, Ray, Space, Vector3 } from '@babylonjs/core'
import { MutableRefObject, useRef } from 'react'

import { ILoadedModel } from 'react-babylonjs'
import useAnimation from './useAnimation'
import useAnimationLinked from './useAnimationLinked'

function useWalkAction(
    maxSpeed: number,
    angleRef: MutableRefObject<number>,
    distVecRef: MutableRefObject<number>,
    modelRef: MutableRefObject<ILoadedModel | undefined>,
    groundRef: MutableRefObject<GroundMesh | undefined>,
    targetVecNormRef: MutableRefObject<Vector3>
) {
    const speedRef = useRef(0)
    const walkAnimation = useAnimation('WalkForward', speedRef)
    const idleAnimation = useAnimationLinked('Idle', () => (speedRef.current ? 0 : 1))

    const getSpeedFactor = () => {
        const degrees = Angle.FromRadians(angleRef.current).degrees()
        const angleFactor =
            degrees < 90 ? 1 - degrees / 90 : degrees > 270 ? (degrees - 270) / 90 : 0
        const distanceFactor =
            distVecRef.current < 2 ? 0.5 : distVecRef.current < 4 ? distVecRef.current / 4 : 1

        return angleFactor * distanceFactor
    }

    const translateRoot = () => {
        if (!groundRef.current || !modelRef.current || !modelRef.current.rootMesh) {
            return
        }

        speedRef.current = getSpeedFactor()

        if (speedRef.current > 0) {
            const walkSpeed = speedRef.current * maxSpeed
            distVecRef.current -= walkSpeed
            modelRef.current.rootMesh.translate(targetVecNormRef.current, walkSpeed, Space.WORLD)

            modelRef.current.rootMesh.moveWithCollisions(Vector3.Zero())

            // Casting a ray to get height
            let ray = new Ray(
                new Vector3(
                    modelRef.current.rootMesh.position.x,
                    groundRef.current.getBoundingInfo().boundingBox.maximumWorld.y + 1,
                    modelRef.current.rootMesh.position.z
                ),
                new Vector3(0, 0, 0)
            )
            const worldInverse = new Matrix()
            groundRef.current.getWorldMatrix().invertToRef(worldInverse)
            ray = Ray.Transform(ray, worldInverse)
            const pickInfo = groundRef.current.intersects(ray)
            if (pickInfo.hit && pickInfo.pickedPoint) {
                modelRef.current.rootMesh.position.y = pickInfo.pickedPoint.y + 1
            }
        }
    }

    const init = () => {
        walkAnimation.init()
        idleAnimation.init()
    }

    const render = () => {
        translateRoot()
        walkAnimation.render()
        idleAnimation.render()
    }

    return {
        init,
        render,
        speedRef
    }
}

export default useWalkAction
