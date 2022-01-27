import { ILoadedModel, useBeforeRender } from 'react-babylonjs'
import { MutableRefObject, useRef } from 'react'
import { cursorPointerOnHover, getModelObjects } from './utils'

import { AbstractMesh } from '@babylonjs/core'

const useWorldMeshesOfType = (
    typeName: string,
    render: (mesh: AbstractMesh, index: number) => void
) => {
    const meshes = useRef<AbstractMesh[]>([])

    function init(worldModel: ILoadedModel) {
        meshes.current = getModelObjects(worldModel, typeName)
        meshes.current.forEach(cursorPointerOnHover)
    }

    useBeforeRender(() => {
        meshes.current.forEach(render)
    })

    return { init }
}

export default useWorldMeshesOfType
