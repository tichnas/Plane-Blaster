import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Object from './Object';
import model from './assets/sphere.glb';

export default class Missile extends Object {
  constructor(scene, position, target) {
    super();
    const loader = new GLTFLoader();

    loader.load(
      model,
      gltf => {
        this._mesh = gltf.scene;
        this._mesh.position.copy(position);
        scene.add(this._mesh);
      },
      undefined,
      error => {
        console.error(error);
      }
    );

    this._velocity = target.clone();
    this._velocity.sub(position);
    this._velocity.normalize();
    this._velocity.multiplyScalar(10);
    this._velocity.z = -10;
    this._level = position.z;
  }

  update(camera, _, timeElapsed) {
    super.update(camera);

    this._mesh.position.add(this._velocity.clone().multiplyScalar(timeElapsed));
    this._velocity.z += 30 * timeElapsed;
    if (this._mesh.position.z >= this._level) this._velocity.z = 0;
    this._mesh.rotation.x = Math.atan(this._velocity.z / this._velocity.y);
  }
}
