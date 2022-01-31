import {
    AbstractMesh,
    CascadedShadowGenerator,
    DirectionalLight,
    Mesh,
    ShadowGenerator
} from '@babylonjs/core'

import { ILoadedModel } from 'react-babylonjs'
import useCameraContext from './useCameraContext'
import { useRef } from 'react'

const useShadows = () => {
    const shadows = useRef<CascadedShadowGenerator>()

    function initShadows(worldModel: ILoadedModel) {
        const light = worldModel.rootMesh!._scene.lights[0] as DirectionalLight
        shadows.current = new CascadedShadowGenerator(512, light)
        shadows.current.numCascades = 2
        shadows.current.cascadeBlendPercentage = 0
        shadows.current.lambda = 1
        shadows.current.depthClamp = false
        // shadows.current.autoCalcDepthBounds = true
        // shadows.current.autoCalcDepthBoundsRefreshRate = 128
        shadows.current.stabilizeCascades = false
        shadows.current.filteringQuality = ShadowGenerator.QUALITY_LOW
        shadows.current.freezeShadowCastersBoundingInfo = true

        // shadows.current.useBlurExponentialShadowMap = true
        // shadows.current.useKernelBlur = true
        // shadows.current.blurKernel = 32
        shadows.current.darkness = 0.8
    }

    function addShadow(mesh: AbstractMesh) {
        if (!shadows.current) {
            return
        }

        shadows.current.addShadowCaster(mesh, false)
    }

    return { initShadows, addShadow }
}

export default useShadows
