import InputMapContext from './inputMapContext'
import { useContext } from 'react'

const useInputMapContext = () => {
    const context = useContext(InputMapContext)

    if (context === undefined) {
        throw new Error('useInputMapContext must be used within a InputMapProvider')
    }

    return context
}

export default useInputMapContext
