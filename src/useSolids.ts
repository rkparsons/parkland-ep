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
            url: 'audio/pads.mp3',
            maxDistance: 30,
            volume: 0.5
        }
    )

    return { initSolids }
}

export default useSolids