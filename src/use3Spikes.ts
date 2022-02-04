import useWorldMeshes from './useWorldMeshes'

const use3Spikes = () => {
    const { init: init3Spikes } = useWorldMeshes(
        '3Spikes',
        (mesh, index) => {
            const plusOrMinus = index % 2 === 0 ? -1 : 1

            mesh.rotation.x += 0.0015
            mesh.rotation.y += 0.001
            mesh.rotation.z += plusOrMinus * 0.0015
            mesh.rotationQuaternion = null
        },
        {
            url: 'audio/beepMid.mp3',
            maxDistance: 50,
            volume: 0.1
        }
    )

    return { init3Spikes }
}

export default use3Spikes
