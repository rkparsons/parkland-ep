import { ILoadedModel, useBeforeRender } from 'react-babylonjs'
import { MutableRefObject, useRef } from 'react'
import { cursorPointerOnHover, getModelObjects } from './utils'

import { AbstractMesh } from '@babylonjs/core'

const useSpikesObjects = (model: MutableRefObject<ILoadedModel | undefined>) => {
    const spikes = useRef<AbstractMesh[]>([])

    function initSpikes() {
        spikes.current = getModelObjects(model, 'Spikes')
        spikes.current.forEach(cursorPointerOnHover)
    }

    function rotateSpikes() {
        spikes.current.forEach((shard, index) => {
            const plusOrMinus = index % 2 === 0 ? -1 : 1

            shard.rotation.x += 0.0015
            shard.rotation.y += 0.001
            shard.rotation.z += plusOrMinus * 0.0015
            shard.rotationQuaternion = null
        })
    }

    useBeforeRender(() => {
        rotateSpikes()
    })

    return { initSpikes }
}

export default useSpikesObjects
