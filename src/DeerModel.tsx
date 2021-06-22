import { FC, Suspense } from 'react'
import { ILoadedModel, Model, useBeforeRender } from 'react-babylonjs'
import { Quaternion, Tools, Vector3 } from '@babylonjs/core'

import { ModelProps } from './types'
import useAnimation from './useAnimation'
import useAnimationBlended from './useAnimationBlended'

// todo: replace with getSpeed methods for left, right and straight
const DeerModel: FC<ModelProps> = ({ model, getIsRotatingLeft, getIsRotatingRight, getSpeed }) => {
    // todo: use identical animation functions
    const leftAnimation = useAnimationBlended('TurnLeft')
    const rightAnimation = useAnimationBlended('TurnRight')
    const walkAnimation = useAnimation('WalkForward')

    const onModelLoaded = (loadedModel: ILoadedModel) => {
        model.current = loadedModel

        loadedModel.animationGroups?.forEach((animationGroup) => {
            animationGroup.stop()
        })

        walkAnimation.init()
        leftAnimation.init()
        rightAnimation.init()
    }

    useBeforeRender(() => {
        const isRotatingLeft = getIsRotatingLeft()
        const isRotatingRight = getIsRotatingRight()
        const isRotating = isRotatingLeft || isRotatingRight

        leftAnimation.render(isRotatingLeft)
        rightAnimation.render(isRotatingRight)
        walkAnimation.render(getSpeed(), !isRotating)
    })

    return (
        <Suspense fallback={null}>
            <Model
                name="deer"
                position={Vector3.Zero()}
                rootUrl={`${process.env.PUBLIC_URL}/`}
                sceneFilename="Deer.glb"
                scaleToDimension={3}
                rotation={new Vector3(0, Tools.ToRadians(240), 0)}
                onModelLoaded={onModelLoaded}
                checkCollisions={true}
                rotationQuaternion={Quaternion.Identity()}
            />
        </Suspense>
    )
}

export default DeerModel
