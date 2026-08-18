import type { ComponentProps } from 'react';
import type { Asset } from 'playcanvas';
import { Container, Entity } from '@playcanvas/react';
import { Anim, Camera, Render, Script } from '@playcanvas/react/components';
import { useModel } from '@playcanvas/react/hooks';

const asset = {} as Asset;
const render: ComponentProps<typeof Render> = { type: 'asset', asset };
const anim: ComponentProps<typeof Anim> = { asset, activate: true };

void [Container, Entity, Camera, Script, useModel, render, anim];
