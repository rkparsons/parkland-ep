import useWorldMeshes from './useWorldMeshes'

const useSolids = () => {
    const { init: initSolids } = useWorldMeshes(
        'Solid',
        (mesh) => {
            mesh.rotation.x -= 0.0015
            mesh.rotation.y -= 0.0015
            mesh.rotation.z -= 0.002
            mesh.rotationQuaternion = null
        },
        {
            url: 'audio/beepLow.mp3',
            maxDistance: 60,
            volume: 0.3
        }
    )

    return { initSolids }
}

export default useSolids
