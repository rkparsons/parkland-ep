import { FC, MutableRefObject } from 'react'
import { ILoadedModel, useBeforeRender } from 'react-babylonjs'

import { GroundMesh } from '@babylonjs/core'
import { getCharacterSpeed } from './utils'
import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'
import usePointAndClickControls from './usePointAndClickControls'

type ModelProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    onLoaded(): void
}

type GroundProps = {
    ground: MutableRefObject<GroundMesh | undefined>
}

// todo: move ground to engine
const withPointAndClickControls = (Model: FC<ModelProps>, Ground: FC<GroundProps>) => {
    const modelWithPointAndClickControls = () => {
        const { model, waypoint, ground, distanceToWaypoint, degreesToWaypoint } =
            usePointAndClickControls()
        // todo: use identical animation functions
        const leftAnimation = useAnimationBlended('TurnLeft')
        const rightAnimation = useAnimationBlended('TurnRight')
        const walkAnimation = useAnimation('WalkForward')

        function initAnimations() {
            walkAnimation.init()
            leftAnimation.init()
            rightAnimation.init()
        }

        useBeforeRender(() => {
            const isRotatingLeft =
                distanceToWaypoint.current > 1 &&
                degreesToWaypoint.current > 180 &&
                degreesToWaypoint.current < 330

            const isRotatingRight =
                distanceToWaypoint.current > 1 &&
                degreesToWaypoint.current < 180 &&
                degreesToWaypoint.current > 30

            const characterSpeed = getCharacterSpeed(
                distanceToWaypoint.current,
                degreesToWaypoint.current
            )

            leftAnimation.render(isRotatingLeft)
            rightAnimation.render(isRotatingRight)
            walkAnimation.render(characterSpeed)
        })

        return (
            <>
                <Model model={model} onLoaded={initAnimations} />
                <sphere name="waypoint" ref={waypoint} isVisible={false} />
                <Ground ground={ground} />
            </>
        )
    }

    return modelWithPointAndClickControls
}

export default withPointAndClickControls
