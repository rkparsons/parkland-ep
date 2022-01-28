import { FC, MutableRefObject, ReactNode, useEffect, useRef } from 'react'

import AudioContext from './AudioContext'
import { Sound } from '@babylonjs/core'

type ViewProps = {
    children: ReactNode
    audioLoops: MutableRefObject<Sound[]>
}

const AudioProvider: FC<ViewProps> = ({ children, audioLoops }) => (
    <AudioContext.Provider value={{ audioLoops }}>{children}</AudioContext.Provider>
)

export default AudioProvider
