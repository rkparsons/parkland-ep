import { Color3, GroundMesh } from '@babylonjs/core'
import React, { FC, MutableRefObject } from 'react'

type ViewProps = {
    ground: MutableRefObject<GroundMesh | undefined>
}
const Ground: FC<ViewProps> = ({ ground }) => {
    return (
        <>
            <groundFromHeightMap
                ref={ground}
                name="ground1"
                width={100}
                height={100}
                subdivisions={40}
                url={`${process.env.PUBLIC_URL}/textures/heightmap.png`}
                checkCollisions={true}
            >
                <standardMaterial
                    name="groundMaterial"
                    assignTo="material"
                    specularColor={new Color3(0, 0, 0)}
                >
                    <texture
                        assignTo="diffuseTexture"
                        uScale={15}
                        vScale={15}
                        url={`${process.env.PUBLIC_URL}/textures/ground.jpg`}
                    />
                </standardMaterial>
            </groundFromHeightMap>
        </>
    )
}

export default Ground
