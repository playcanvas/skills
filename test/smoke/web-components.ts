import { AnimClipElement, AnimComponentElement, ModelElement, whenReady } from '@playcanvas/web-components';

const model = document.createElement('pc-model');
model.asset = 'ship';
model.setAttribute('asset', 'ship');
model.setAttribute('position', '0 1.2 0');
const anim = document.createElement('pc-anim');
const clip = document.createElement('pc-anim-clip');
anim.clip = 'Idle';
anim.transitionTime = 0.2;
clip.name = 'Idle';
model.append(anim);
anim.append(clip);

const start = async () => {
    const { app } = await whenReady('pc-app');
    return app;
};

void [AnimClipElement, AnimComponentElement, ModelElement, model, start];
