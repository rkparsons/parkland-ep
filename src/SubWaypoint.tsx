import { FC, MutableRefObject, useEffect } from 'react'
import { Mesh, Vector3 } from '@babylonjs/core'

import { Path } from './types'

type ViewProps = {
    index: number
    subWaypoints: MutableRefObject<Mesh[]>
    path: Path
}

const SubWaypoint: FC<ViewProps> = ({ index, subWaypoints, path }) => {
    // function setDebug() {
    //     if (!model.current?.rootMesh || !world.current || !debug.current || !scene) {
    //         return
    //     }

    //     const origin = model.current.rootMesh.position
    //     const down = Vector3.Normalize(origin.negate())
    //     const rayDown = new Ray(origin, down)
    //     const pickingInfo = scene.pickWithRay(rayDown)

    //     if (pickingInfo && pickingInfo.hit && pickingInfo.pickedMesh === world.current) {
    //         debug.current.position = pickingInfo.pickedPoint!.clone()
    //     }
    // }

    useEffect(() => {
        subWaypoints.current[index].position = path.start.add(
            path.direction.scale(++index / subWaypoints.current.length)
        )
    }, [path])

    return (
        <sphere
            name={`waypoint_${index}`}
            ref={(el) => (subWaypoints.current[index] = el as Mesh)}
            position={Vector3.Zero()}
        />
    )
}

export default SubWaypoint
