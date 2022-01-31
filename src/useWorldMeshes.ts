import { ILoadedModel, useBeforeRender } from 'react-babylonjs'
import { attachSoundToMesh, cursorPointerOnHover, getModelObjects } from './utils'

import { AbstractMesh } from '@babylonjs/core'
import { SpatialSound } from './types'
import useAudioContext from './useAudioContext'
import { useRef } from 'react'

const useWorldMeshes = (
    typeName: string,
    render?: (mesh: AbstractMesh, index: number) => void,
    spatialSound?: SpatialSound
) => {
    const meshes = useRef<AbstractMesh[]>([])
    const { audioLoops } = useAudioContext()

    function init(worldModel: ILoadedModel) {
        meshes.current = getModelObjects(worldModel, typeName)
        meshes.current.forEach(cursorPointerOnHover)

        if (spatialSound) {
            meshes.current.forEach((mesh) => attachSoundToMesh(mesh, spatialSound, audioLoops))
        }
    }

    useBeforeRender(() => {
        if (render) {
            meshes.current.forEach(render)
        }
    })

    return { init }
}

export default useWorldMeshes
