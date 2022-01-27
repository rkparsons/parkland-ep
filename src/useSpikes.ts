import useWorldMeshesOfType from './useWorldMeshesOfType'

const useSpikes = () => {
    const { init: initSpikes } = useWorldMeshesOfType('Spikes', (mesh, index) => {
        const plusOrMinus = index % 2 === 0 ? -1 : 1

        mesh.rotation.x += 0.0015
        mesh.rotation.y += 0.001
        mesh.rotation.z += plusOrMinus * 0.0015
        mesh.rotationQuaternion = null
    })

    return { initSpikes }
}

export default useSpikes
