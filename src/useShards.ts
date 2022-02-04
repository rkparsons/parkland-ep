import useWorldMeshes from './useWorldMeshes'

const useShards = () => {
    const { init: initShards } = useWorldMeshes(
        'Shard',
        (mesh, index) => {
            const plusOrMinus = index % 2 === 0 ? -1 : 1

            mesh.rotation.y += plusOrMinus * 0.005
            mesh.rotationQuaternion = null
        },
        {
            url: 'audio/drone.mp3',
            maxDistance: 55,
            volume: 0.3
        }
    )

    return { initShards }
}

export default useShards
