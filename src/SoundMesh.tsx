import { FC, useEffect, useRef, useState } from 'react'
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
    const mesh = useRef<Mesh>()
    const name = url.split('/').slice(-1)[0]

    useEffect(() => {
        if (!mesh.current || !scene) {
            return
        }

        new Sound(name, url, scene, null, {
            loop: true,
            autoplay: true,
            maxDistance: 20
        }).attachToMesh(mesh.current)
    }, [mesh, scene])

    return (
        <sphere name={name} position={position} diameter={diameter} scaling={scaling} ref={sphere}>
            <mesh name="soundMesh" ref={mesh} />
        </sphere>
    )
}

export default SoundMesh
