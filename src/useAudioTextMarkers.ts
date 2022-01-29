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
    const subtitleTexts = [
        'The sun burns hot above',
        'The way ahead is hard',
        'These rocky slopes are treacherous',
        'The air is heavy here',
        'The valley is ripe with juicy bananas'
    ]

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

        meshes.current.forEach((mesh, index) => {
            mesh.isPickable = false
            mesh.isVisible = false
            mesh.checkCollisions = true

            attachTextToMesh(mesh, subtitleTexts[index])

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
