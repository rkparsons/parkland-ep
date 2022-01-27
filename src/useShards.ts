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
            url: 'audio/kickSnare.mp3',
            maxDistance: 30,
            volume: 0.5
        }
    )

    return { initShards }
}

export default useShards
