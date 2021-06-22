import { ModelProps, ModelWithWaypointProps } from './types'
import { getCharacterSpeed, rotateCharacter, translateCharacter } from './utils'

import { FC } from 'react'
import { useBeforeRender } from 'react-babylonjs'
import useGroundContext from './useGroundContext'

// todo: separate root motion from waypoint logic if possible
const withWaypoint = (Model: FC<ModelProps>) => {
    const modelWithWaypoint: FC<ModelWithWaypointProps> = ({
        model,
        waypoint,
        distanceToWaypoint,
        degreesToWaypoint
    }) => {
        const { ground } = useGroundContext()

        function rootMotion(characterSpeed: number) {
            if (!model.current?.rootMesh || !waypoint.current || !ground.current) {
                return
            }

            if (distanceToWaypoint.current >= 1) {
                rotateCharacter(model.current?.rootMesh, waypoint.current, 0.02)
            }

            translateCharacter(
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
            return getCharacterSpeed(distanceToWaypoint.current, degreesToWaypoint.current)
        }

        useBeforeRender(() => {
            const characterSpeed = getCharacterSpeed(
                distanceToWaypoint.current,
                degreesToWaypoint.current
            )

            rootMotion(characterSpeed)
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

    return modelWithWaypoint
}

export default withWaypoint
