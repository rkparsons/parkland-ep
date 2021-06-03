import { Engine, Scene, Skybox } from "react-babylonjs";
import React, { FC } from "react";

import DeerController from "./DeerController";
import InputMapProvider from "./InputMapProvider";
import { Vector3 } from "@babylonjs/core";

const DeerEngine: FC = () => (
  <Engine antialias adaptToDeviceRatio canvasId="canvas">
    <Scene>
      <InputMapProvider>
        <arcRotateCamera
          name="camera1"
          alpha={Math.PI / 2}
          beta={Math.PI / 2.5}
          radius={9.0}
          target={new Vector3(0, 2, 2)}
          minZ={0.001}
        />
        <hemisphericLight
          name="hemi-light"
          intensity={0.7}
          direction={Vector3.Up()}
        />
        <Skybox
          rootUrl={`${process.env.PUBLIC_URL}/textures/TropicalSunnyDay`}
        />
        <DeerController />
      </InputMapProvider>
    </Scene>
  </Engine>
);

export default DeerEngine;
