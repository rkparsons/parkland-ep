import {
    AbstractMesh,
    ActionManager,
    Color3,
    GlowLayer,
    HighlightLayer,
    InterpolateValueAction,
    Mesh,
    SetValueAction,
    Vector3
} from '@babylonjs/core'
import { FC, ReactNode, Suspense, useEffect, useRef, useState } from 'react'
import { ILoadedModel, Model, useHover, useScene } from 'react-babylonjs'

import GroundContext from './WorldContext'

type ViewProps = {
    children: ReactNode
}

const WorldProvider: FC<ViewProps> = ({ children }) => {
    const world = useRef<AbstractMesh>()
    const octahedron = useRef<Mesh | null>(null)
    const scene = useScene()
    const highlightLayer = useRef<HighlightLayer>(null)

    const onModelLoaded = (loadedModel: ILoadedModel) => {
        world.current = loadedModel.meshes?.find((x) => x.name === 'Planet Top')
        octahedron.current = loadedModel.meshes?.find((x) => x.name === 'octahedron ') as Mesh
        highlightLayer.current!.addMesh(octahedron.current, Color3.White())
    }

    useHover(
        () => {
            if (highlightLayer.current) {
                highlightLayer.current.isEnabled = true
            }
        },
        () => {
            if (highlightLayer.current) {
                highlightLayer.current.isEnabled = false
            }
        },
        octahedron
    )

    return (
        <GroundContext.Provider value={{ world }}>
            {children}
            <highlightLayer name="hl" ref={highlightLayer} />
            <Suspense fallback={null}>
                <Model
                    name="world"
                    position={Vector3.Zero()}
                    scaling={new Vector3(10, 10, 10)}
                    rootUrl={`${process.env.PUBLIC_URL}/`}
                    sceneFilename="World.glb"
                    onModelLoaded={onModelLoaded}
                />
            </Suspense>
            <Suspense fallback={null}>
                <Model
                    name="satellite"
                    position={new Vector3(0, 93, 10)}
                    scaling={new Vector3(10, 10, 10)}
                    rootUrl={`${process.env.PUBLIC_URL}/`}
                    sceneFilename="Satellite.glb"
                />
            </Suspense>
        </GroundContext.Provider>
    )
}

export default WorldProvider
