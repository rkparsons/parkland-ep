import { attachSoundToMesh, getModelObjects } from './utils'

import { AbstractMesh } from '@babylonjs/core'
import { ILoadedModel } from 'react-babylonjs'
import useAudioContext from './useAudioContext'
import { useRef } from 'react'

const useAudioTextMarkers = () => {
    const meshes = useRef<AbstractMesh[]>([])
    const { audioLoops } = useAudioContext()

    function initAudioTextMarkers(worldModel: ILoadedModel) {
        meshes.current = getModelObjects(worldModel, 'Subtitles')
        meshes.current.forEach((mesh) => (mesh.isPickable = false))
        meshes.current.forEach((mesh) =>
            attachSoundToMesh(
                mesh,
                {
                    url: 'audio/beepHigh.mp3',
                    maxDistance: 30,
                    volume: 0.1
                },
                audioLoops
            )
        )
    }

    return { initAudioTextMarkers }
}

export default useAudioTextMarkers
