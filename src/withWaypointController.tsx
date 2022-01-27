import { ModelProps, WaypointControllerProps } from './types'
import { rotateCharacterTowardsPoint, translateCharacterTowardsPoint } from './utils'

import { FC } from 'react'
import { useBeforeRender } from 'react-babylonjs'
import useWorldContext from './useWorldContext'

// todo: separate root motion from waypoint logic if possible
const withWaypointController = (Model: FC<ModelProps>) => {
    const waypointController: FC<WaypointControllerProps> = ({
        model,
        headBone,
        subWaypoints,
        activeSubWaypointIndex,
        distanceToWaypoint,
        degreesToWaypoint,
        isInitialised
    }) => {
        const { ground: world } = useWorldContext()

        function rootMotion(characterSpeed: number) {
            const activeSubWaypoint = subWaypoints.current[activeSubWaypointIndex]

            if (!model.current?.rootMesh || !activeSubWaypoint || !world.current) {
                return
            }

            if (distanceToWaypoint.current >= 1) {
                rotateCharacterTowardsPoint(
                    model.current?.rootMesh,
                    activeSubWaypoint.position,
                    0.02
                )
            }

            translateCharacterTowardsPoint(
                model.current.rootMesh,
                activeSubWaypoint.position,
                characterSpeed,
                0.05
            )
        }

        function getIsRotatingLeft() {
            return (
                distanceToWaypoint.current > 1 &&
                degreesToWaypoint.current > 180 &&
                degreesToWaypoint.current < 330
            )
        }

        function getIsRotatingRight() {
            return (
                distanceToWaypoint.current > 1 &&
                degreesToWaypoint.current < 180 &&
                degreesToWaypoint.current > 30
            )
        }

        function getSpeed() {
            if (!isInitialised) {
                return 0
            }
            const distanceFactor =
                distanceToWaypoint.current < 2
                    ? 0.5
                    : distanceToWaypoint.current < 4
                    ? distanceToWaypoint.current / 4
                    : 1
            const angleFactor =
                degreesToWaypoint.current < 15 || degreesToWaypoint.current > 345
                    ? 1
                    : degreesToWaypoint.current < 90 || degreesToWaypoint.current > 270
                    ? 0.2
                    : 0

            return distanceFactor * angleFactor
        }

        useBeforeRender(() => {
            if (isInitialised) {
                rootMotion(getSpeed())
            }
        })

        return (
            <Model
                model={model}
                headBone={headBone}
                getIsRotatingLeft={getIsRotatingLeft}
                getIsRotatingRight={getIsRotatingRight}
                getSpeed={getSpeed}
            />
        )
    }

    return waypointController
}

export default withWaypointController
