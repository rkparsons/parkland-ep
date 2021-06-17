import { FC, Suspense } from 'react'
import { ILoadedModel, Model } from 'react-babylonjs'
import { Quaternion, Tools, Vector3 } from '@babylonjs/core'

type ViewProps = {
    onModelLoaded: (model: ILoadedModel) => void
}

const DeerModel: FC<ViewProps> = ({ onModelLoaded }) => {
    return (
        <Suspense fallback={null}>
            <Model
                name="deer"
                position={Vector3.Zero()}
                rootUrl={`${process.env.PUBLIC_URL}/`}
                sceneFilename="Deer.glb"
                scaleToDimension={3}
                rotation={new Vector3(0, Tools.ToRadians(240), 0)}
                onModelLoaded={onModelLoaded}
                checkCollisions={true}
                rotationQuaternion={Quaternion.Identity()}
            />
        </Suspense>
    )
}

export default DeerModel
