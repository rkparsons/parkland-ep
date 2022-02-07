import useWorldMeshes from './useWorldMeshes'

const useStars = () => {
    const { init: initStars } = useWorldMeshes(
        'Star',
        (mesh, index) => {
            const plusOrMinus = index % 2 === 0 ? -1 : 1

            mesh.rotation.x += plusOrMinus * 0.002
            mesh.rotation.y += plusOrMinus * 0.002
            mesh.rotation.z += plusOrMinus * 0.002
            mesh.rotationQuaternion = null
        },
        {
            url: 'audio/kickSnare.mp3',
            maxDistance: 70,
            volume: 0.3
        }
    )

    return { initStars }
}

export default useStars
