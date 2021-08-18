import { Color3, HighlightLayer, Mesh, Sound, Vector3 } from '@babylonjs/core'
import { FC, useEffect, useRef, useState } from 'react'
import { useHover, useScene } from 'react-babylonjs'

type ViewProps = {
    position: Vector3
    diameter?: number
    url: string
}

const SoundMesh: FC<ViewProps> = ({ position, url, diameter = 1 }) => {
    const [scaling, setScaling] = useState(new Vector3(1, 1, 1))
    const highlightLayer = useRef<HighlightLayer>(null)

    const [sphere] = useHover(
        () => {
            setScaling(new Vector3(1.5, 1.5, 1.5))

            if (highlightLayer.current) {
                highlightLayer.current.isEnabled = true
            }
        },
        () => {
            setScaling(new Vector3(1, 1, 1))
            if (highlightLayer.current) {
                highlightLayer.current.isEnabled = false
            }
        }
    )

    const scene = useScene()
    const name = url.split('/').slice(-1)[0]

    useEffect(() => {
        if (highlightLayer.current && sphere.current && sphere.current instanceof Mesh) {
            highlightLayer.current.addMesh(sphere.current, Color3.Green())
        }
    }, [sphere.current, highlightLayer.current])

    useEffect(() => {
        if (!sphere.current || !(sphere.current instanceof Mesh) || !scene) {
            return
        }

        new Sound(name, url, scene, null, {
            loop: true,
            autoplay: true,
            maxDistance: 20,
            volume: 0.2
        }).attachToMesh(sphere.current)
    }, [sphere, scene])

    return (
        <>
            <highlightLayer name="hl" ref={highlightLayer} isEnabled={false} />
            <sphere
                name={name}
                position={position}
                diameter={diameter}
                scaling={scaling}
                ref={sphere}
            />
        </>
    )
}

export default SoundMesh
