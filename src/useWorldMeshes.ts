import { MutableRefObject, useRef } from 'react'

import { AbstractMesh } from '@babylonjs/core'
import { ILoadedModel } from 'react-babylonjs'
import { cursorPointerOnHover } from './utils'
import useWorldMeshesOfType from './useWorldMeshesOfType'

const useWorldMeshes = () => {
    const ground = useRef<AbstractMesh>()

    const { init: initShards } = useWorldMeshesOfType('Shard', (mesh, index) => {
        const plusOrMinus = index % 2 === 0 ? -1 : 1

        mesh.rotation.y += plusOrMinus * 0.005
        mesh.rotationQuaternion = null
    })
    const { init: initSpikes } = useWorldMeshesOfType('Spikes', (mesh, index) => {
        const plusOrMinus = index % 2 === 0 ? -1 : 1

        mesh.rotation.x += 0.0015
        mesh.rotation.y += 0.001
        mesh.rotation.z += plusOrMinus * 0.0015
        mesh.rotationQuaternion = null
    })
    const { init: initSolids } = useWorldMeshesOfType('Solid', (mesh) => {
        mesh.rotation.x -= 0.0015
        mesh.rotation.y -= 0.0015
        mesh.rotation.z -= 0.002
        mesh.rotationQuaternion = null
    })
    const { init: initStars } = useWorldMeshesOfType('Star', (mesh, index) => {
        const plusOrMinus = index % 2 === 0 ? -1 : 1

        mesh.rotation.x += plusOrMinus * 0.002
        mesh.rotation.y += plusOrMinus * 0.002
        mesh.rotation.z += plusOrMinus * 0.002
        mesh.rotationQuaternion = null
    })

    function initGround() {
        cursorPointerOnHover(ground.current!)
    }

    function initMeshes(worldModel: ILoadedModel) {
        initShards(worldModel)
        initSpikes(worldModel)
        initSolids(worldModel)
        initStars(worldModel)

        ground.current = worldModel.meshes?.find((x) => x.name === 'Planet Top')

        initGround()
    }

    return { ground, initMeshes }
}

export default useWorldMeshes
