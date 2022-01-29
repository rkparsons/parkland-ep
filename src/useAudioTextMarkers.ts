import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { MutableRefObject, useRef } from 'react'
import { attachSoundToMesh, attachTextToMesh, getModelObjects } from './utils'

import { AbstractMesh } from '@babylonjs/core'
import useAudioContext from './useAudioContext'

const useAudioTextMarkers = (setSubtitles: (subtitles: string) => void) => {
    const activeAudioTextMarker = useRef<AbstractMesh>()
    const meshes = useRef<AbstractMesh[]>([])
    const { audioLoops } = useAudioContext()
    const scene = useScene()

    useBeforeRender(() => {
        const deerModel = scene!.getMeshByName('deer')

        if (!deerModel) {
            return
        }

        const newActiveAudioTextMarker = meshes.current.find((mesh) =>
            mesh.intersectsMesh(deerModel)
        )

        if (!activeAudioTextMarker.current && newActiveAudioTextMarker) {
            setSubtitles(newActiveAudioTextMarker.metadata.text)
        } else if (activeAudioTextMarker.current && !newActiveAudioTextMarker) {
            setSubtitles('')
        }

        activeAudioTextMarker.current = newActiveAudioTextMarker
    })

    function initAudioTextMarkers(worldModel: ILoadedModel) {
        meshes.current = getModelObjects(worldModel, 'Subtitles')

        meshes.current.forEach((mesh) => {
            mesh.isPickable = false
            mesh.isVisible = false
            mesh.checkCollisions = true

            attachTextToMesh(mesh, 'Hello from ' + mesh.name)

            attachSoundToMesh(
                mesh,
                {
                    url: 'audio/beepHigh.mp3',
                    maxDistance: 30,
                    volume: 0.1
                },
                audioLoops
            )
        })
    }

    return { initAudioTextMarkers }
}

export default useAudioTextMarkers
