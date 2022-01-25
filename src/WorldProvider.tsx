import { AbstractMesh, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, Suspense, useRef } from 'react'
import { ILoadedModel, Model, useScene } from 'react-babylonjs'

import GroundContext from './WorldContext'

type ViewProps = {
    children: ReactNode
}

const WorldProvider: FC<ViewProps> = ({ children }) => {
    const world = useRef<AbstractMesh>()

    const onModelLoaded = (loadedModel: ILoadedModel) => {
        world.current = loadedModel.meshes?.find((x) => x.name === 'Planet')
    }

    return (
        <GroundContext.Provider value={{ world }}>
            {children}
            {/* <Suspense fallback={null}>
                <Model
                    name="world"
                    position={Vector3.Zero()}
                    scaling={new Vector3(10, 10, 10)}
                    rootUrl={`${process.env.PUBLIC_URL}/`}
                    sceneFilename="World.glb"
                    checkCollisions={true}
                    onModelLoaded={onModelLoaded}
                />
            </Suspense> */}
            <Suspense fallback={null}>
                <Model
                    name="satellite"
                    position={new Vector3(0, 93, 10)}
                    scaling={new Vector3(10, 10, 10)}
                    rootUrl={`${process.env.PUBLIC_URL}/`}
                    sceneFilename="Satellite.glb"
                    checkCollisions={false}
                />
            </Suspense>
        </GroundContext.Provider>
    )
}

export default WorldProvider
