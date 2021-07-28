import { FC, useRef } from 'react'
import { Skybox, useBeforeRender } from 'react-babylonjs'

import { Mesh } from '@babylonjs/core'

const Sky: FC = () => {
    const skyRef = useRef<Mesh>()

    useBeforeRender(() => {
        if (skyRef.current) {
            skyRef.current.rotation.y += 0.0001
        }
    })

    return (
        <mesh name="sky" ref={skyRef}>
            <Skybox rootUrl={`${process.env.PUBLIC_URL}/textures/TropicalSunnyDay`} />
        </mesh>
    )
}

export default Sky
