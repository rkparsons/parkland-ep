import { MutableRefObject, createContext } from 'react'

import { KeyboardInfo } from '@babylonjs/core'

type InputMapContext = {
    inputMap: MutableRefObject<Record<string, boolean>>
    handleKeyPress(keyboardInfo: KeyboardInfo): boolean
}

export default createContext<InputMapContext | undefined>(undefined)
