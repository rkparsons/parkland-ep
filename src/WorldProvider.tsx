import { AbstractMesh, ActionManager, ExecuteCodeAction, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, Suspense, useRef } from 'react'
import { ILoadedModel, Model, useBeforeRender, useScene } from 'react-babylonjs'
import { cursorPointerOnHover, getModelObjects } from './utils'

import GroundContext from './WorldContext'
import useSpikesObjects from './useSpikesObjects'

type ViewProps = {
    children: ReactNode
}

const WorldProvider: FC<ViewProps> = ({ children }) => {
    const model = useRef<ILoadedModel>()
    const shards = useRef<AbstractMesh[]>([])

    const { initSpikes } = useSpikesObjects(model)

    const solids = useRef<AbstractMesh[]>([])
    const stars = useRef<AbstractMesh[]>([])
    const world = useRef<AbstractMesh>()

    function initHoverObjectsCursor() {
        shards.current
            .concat(solids.current)
            .concat(stars.current)
            .concat(world.current!)
            .forEach(cursorPointerOnHover)
    }

    function onModelLoaded(loadedModel: ILoadedModel) {
        model.current = loadedModel
        world.current = loadedModel.meshes?.find((x) => x.name === 'Planet Top')
        shards.current = getModelObjects(model, 'Shard')
        initSpikes()
        solids.current = getModelObjects(model, 'Solid')
        stars.current = getModelObjects(model, 'Star')

        initHoverObjectsCursor()
    }

    function rotateShards() {
        shards.current.forEach((shard, index) => {
            const plusOrMinus = index % 2 === 0 ? -1 : 1

            shard.rotation.y += plusOrMinus * 0.005
            shard.rotationQuaternion = null
        })
    }

    function rotateSolids() {
        solids.current.forEach((shard) => {
            shard.rotation.x -= 0.0015
            shard.rotation.y -= 0.0015
            shard.rotation.z -= 0.002
            shard.rotationQuaternion = null
        })
    }

    function rotateStars() {
        stars.current.forEach((shard, index) => {
            const plusOrMinus = index % 2 === 0 ? -1 : 1

            shard.rotation.x += plusOrMinus * 0.002
            shard.rotation.y += plusOrMinus * 0.002
            shard.rotation.z += plusOrMinus * 0.002
            shard.rotationQuaternion = null
        })
    }

    useBeforeRender(() => {
        rotateShards()
        rotateSolids()
        rotateStars()
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
