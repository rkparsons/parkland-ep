import { MutableRefObject, createContext } from 'react'

import { Sound } from '@babylonjs/core'

type AudioContext = {
    audioLoops: MutableRefObject<Sound[]>
}

export default createContext<AudioContext | undefined>(undefined)
