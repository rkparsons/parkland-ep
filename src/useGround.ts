import { AbstractMesh } from '@babylonjs/core'
import { ILoadedModel } from 'react-babylonjs'
import { cursorPointerOnHover } from './utils'
import { useRef } from 'react'

const useGround = () => {
    const ground = useRef<AbstractMesh>()

    function initGround(worldModel: ILoadedModel) {
        ground.current = worldModel.meshes?.find((x) => x.name === 'Planet Top')
        ground.current!.receiveShadows = true
        cursorPointerOnHover(ground.current!)
    }

    return { ground, initGround }
}

export default useGround
