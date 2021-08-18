import { FC, ReactNode, createRef, useEffect, useRef } from 'react'
import { Mesh, Sound, Vector3 } from '@babylonjs/core'

import { Feature } from './types'
import WorldContext from './worldContext'
import { useScene } from 'react-babylonjs'

type ViewProps = {
    children: ReactNode
}

const WorldProvider: FC<ViewProps> = ({ children }) => {
    const scene = useScene()
    const beepMidRef = useRef<Mesh>()
    const padsRef = useRef<Mesh>()

    const features = useRef<Feature[]>([
        {
            name: 'beepMid',
            position: new Vector3(0, 2, 15),
            soundURL: 'test.mp3',
            ref: createRef<Mesh>()
        }
    ])

    useEffect(() => {
        if (!beepMidRef.current || !padsRef.current || !scene) {
            return
        }

        new Sound('beepMid', 'audio/beepMid.mp3', scene, null, {
            loop: true,
            autoplay: true,
            maxDistance: 20
        }).attachToMesh(beepMidRef.current)

        new Sound('pads', 'audio/pads.mp3', scene, null, {
            loop: true,
            autoplay: true,
            maxDistance: 20
        }).attachToMesh(padsRef.current)
    }, [beepMidRef, scene])

    return (
        <WorldContext.Provider value={{ features }}>
            {children}
            <sphere name="beepMid" position={new Vector3(0, 2, 15)} ref={beepMidRef} />
            <sphere name="pads" position={new Vector3(15, 2, -5)} ref={padsRef} diameter={2} />
            {/* {features.current.map(({ name, position, soundURL, ref }, index) => {
                if (!scene) {
                    return
                }

                const sound = new Sound(name, soundURL, scene, null, {
                    loop: true,
                    autoplay: true
                })

                return (
                    <sphere name={name} key={index} position={position} ref={ref}>
                        <
                    </sphere>
                )
            })} */}
        </WorldContext.Provider>
    )
}

export default WorldProvider
