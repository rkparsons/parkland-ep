import AudioContext from './AudioContext'
import { useContext } from 'react'

const useAudioContext = () => {
    const context = useContext(AudioContext)

    if (context === undefined) {
        throw new Error('useAudioContext must be used within a AudioProvider')
    }

    return context
}

export default useAudioContext
