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
    const highlightLayer = useRef<HighlightLayer>()

    const onModelLoaded = (loadedModel: ILoadedModel) => {
        world.current = loadedModel.meshes?.find((x) => x.name === 'Planet Top')
        octahedron.current = loadedModel.meshes?.find((x) => x.name === 'octahedron ') as Mesh

        highlightLayer.current = new HighlightLayer('octahedronHighlight', scene!)
        highlightLayer.current.isEnabled = false
        highlightLayer.current.addMesh(
            octahedron.current,
            new Color3(162 / 255, 140 / 255, 147 / 255)
        )
        highlightLayer.current.blurHorizontalSize = 5
        highlightLayer.current.blurVerticalSize = 5

        octahedron.current.actionManager = new ActionManager(scene!)
        octahedron.current.actionManager.registerAction(
            new SetValueAction(
                ActionManager.OnPointerOverTrigger,
                highlightLayer.current,
                'isEnabled',
                true
            )
        )
        octahedron.current.actionManager.registerAction(
            new SetValueAction(
                ActionManager.OnPointerOutTrigger,
                highlightLayer.current,
                'isEnabled',
                false
            )
        )
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
