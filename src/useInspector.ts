import { useEffect } from 'react'
import { useScene } from 'react-babylonjs'

const useInspector = () => {
    const scene = useScene()

    useEffect(() => {
        if (scene) {
            scene.debugLayer.show()
        }
    }, [scene])

    return null
}

export default useInspector
