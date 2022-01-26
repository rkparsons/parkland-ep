import { AbstractMesh, ActionManager, ExecuteCodeAction, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, Suspense, useRef } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'

import GroundContext from './WorldContext'

type ViewProps = {
    children: ReactNode
}

const WorldProvider: FC<ViewProps> = ({ children }) => {
    const model = useRef<ILoadedModel>()
    const shards = useRef<AbstractMesh[]>([])
    const spikes = useRef<AbstractMesh[]>([])
    const solids = useRef<AbstractMesh[]>([])
    const stars = useRef<AbstractMesh[]>([])
    const world = useRef<AbstractMesh>()
    const scene = useScene()

    function initHoverObjectsCursor() {
        shards.current
            .concat(spikes.current)
            .concat(solids.current)
            .concat(stars.current)
            .concat(world.current!)
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

    function getWorldObjects(typeName: string) {
        return model.current?.meshes?.filter(({ name }) => name.includes(typeName)) || []
    }

    function onModelLoaded(loadedModel: ILoadedModel) {
        model.current = loadedModel
        world.current = loadedModel.meshes?.find((x) => x.name === 'Planet Top')
        shards.current = getWorldObjects('Shard')
        spikes.current = getWorldObjects('Spikes')
        solids.current = getWorldObjects('Solid')
        stars.current = getWorldObjects('Star')

        initHoverObjectsCursor()
    }

    function rotateShards() {
        shards.current.forEach((shard) => {
            shard.rotation.y += 0.005
            shard.rotationQuaternion = null
        })
    }

    function rotateNonShards() {
        spikes.current
            .concat(solids.current)
            .concat(stars.current)
            .forEach((shard) => {
                shard.rotation.x += 0.002
                shard.rotation.y += 0.002
                shard.rotation.z += 0.002
                shard.rotationQuaternion = null
            })
    }

    useBeforeRender(() => {
        rotateShards()
        rotateNonShards()
    })

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
