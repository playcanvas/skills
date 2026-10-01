import {
    AppBase, AppOptions, Application, Asset, AssetListLoader, BAKE_COLORDIR, BatchManager, BoxGeometry,
    CameraFrame, Color, ContainerResource, ElementInput, Entity, Keyboard, Lightmapper, Mesh,
    MeshInstance, MiniStats, SEMANTIC_TEXCOORD1, SHADERLANGUAGE_GLSL, SHADERLANGUAGE_WGSL,
    SHADOWUPDATE_THISFRAME, SKYTYPE_DOME, ShaderChunks, ShaderMaterial, StandardMaterial,
    TONEMAP_NEUTRAL, Texture, VertexBuffer, VertexFormat, WasmModule, WebglGraphicsDevice,
    basisInitialize
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
    const frame = new CameraFrame(app, camera.camera);
    frame.rendering.toneMapping = TONEMAP_NEUTRAL;
    frame.update();
    return frame;
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
    void app.stats.drawCallCount;
    void new MiniStats(app);
    const format = VertexFormat.getDefaultInstancingFormat(app.graphicsDevice);
    const vb = new VertexBuffer(app.graphicsDevice, format, 36, { data: new Float32Array(36 * 16).buffer });
    mi.setInstancing(vb, true);
    const opts = new AppOptions();
    opts.batchManager = BatchManager;
};
void reduceDrawCalls;

const overrideChunks = (mat: StandardMaterial) => {
    mat.shaderChunksVersion = '2.23';
    mat.getShaderChunks(SHADERLANGUAGE_GLSL).set('emissivePS', 'void getEmission() { dEmission = vec3(1.0); }');
    void mat.getShaderChunks(SHADERLANGUAGE_WGSL);
    mat.setParameter('accent', [...new Color(1, 0.5, 0).linear().toArray()]);
    void ShaderMaterial;
};
void overrideChunks;

const bakeLighting = (app: AppBase, light: Entity, model: Entity) => {
    const opts = new AppOptions();
    opts.lightmapper = Lightmapper;
    app.scene.ambientBake = true;
    app.scene.ambientBakeNumSamples = 16;
    if (light.light) light.light.bake = true;
    if (model.render) {
        model.render.lightmapped = true;
        model.render.lightmapSizeMultiplier = 2;
    }
    app.scene.lightmapMode = BAKE_COLORDIR;
    app.lightmapper?.bake(null, BAKE_COLORDIR);
    if (model.render) {
        for (const mi of model.render.meshInstances) {
            void mi.mesh?.vertexBuffer.format.elements.some(e => e.name === SEMANTIC_TEXCOORD1);
        }
    }
};
void bakeLighting;

const renderDensity = (app: AppBase) => {
    app.graphicsDevice.maxPixelRatio = Math.min(window.devicePixelRatio, 2);
    app.resizeCanvas();
    app.maxDeltaTime = 0.05;
};
void renderDensity;

const addEffects = (burst: Entity, mi: MeshInstance) => {
    burst.particlesystem?.reset();
    burst.particlesystem?.play();
    burst.particlesystem?.stop();
    mi.setParameter('pulse', 0.5);
};
void addEffects;

const loadAssets = async (app: AppBase, asset: Asset) => {
    WasmModule.setConfig('DracoDecoderModule', {
        glueUrl: '/wasm/draco/draco.wasm.js',
        wasmUrl: '/wasm/draco/draco.wasm.wasm',
        fallbackUrl: '/wasm/draco/draco.js'
    });
    await new Promise((resolve) => WasmModule.getInstance('DracoDecoderModule', resolve));
    basisInitialize({ glueUrl: '/wasm/basis/basis.wasm.js', wasmUrl: '/wasm/basis/basis.wasm.wasm' });
    await new Promise<void>((resolve) => new AssetListLoader([asset], app.assets).load(() => resolve()));
    const entity = (asset.resource as ContainerResource).instantiateRenderEntity();
    const texture = new Texture(app.graphicsDevice);
    texture.anisotropy = 8;
    return entity;
};
void loadAssets;

const conventions = (app: AppBase, canvas: HTMLCanvasElement, light: Entity, cam: Entity) => {
    void new Application(canvas, { keyboard: new Keyboard(window), elementInput: new ElementInput(canvas) });
    window.addEventListener('resize', () => app.resizeCanvas());
    void Mesh.fromGeometry(app.graphicsDevice, new BoxGeometry());
    light.setEulerAngles(45, 30, 0);
    const mat = new StandardMaterial();
    mat.useMetalness = true;
    mat.update();
    void ShaderChunks.get(app.graphicsDevice, SHADERLANGUAGE_GLSL);
    if (cam.camera) cam.camera.toneMapping = TONEMAP_NEUTRAL;
    if (light.light) {
        light.light.castShadows = true;
        light.light.shadowDistance = 80;
        light.light.shadowUpdateMode = SHADOWUPDATE_THISFRAME;
    }
    app.scene.ambientLight = new Color(0.2, 0.2, 0.2);
    app.scene.sky.type = SKYTYPE_DOME;
    void app.scene.clusteredLightingEnabled;
};
void conventions;
