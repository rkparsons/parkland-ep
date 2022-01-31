import { AbstractMesh, Vector3 } from '@babylonjs/core'
import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { MutableRefObject, useRef } from 'react'
import { attachSoundToMesh, attachTextToMesh, getModelObjects } from './utils'

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

    function initAudioTextMarker(
        worldModel: ILoadedModel,
        subtitleName: string,
        subtitleText?: string,
        audioUrl?: string
    ) {
        const mesh = worldModel.meshes!.find(({ name }) => name === subtitleName)!
        mesh.isPickable = false
        mesh.isVisible = true
        mesh.checkCollisions = false
        meshes.current.push(mesh)

        if (subtitleText) {
            attachTextToMesh(mesh, subtitleText)
        }

        if (audioUrl) {
            attachSoundToMesh(
                mesh,
                {
                    url: audioUrl,
                    maxDistance: 30,
                    volume: 0.1
                },
                audioLoops
            )
        }
    }

    function initAudioTextMarkers(worldModel: ILoadedModel) {
        initAudioTextMarker(
            worldModel,
            'ST_TheseRockySlopes',
            'These rocky slopes are treacherous',
            'audio/beepHigh.mp3'
        )
        initAudioTextMarker(
            worldModel,
            'ST_TheLandscape',
            'The landscape seems familiar',
            'audio/beepHigh.mp3'
        )
        initAudioTextMarker(
            worldModel,
            'ST_TheSunBurns',
            'The sun burns hot above',
            'audio/beepHigh.mp3'
        )
        initAudioTextMarker(
            worldModel,
            'ST_TheSunBurns_2',
            'The sun burns hot above',
            'audio/beepHigh.mp3'
        )
        initAudioTextMarker(
            worldModel,
            'ST_TheWayIsHard',
            'The way ahead is hard',
            'audio/beepHigh.mp3'
        )
        initAudioTextMarker(
            worldModel,
            'ST_TheWayIsHard_2',
            'The way ahead is hard',
            'audio/beepHigh.mp3'
        )
        initAudioTextMarker(worldModel, 'ST_TheWind', 'The wind is howling', 'audio/beepHigh.mp3')
        initAudioTextMarker(
            worldModel,
            'ST_TheAirFeels',
            'The air feels heavy here',
            'audio/beepHigh.mp3'
        )
        initAudioTextMarker(
            worldModel,
            'ST_TheAirFeels_2',
            'The air feels heavy here',
            'audio/beepHigh.mp3'
        )
    }

    return { initAudioTextMarkers }
}

export default useAudioTextMarkers
