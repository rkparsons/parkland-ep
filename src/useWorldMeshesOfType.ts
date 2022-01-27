import { ILoadedModel, useBeforeRender } from 'react-babylonjs'
import { MutableRefObject, useRef } from 'react'
import { cursorPointerOnHover, getModelObjects } from './utils'

import { AbstractMesh } from '@babylonjs/core'

const useWorldMeshesOfType = (
    model: MutableRefObject<ILoadedModel | undefined>,
    typeName: string,
    render: (mesh: AbstractMesh, index: number) => void
) => {
    const meshes = useRef<AbstractMesh[]>([])

    function init() {
        meshes.current = getModelObjects(model, typeName)
        meshes.current.forEach(cursorPointerOnHover)
    }

    useBeforeRender(() => {
        meshes.current.forEach(render)
    })

    return { init }
}

export default useWorldMeshesOfType
