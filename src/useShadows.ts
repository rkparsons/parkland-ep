import { DirectionalLight, Mesh, ShadowGenerator } from '@babylonjs/core'

import { ILoadedModel } from 'react-babylonjs'
import { useRef } from 'react'

const useShadows = () => {
    const shadows = useRef<ShadowGenerator>()

    function initShadows(worldModel: ILoadedModel) {
        const light = worldModel.rootMesh!._scene.lights[0] as DirectionalLight
        shadows.current = new ShadowGenerator(1024, light)

        shadows.current.useBlurExponentialShadowMap = true
        shadows.current.useKernelBlur = true
        shadows.current.blurKernel = 32
        shadows.current.darkness = 0.8
    }

    function addShadow(mesh: Mesh) {
        if (!shadows.current) {
            return
        }

        mesh.receiveShadows = true
        shadows.current.addShadowCaster(mesh)
    }

    return { initShadows, addShadow }
}

export default useShadows
