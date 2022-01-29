import { ILoadedModel, useBeforeRender, useScene } from 'react-babylonjs'
import { attachSoundToMesh, attachTextToMesh, getModelObjects } from './utils'

import { AbstractMesh } from '@babylonjs/core'
import useAudioContext from './useAudioContext'
import { useRef } from 'react'

const useAudioTextMarkers = () => {
    const meshes = useRef<AbstractMesh[]>([])
    const { audioLoops } = useAudioContext()
    const scene = useScene()

    useBeforeRender(() => {
        const deerModel = scene!.getMeshByName('deer')

        if (!deerModel) {
            return
        }

        meshes.current.forEach((mesh) => {
            if (mesh.intersectsMesh(deerModel)) {
                alert('hello from ' + mesh.name)
            }
        })
    })

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

        meshes.current.forEach((mesh) => {
            mesh.checkCollisions = true
            mesh.onCollide = () => alert('hello from ' + mesh.name)
        })

        meshes.current.forEach((mesh) => attachTextToMesh(mesh, 'here is a subtitle'))
    }

    return { initAudioTextMarkers }
}

export default useAudioTextMarkers
