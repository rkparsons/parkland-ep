import { MutableRefObject, useRef } from 'react'

import { AbstractMesh } from '@babylonjs/core'
import { ILoadedModel } from 'react-babylonjs'
import { cursorPointerOnHover } from './utils'
import useShards from './useShards'
import useSolids from './useSolids'
import useSpikes from './useSpikes'
import useStars from './useStars'
import useWorldMeshesOfType from './useWorldMeshesOfType'

const useWorldMeshes = () => {
    const ground = useRef<AbstractMesh>()

    const { initShards } = useShards()
    const { initSpikes } = useSpikes()
    const { initSolids } = useSolids()
    const { initStars } = useStars()

    function initGround() {
        cursorPointerOnHover(ground.current!)
    }

    function initMeshes(worldModel: ILoadedModel) {
        initShards(worldModel)
        initSpikes(worldModel)
        initSolids(worldModel)
        initStars(worldModel)

        ground.current = worldModel.meshes?.find((x) => x.name === 'Planet Top')

        initGround()
    }

    return { ground, initMeshes }
}

export default useWorldMeshes
