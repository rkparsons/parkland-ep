import { useEffect } from 'react'
import { useScene } from 'react-babylonjs'

const useInspector = () => {
    const scene = useScene()

    useEffect(() => {
        if (scene) {
            scene.debugLayer.show({ embedMode: true })
        }
    }, [scene])

    return null
}

export default useInspector
