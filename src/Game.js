import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AmbientLight,
  PlaneGeometry,
  MeshStandardMaterial,
} from 'three';

import Player from './Player';

export default class Game {
  constructor() {
    this._scene = new Scene();

    this._camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this._camera.position.z = 20;
    this._camera.position.y = 10;

    const ground = new Mesh(
      new PlaneGeometry(100, 100, 1, 1),
      new MeshStandardMaterial({ color: 0xffffff })
    );
    ground.castShadow = false;
    ground.receiveShadow = true;
    this._scene.add(ground);

    const light = new AmbientLight(0xeeeeee);
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
    requestAnimationFrame(() => {
      this._renderer.render(this._scene, this._camera);
      this._animate();
    });
  }
}
