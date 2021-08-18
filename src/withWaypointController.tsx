import { ModelProps, WaypointControllerProps } from './types'
import { rotateCharacterTowardsWaypoint, translateCharacterTowardsWaypoint } from './utils'

import { FC } from 'react'
import { useBeforeRender } from 'react-babylonjs'
import useGroundContext from './useGroundContext'

// todo: separate root motion from waypoint logic if possible
const withWaypointController = (Model: FC<ModelProps>) => {
    const waypointController: FC<WaypointControllerProps> = ({
        model,
        waypoint,
        distanceToWaypoint,
        degreesToWaypoint,
        isInitialised
    }) => {
        const { ground } = useGroundContext()

        function rootMotion(characterSpeed: number) {
            if (!model.current?.rootMesh || !waypoint.current || !ground.current) {
                return
            }

            if (distanceToWaypoint.current >= 1) {
                rotateCharacterTowardsWaypoint(model.current?.rootMesh, waypoint.current, 0.02)
            }

            translateCharacterTowardsWaypoint(
                model.current.rootMesh,
                waypoint.current,
                ground.current,
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
                getIsRotatingLeft={getIsRotatingLeft}
                getIsRotatingRight={getIsRotatingRight}
                getSpeed={getSpeed}
            />
        )
    }

    return waypointController
}

export default withWaypointController
