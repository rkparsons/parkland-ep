import { ILoadedModel } from 'react-babylonjs'
import { MutableRefObject } from 'react'
import useWorldMeshesOfType from './useWorldMeshesOfType'

const useWorldMeshes = (model: MutableRefObject<ILoadedModel | undefined>) => {
    const { init: initShards } = useWorldMeshesOfType(model, 'Shard', (mesh, index) => {
        const plusOrMinus = index % 2 === 0 ? -1 : 1

        mesh.rotation.y += plusOrMinus * 0.005
        mesh.rotationQuaternion = null
    })
    const { init: initSpikes } = useWorldMeshesOfType(model, 'Spikes', (mesh, index) => {
        const plusOrMinus = index % 2 === 0 ? -1 : 1

        mesh.rotation.x += 0.0015
        mesh.rotation.y += 0.001
        mesh.rotation.z += plusOrMinus * 0.0015
        mesh.rotationQuaternion = null
    })
    const { init: initSolids } = useWorldMeshesOfType(model, 'Solid', (mesh) => {
        mesh.rotation.x -= 0.0015
        mesh.rotation.y -= 0.0015
        mesh.rotation.z -= 0.002
        mesh.rotationQuaternion = null
    })
    const { init: initStars } = useWorldMeshesOfType(model, 'Star', (mesh, index) => {
        const plusOrMinus = index % 2 === 0 ? -1 : 1

        mesh.rotation.x += plusOrMinus * 0.002
        mesh.rotation.y += plusOrMinus * 0.002
        mesh.rotation.z += plusOrMinus * 0.002
        mesh.rotationQuaternion = null
    })

    function initMeshes() {
        initShards()
        initSpikes()
        initSolids()
        initStars()
    }

    return { initMeshes }
}

export default useWorldMeshes
