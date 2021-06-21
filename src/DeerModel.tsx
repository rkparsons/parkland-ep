import { FC, MutableRefObject, Suspense } from 'react'
import { ILoadedModel, Model } from 'react-babylonjs'
import { Quaternion, Tools, Vector3 } from '@babylonjs/core'

type ViewProps = {
    model: MutableRefObject<ILoadedModel | undefined>
    onLoaded(): void
}

const DeerModel: FC<ViewProps> = ({ model, onLoaded }) => {
    const onModelLoaded = (loadedModel: ILoadedModel) => {
        model.current = loadedModel

        loadedModel.animationGroups?.forEach((animationGroup) => {
            animationGroup.stop()
        })

        onLoaded()
    }

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
