import { FC, useEffect, useRef } from 'react'
import { Mesh, Sound, Vector3 } from '@babylonjs/core'

import { useScene } from 'react-babylonjs'

type ViewProps = {
    position: Vector3
    diameter?: number
    url: string
}

const SoundMesh: FC<ViewProps> = ({ position, url, diameter }) => {
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

    return <sphere name={name} position={position} diameter={diameter} ref={mesh} />
}

export default SoundMesh
