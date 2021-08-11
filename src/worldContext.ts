import { MutableRefObject, createContext } from 'react'

import { Feature } from './types'

type WorldContext = {
    features: MutableRefObject<Feature[]>
}

export default createContext<WorldContext | undefined>(undefined)
