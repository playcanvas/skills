import { AppBase, CameraFrame, Entity, WebglGraphicsDevice } from 'playcanvas';
import { CameraControls } from 'playcanvas/scripts/esm/camera-controls.mjs';
import { ProceduralSky } from 'playcanvas/scripts/esm/sky/procedural-sky.mjs';
import { Water } from 'playcanvas/scripts/esm/water.mjs';

const setup = (app: AppBase, camera: Entity, sky: Entity, water: Entity) => {
    if (!camera.camera) throw new Error('camera component required');
    camera.addComponent('script');
    sky.addComponent('script');
    water.addComponent('script');
    camera.script?.create(CameraControls);
    sky.script?.create(ProceduralSky);
    water.script?.create(Water);
    return new CameraFrame(app, camera.camera);
};

void setup;

const verifyPixels = async (app: AppBase) => {
    app.timeScale = 0;
    app.autoRender = false;
    app.renderNextFrame = true;
    const device = app.graphicsDevice as WebglGraphicsDevice;
    const px = new Uint8Array(4 * 4 * 4);
    await device.readPixelsAsync(0, 0, 4, 4, px);
    return px;
};
void verifyPixels;
