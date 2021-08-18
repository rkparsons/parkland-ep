import { Color3, Color4, HighlightLayer, Mesh, Sound, Vector3 } from '@babylonjs/core'
import { FC, useEffect, useRef, useState } from 'react'
import { useBeforeRender, useHover, useScene } from 'react-babylonjs'

import { useSpring } from 'react-spring'

type ViewProps = {
    position: Vector3
    diameter?: number
    url: string
}

const SoundMesh: FC<ViewProps> = ({ position, url, diameter = 1 }) => {
    const [isHover, setIsHover] = useState(false)
    const highlightLayer = useRef<HighlightLayer>(null)
    const { scaling } = useSpring({
        scaling: isHover ? 1.5 : 1
    })

    const [sphere] = useHover(
        () => {
            setIsHover(true)

            if (highlightLayer.current) {
                highlightLayer.current.isEnabled = true
            }
        },
        () => {
            setIsHover(false)

            if (highlightLayer.current) {
                highlightLayer.current.isEnabled = false
            }
        }
    )

    useBeforeRender(() => {
        if (!sphere.current || !(sphere.current instanceof Mesh)) {
            return
        }

        const newScaling = scaling.get()

        sphere.current.scaling.set(newScaling, newScaling, newScaling)
    })

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
            <highlightLayer
                name="hl"
                ref={highlightLayer}
                isEnabled={false}
                neutralColor={new Color4(255, 255, 255, 0)}
            />
            <sphere name={name} position={position} diameter={diameter} ref={sphere} />
        </>
    )
}

export default SoundMesh
