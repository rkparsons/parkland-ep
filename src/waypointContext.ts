import { MutableRefObject, createContext } from 'react'

type WaypointContext = {
    distanceToWaypoint: MutableRefObject<number>
    degreesToWaypoint: MutableRefObject<number>
}

export default createContext<WaypointContext | undefined>(undefined)
