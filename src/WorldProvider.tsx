import { AbstractMesh, Vector3 } from '@babylonjs/core'
import { FC, ReactNode, Suspense, useRef } from 'react'
import { ILoadedModel, Model } from 'react-babylonjs'

import GroundContext from './WorldContext'
import { cursorPointerOnHover } from './utils'
import useWorldMeshes from './useWorldMeshes'

type ViewProps = {
    children: ReactNode
}

const WorldProvider: FC<ViewProps> = ({ children }) => {
    const model = useRef<ILoadedModel>()
    const world = useRef<AbstractMesh>()

    const { init: initShards } = useWorldMeshes(model, 'Shard', (mesh, index) => {
        const plusOrMinus = index % 2 === 0 ? -1 : 1

        mesh.rotation.y += plusOrMinus * 0.005
        mesh.rotationQuaternion = null
    })
    const { init: initSpikes } = useWorldMeshes(model, 'Spikes', (mesh, index) => {
        const plusOrMinus = index % 2 === 0 ? -1 : 1

        mesh.rotation.x += 0.0015
        mesh.rotation.y += 0.001
        mesh.rotation.z += plusOrMinus * 0.0015
        mesh.rotationQuaternion = null
    })
    const { init: initSolids } = useWorldMeshes(model, 'Solid', (mesh) => {
        mesh.rotation.x -= 0.0015
        mesh.rotation.y -= 0.0015
        mesh.rotation.z -= 0.002
        mesh.rotationQuaternion = null
    })
    const { init: initStars } = useWorldMeshes(model, 'Star', (mesh, index) => {
        const plusOrMinus = index % 2 === 0 ? -1 : 1

        mesh.rotation.x += plusOrMinus * 0.002
        mesh.rotation.y += plusOrMinus * 0.002
        mesh.rotation.z += plusOrMinus * 0.002
        mesh.rotationQuaternion = null
    })

    function onModelLoaded(loadedModel: ILoadedModel) {
        model.current = loadedModel
        world.current = loadedModel.meshes?.find((x) => x.name === 'Planet Top')
        initShards()
        initSpikes()
        initSolids()
        initStars()
        cursorPointerOnHover(world.current!)
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
