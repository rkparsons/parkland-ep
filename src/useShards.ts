import useWorldMeshesOfType from './useWorldMeshesOfType'

const useShards = () => {
    const { init: initShards } = useWorldMeshesOfType('Shard', (mesh, index) => {
        const plusOrMinus = index % 2 === 0 ? -1 : 1

        mesh.rotation.y += plusOrMinus * 0.005
        mesh.rotationQuaternion = null
    })

    return { initShards }
}

export default useShards
