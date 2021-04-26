import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Object from './Object';
import model from './assets/enemy.glb';

export default class Enemy extends Object {
  constructor(scene, x, y, target, fireMissile) {
    super();
    const loader = new GLTFLoader();

    loader.load(
      model,
      gltf => {
        this._mesh = gltf.scene;
        this._mesh.position.x = x;
        this._mesh.position.y = y;
        scene.add(this._mesh);
      },
      undefined,
      error => {
        console.error(error);
      }
    );

    this._speed = 4;
    this._target = target;
    this._fireMissile = fireMissile;
  }

  update(camera, _, timeElapsed) {
    super.update(camera);

    if (!this.isVisible()) return;

    if (Math.random() < timeElapsed / 5)
      this._fireMissile(this, this._target.getPosition());

    const velocity = this._target
      .getPosition()
      .clone()
      .sub(this._mesh.position)
      .normalize()
      .multiplyScalar(this._speed * timeElapsed);

    this._mesh.position.add(velocity);
    this._mesh.rotation.z = Math.atan(-velocity.x / velocity.y);
  }
}
