import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Object from './Object';
import model from './assets/missile.glb';

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

    this._velocity = target;
    this._velocity.sub(position);
    this._velocity.normalize();
    this._velocity.multiplyScalar(15);
  }

  update(camera, _, timeElapsed) {
    super.update(camera);

    this._mesh.position.add(this._velocity.clone().multiplyScalar(timeElapsed));
    this._mesh.rotation.z = Math.atan(-this._velocity.x / this._velocity.y);
  }
}
