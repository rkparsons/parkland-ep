import { FC, useEffect, useState } from 'react'
import { Mesh, Sound, Vector3 } from '@babylonjs/core'
import { useHover, useScene } from 'react-babylonjs'

type ViewProps = {
    position: Vector3
    diameter?: number
    url: string
}

const SoundMesh: FC<ViewProps> = ({ position, url, diameter = 1 }) => {
    const [scaling, setScaling] = useState(new Vector3(1, 1, 1))

    const [sphere] = useHover(
        () => setScaling(new Vector3(1.5, 1.5, 1.5)),
        () => setScaling(new Vector3(1, 1, 1))
    )

    const scene = useScene()
    const name = url.split('/').slice(-1)[0]

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
        <sphere
            name={name}
            position={position}
            diameter={diameter}
            scaling={scaling}
            ref={sphere}
        />
    )
}

export default SoundMesh
