import { FC, ReactNode, useEffect, useRef } from 'react'

import AudioContext from './AudioContext'
import { Sound } from '@babylonjs/core'

type ViewProps = {
    children: ReactNode
    isAudioInitialised: boolean
}

const AudioProvider: FC<ViewProps> = ({ children, isAudioInitialised }) => {
    const audioLoops = useRef<Sound[]>([])

    useEffect(() => {
        if (isAudioInitialised) {
            console.log('init audio', audioLoops.current.length)
            audioLoops.current.forEach((audioLoop) => audioLoop.play())
        }
    }, [isAudioInitialised])

    return <AudioContext.Provider value={{ audioLoops }}>{children}</AudioContext.Provider>
}

export default AudioProvider
