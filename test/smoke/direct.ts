import {
    AppBase, AppOptions, BatchManager, CameraFrame, Color, Entity, MeshInstance, MiniStats,
    SHADERLANGUAGE_GLSL, SHADERLANGUAGE_WGSL, ShaderMaterial, StandardMaterial,
    VertexBuffer, VertexFormat, WebglGraphicsDevice
} from 'playcanvas';
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

const reduceDrawCalls = (app: AppBase, mi: MeshInstance) => {
    void app.stats.drawCalls;
    void new MiniStats(app);
    const format = VertexFormat.getDefaultInstancingFormat(app.graphicsDevice);
    const vb = new VertexBuffer(app.graphicsDevice, format, 36, { data: new Float32Array(36 * 16).buffer });
    mi.setInstancing(vb, true);
    mi.instancingCount = 36;
    const opts = new AppOptions();
    opts.batchManager = BatchManager;
};
void reduceDrawCalls;

const overrideChunks = (mat: StandardMaterial) => {
    mat.shaderChunksVersion = '2.8';
    mat.getShaderChunks(SHADERLANGUAGE_GLSL).set('emissivePS', 'void getEmission() { dEmission = vec3(1.0); }');
    void mat.getShaderChunks(SHADERLANGUAGE_WGSL);
    mat.setParameter('accent', [...new Color(1, 0.5, 0).linear().toArray()]);
    void ShaderMaterial;
};
void overrideChunks;
