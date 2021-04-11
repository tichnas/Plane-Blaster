import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import model from './assets/sphere.glb';

export default class Missile {
  constructor(scene, position, target) {
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
    this._velocity.multiplyScalar(3);
    this._velocity.z = -5;
    this._level = position.z;
  }

  update(_, timeElapsed) {
    if (this._mesh) {
      this._mesh.position.add(
        this._velocity.clone().multiplyScalar(timeElapsed)
      );
      this._velocity.z += 3 * timeElapsed;
      if (this._mesh.position.z >= this._level) this._velocity.z = 0;
    }
  }
}
