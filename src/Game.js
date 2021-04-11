import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AmbientLight,
  DirectionalLight,
  PlaneGeometry,
  MeshStandardMaterial,
} from 'three';

import Player from './Player';

export default class Game {
  constructor() {
    this._lastTime = 0;
    this._scene = new Scene();

    this._camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this._camera.position.z = 20;
    this._camera.position.y = -10;
    this._camera.lookAt(0, 10, 0);

    const ground = new Mesh(
      new PlaneGeometry(100, 100, 1, 1),
      new MeshStandardMaterial({ color: 0xffffff })
    );
    this._scene.add(ground);

    let light = new AmbientLight(0x444444);
    this._scene.add(light);
    light = new DirectionalLight(0xffffff);
    light.position.set(0, -50, 100);
    this._scene.add(light);

    this._renderer = new WebGLRenderer();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);

    this._player = new Player(this._scene);

    window.addEventListener(
      'resize',
      () => {
        this._onWindowResize();
      },
      false
    );

    this._animate();
  }

  _onWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _animate() {
    requestAnimationFrame(t => {
      const time = (t - this._lastTime) / 1000;
      this._lastTime = t;

      this._player.update(time);

      this._renderer.render(this._scene, this._camera);
      this._animate();
    });
  }
}
