import { Application } from 'pixi.js'
import { MainScene } from './Scenes/MainScene';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0xffffff,
	antialias: true,
	width: window.innerWidth,
	height: window.innerHeight
});

const scene = new MainScene();

app.stage.addChild(scene);
