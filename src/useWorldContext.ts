import WorldContext from './worldContext'
import { useContext } from 'react'

const useWorldContext = () => {
    const context = useContext(WorldContext)

    if (context === undefined) {
        throw new Error('useWorldContext must be used within a WorldProvider')
    }

    return context
}

export default useWorldContext
