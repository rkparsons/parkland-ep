import { FC } from 'react'
import useCameraContext from './useCameraContext'

const PostProcessing: FC = () => {
    const { camera } = useCameraContext()

    if (!camera.current) {
        return null
    }

    return (
        <defaultRenderingPipeline hdr chromaticAberrationEnabled grainEnabled>
            <chromaticAberrationPostProcess
                assignFrom="chromaticAberration"
                aberrationAmount={-100}
                radialIntensity={0.2}
                options={{ width: 100, height: 100 }}
                name=""
                screenWidth={1000}
                screenHeight={1000}
                camera={camera.current}
            />
            <grainPostProcess
                assignFrom="grain"
                intensity={20}
                name=""
                options={{ width: 100, height: 100 }}
                camera={camera.current}
            />
        </defaultRenderingPipeline>
    )
}

export default PostProcessing
