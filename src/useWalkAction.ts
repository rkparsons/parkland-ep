import { Angle, GroundMesh, Matrix, Ray, Space, Vector3 } from '@babylonjs/core'
import { MutableRefObject, useRef } from 'react'

import { ILoadedModel } from 'react-babylonjs'
import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'

function useWalkAction(
    angle: MutableRefObject<Angle>,
    distance: MutableRefObject<number>,
    model: MutableRefObject<ILoadedModel | undefined>,
    ground: MutableRefObject<GroundMesh | undefined>,
    normal: MutableRefObject<Vector3>
) {
    const maxSpeed = 0.05
    const speedRef = useRef(0)
    const walkAnimation = useAnimation('WalkForward', speedRef)
    //const idleAnimation = useAnimationBlended('Idle', () => distance.current < 1)

    const getAngleFactor = () => {
        const degrees = angle.current.degrees()

        if (degrees < 15 || degrees > 345) {
            return 1
        } else if (degrees < 90 || degrees > 270) {
            return 0.5
        } else {
            return 0
        }
    }

    const getDistanceFactor = () => {
        return distance.current < 2 ? 0.5 : distance.current < 4 ? distance.current / 4 : 1
    }

    const translateRoot = () => {
        if (!ground.current || !model.current || !model.current.rootMesh) {
            return
        }

        speedRef.current = getDistanceFactor() * getAngleFactor()

        if (speedRef.current > 0) {
            const walkSpeed = speedRef.current * maxSpeed
            distance.current -= walkSpeed
            model.current.rootMesh.translate(normal.current, walkSpeed, Space.WORLD)

            model.current.rootMesh.moveWithCollisions(Vector3.Zero())

            // Casting a ray to get height
            let ray = new Ray(
                new Vector3(
                    model.current.rootMesh.position.x,
                    ground.current.getBoundingInfo().boundingBox.maximumWorld.y + 1,
                    model.current.rootMesh.position.z
                ),
                new Vector3(0, 0, 0)
            )
            const worldInverse = new Matrix()
            ground.current.getWorldMatrix().invertToRef(worldInverse)
            ray = Ray.Transform(ray, worldInverse)
            const pickInfo = ground.current.intersects(ray)
            if (pickInfo.hit && pickInfo.pickedPoint) {
                model.current.rootMesh.position.y = pickInfo.pickedPoint.y + 1
            }
        }
    }

    const init = () => {
        walkAnimation.init()
        //idleAnimation.init()
    }

    const render = () => {
        const isActive = angle.current.degrees() < 15 || angle.current.degrees() > 345
        translateRoot()
        walkAnimation.render(isActive)
        //idleAnimation.render()
    }

    return {
        init,
        render,
        speedRef
    }
}

export default useWalkAction
