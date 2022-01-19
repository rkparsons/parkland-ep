import { FC, MutableRefObject, useEffect } from 'react'
import { Mesh, Ray, Vector3 } from '@babylonjs/core'

import { Path } from './types'
import { useScene } from 'react-babylonjs'
import useWorldContext from './useWorldContext'

type ViewProps = {
    index: number
    subWaypoints: MutableRefObject<Mesh[]>
    path: Path
}

const SubWaypoint: FC<ViewProps> = ({ index, subWaypoints, path }) => {
    const scene = useScene()
    const { world } = useWorldContext()

    useEffect(() => {
        const origin = path.start.add(
            path.direction.scale((index + 1) / subWaypoints.current.length)
        )
        const down = Vector3.Normalize(origin.negate())
        const rayDown = new Ray(origin, down, 1)
        const isSnapped = snapToTerrain(rayDown)

        if (!isSnapped) {
            const up = Vector3.Normalize(origin)
            const rayUp = new Ray(origin, up)
            snapToTerrain(rayUp)
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
        />
    )
}

export default SubWaypoint
