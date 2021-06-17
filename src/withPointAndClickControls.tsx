import React, { FC, useRef } from 'react'

import Ground from './Ground'
import { GroundMesh } from '@babylonjs/core'
import { ILoadedModel } from 'react-babylonjs'
import usePointAndClickControls from './usePointAndClickControls'

type ChildProps = {
    onModelLoaded: (model: ILoadedModel) => void
}

const withPointAndClickControls = (Component: FC<ChildProps>) => {
    // todo: pass configurable ground
    const componentWithPointAndClickControls = () => {
        const groundRef = useRef<GroundMesh>()
        const { waypointRef, initControls } = usePointAndClickControls(groundRef)

        return (
            <>
                <Component onModelLoaded={initControls} />
                <sphere name="waypoint" ref={waypointRef} isVisible={false} />
                <Ground groundRef={groundRef} />
            </>
        )
    }

    return componentWithPointAndClickControls
}

export default withPointAndClickControls
