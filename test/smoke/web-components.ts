import { ModelElement, whenReady } from '@playcanvas/web-components';

const model = document.createElement('pc-model');
model.asset = 'ship';
model.setAttribute('asset', 'ship');
model.setAttribute('position', '0 1.2 0');

const start = async () => {
    const { app } = await whenReady('pc-app');
    return app;
};

void [ModelElement, model, start];
