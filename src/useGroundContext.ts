import GroundContext from './groundContext'
import { useContext } from 'react'

const useGroundContext = () => {
    const context = useContext(GroundContext)

    if (context === undefined) {
        throw new Error('useGroundContext must be used within a GroundProvider')
    }

    return context
}

export default useGroundContext
