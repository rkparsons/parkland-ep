import useWorldMeshesOfType from './useWorldMeshesOfType'

const useSolids = () => {
    const { init: initSolids } = useWorldMeshesOfType('Solid', (mesh) => {
        mesh.rotation.x -= 0.0015
        mesh.rotation.y -= 0.0015
        mesh.rotation.z -= 0.002
        mesh.rotationQuaternion = null
    })

    return { initSolids }
}

export default useSolids
