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
import Missile from './Missile';

export default class Game {
  constructor() {
    this._lastTime = 0;
    this._scene = new Scene();

    const width = 100;
    const height = 500;

    this._camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this._camera.position.z = 15;
    this._camera.position.y = -15;
    this._camera.lookAt(0, 30, 0);

    let plane = new Mesh(
      new PlaneGeometry(width, height, 1, 1),
      new MeshStandardMaterial({ color: 0xffffff })
    );
    plane.position.z = -20;
    this._scene.add(plane);
    plane = new Mesh(
      new PlaneGeometry(width, height, 1, 1),
      new MeshStandardMaterial({ color: 0xffffff })
    );
    plane.rotation.y = Math.PI / 2;
    plane.position.z = -20 + height / 2;
    plane.position.x = -width / 2;
    this._scene.add(plane);
    plane = new Mesh(
      new PlaneGeometry(width, height, 1, 1),
      new MeshStandardMaterial({ color: 0xffffff })
    );
    plane.rotation.y = -Math.PI / 2;
    plane.position.z = -20 + height / 2;
    plane.position.x = width / 2;
    this._scene.add(plane);

    let light = new AmbientLight(0x444444);
    this._scene.add(light);
    light = new DirectionalLight(0xffffff);
    light.position.set(0, -50, 100);
    this._scene.add(light);

    this._renderer = new WebGLRenderer();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);

    this._player = new Player(this._scene, this._fireMissile.bind(this));
    this._missiles = [];

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

      this._update(t, time);

      this._renderer.render(this._scene, this._camera);
      this._animate();
    });
  }

  _update(time, timeElapsed) {
    this._player.update(time, timeElapsed);
    for (const missile of this._missiles) missile.update(time, timeElapsed);
  }

  _fireMissile(position, target) {
    this._missiles.push(new Missile(this._scene, position, target));
  }
}
