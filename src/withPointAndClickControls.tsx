import { FC, MutableRefObject } from 'react'

import { GroundMesh } from '@babylonjs/core'
import { ILoadedModel } from 'react-babylonjs'
import usePointAndClickControls from './usePointAndClickControls'

type ModelProps = {
    onModelLoaded: (model: ILoadedModel) => void
}

type GroundProps = {
    ground: MutableRefObject<GroundMesh | undefined>
}

const withPointAndClickControls = (Model: FC<ModelProps>, Ground: FC<GroundProps>) => {
    const modelWithPointAndClickControls = () => {
        const { waypoint, ground, initControls } = usePointAndClickControls()

        return (
            <>
                <Model onModelLoaded={initControls} />
                <sphere name="waypoint" ref={waypoint} isVisible={false} />
                <Ground ground={ground} />
            </>
        )
    }

    return modelWithPointAndClickControls
}

export default withPointAndClickControls
