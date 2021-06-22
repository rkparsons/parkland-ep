import WaypointContext from './waypointContext'
import { useContext } from 'react'

const useWaypointContext = () => {
    const context = useContext(WaypointContext)

    if (context === undefined) {
        throw new Error('useWaypointContext must be used within a WaypointProvider')
    }

    return context
}

export default useWaypointContext
