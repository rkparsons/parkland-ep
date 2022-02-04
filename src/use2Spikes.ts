import useWorldMeshes from './useWorldMeshes'

const use2Spikes = () => {
    const { init: init2Spikes } = useWorldMeshes(
        '2Spikes',
        (mesh, index) => {
            const plusOrMinus = index % 2 === 0 ? -1 : 1

            mesh.rotation.x += 0.0015
            mesh.rotation.y += 0.001
            mesh.rotation.z += plusOrMinus * 0.0015
            mesh.rotationQuaternion = null
        },
        {
            url: 'audio/arp.mp3',
            maxDistance: 50,
            volume: 0.1
        }
    )

    return { init2Spikes }
}

export default use2Spikes
