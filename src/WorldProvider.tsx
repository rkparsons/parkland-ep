import { AbstractMesh, ActionManager, ExecuteCodeAction, Mesh, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, Suspense, useEffect, useRef, useState } from 'react'
import { ILoadedModel, Model, useBeforeRender, useHover, useScene } from 'react-babylonjs'

import GroundContext from './WorldContext'

type ViewProps = {
    children: ReactNode
}

const meshNames = [
    'Cube with peaks',
    'Pokemon',
    'Cross',
    'Anvil',
    'TCube',
    'Double tetrahedron',
    'dodecahedron',
    'Star',
    'octahedron ',
    'Rock',
    'wheel',
    'Classic Solid',
    'Solid',
    'FO1',
    'FO2',
    'FO3'
]

const WorldProvider: FC<ViewProps> = ({ children }) => {
    const model = useRef<ILoadedModel>()
    const world = useRef<AbstractMesh>()
    const scene = useScene()

    function initMeshHoverCursor() {
        model.current?.meshes
            ?.filter(({ name }) => meshNames.includes(name))
            .forEach((mesh) => {
                mesh.actionManager = new ActionManager(scene!)
                mesh.actionManager.registerAction(
                    new ExecuteCodeAction(
                        ActionManager.OnPointerOverTrigger,
                        () => (scene!.hoverCursor = 'pointer')
                    )
                )
            })
    }

    function onModelLoaded(loadedModel: ILoadedModel) {
        model.current = loadedModel
        world.current = loadedModel.meshes?.find((x) => x.name === 'Planet Top')

        initMeshHoverCursor()
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
        </GroundContext.Provider>
    )
}

export default WorldProvider
