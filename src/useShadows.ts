import {
    AbstractMesh,
    CascadedShadowGenerator,
    DirectionalLight,
    Mesh,
    ShadowGenerator
} from '@babylonjs/core'

import { ILoadedModel } from 'react-babylonjs'
import { useRef } from 'react'

const useShadows = () => {
    const shadows = useRef<CascadedShadowGenerator>()

    function initShadows(worldModel: ILoadedModel) {
        const light = worldModel.rootMesh!._scene.lights[0] as DirectionalLight
        shadows.current = new CascadedShadowGenerator(1024, light)
        shadows.current.numCascades = 4
        shadows.current.lambda = 1
        shadows.current.depthClamp = true
        shadows.current.autoCalcDepthBounds = true
        shadows.current.stabilizeCascades = false
        shadows.current.filteringQuality = ShadowGenerator.QUALITY_MEDIUM

        // shadows.current.useBlurExponentialShadowMap = true
        // shadows.current.useKernelBlur = true
        // shadows.current.blurKernel = 32
        shadows.current.darkness = 0.8
    }

    function addShadow(mesh: AbstractMesh) {
        if (!shadows.current) {
            return
        }

        mesh.receiveShadows = true
        shadows.current.addShadowCaster(mesh)
    }

    return { initShadows, addShadow }
}

export default useShadows
