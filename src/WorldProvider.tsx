import { AbstractMesh, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, Suspense, useRef } from 'react'
import { ILoadedModel, Model } from 'react-babylonjs'

import GroundContext from './WorldContext'

type ViewProps = {
    children: ReactNode
}

const WorldProvider: FC<ViewProps> = ({ children }) => {
    const world = useRef<AbstractMesh>()

    const onModelLoaded = (loadedModel: ILoadedModel) => {
        const planet = loadedModel.meshes?.find((x) => x.name === 'Planet')

        // loadedModel.meshes?.forEach((x => console.log(x.name))

        if (planet) {
            console.log(planet.position)
            planet.position = Vector3.Zero()
            world.current = planet
        }
    }

    return (
        <GroundContext.Provider value={{ world }}>
            {children}
            <Suspense fallback={null}>
                <Model
                    name="world"
                    position={Vector3.Zero()}
                    scaling={new Vector3(10, 10, 10)}
                    rootUrl={`${process.env.PUBLIC_URL}/`}
                    sceneFilename="World.glb"
                    checkCollisions={true}
                    onModelLoaded={onModelLoaded}
                />
            </Suspense>
        </GroundContext.Provider>
    )
}

export default WorldProvider
