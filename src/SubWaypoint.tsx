import { Color3, Color4, Mesh, Ray, Vector3 } from '@babylonjs/core'
import { FC, MutableRefObject, useEffect } from 'react'

import { Path } from './types'
import { useScene } from 'react-babylonjs'
import useWorldContext from './useWorldContext'

type ViewProps = {
    index: number
    isActive: boolean
    subWaypoints: MutableRefObject<Mesh[]>
    path: Path
}

const SubWaypoint: FC<ViewProps> = ({ index, isActive, subWaypoints, path }) => {
    const scene = useScene()
    const { world } = useWorldContext()

    useEffect(() => {
        const origin = path.start.add(
            path.direction.scale((index + 1) / subWaypoints.current.length)
        )

        const isSnapped = snapToTerrain(new Ray(origin, Vector3.Up()))

        if (!isSnapped) {
            snapToTerrain(new Ray(origin, Vector3.Down()))
        }
    }, [path])

    function snapToTerrain(ray: Ray) {
        const pickingInfo = scene?.pickWithRay(ray)

        if (pickingInfo && pickingInfo.hit && pickingInfo.pickedMesh === world.current) {
            subWaypoints.current[index].position = pickingInfo.pickedPoint!.clone()

            return true
        }

        return false
    }

    return (
        <sphere
            name={`waypoint_${index}`}
            ref={(el) => (subWaypoints.current[index] = el as Mesh)}
            position={Vector3.Zero()}
            visibility={0}
        >
            {/* <standardMaterial
                name="waypointMaterial"
                diffuseColor={isActive ? Color3.Red() : Color3.White()}
            /> */}
        </sphere>
    )
}

export default SubWaypoint
