import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import model from './assets/scene.gltf';

export default class Player {
  constructor(scene) {
    const loader = new GLTFLoader();

    loader.load(
      model,
      gltf => {
        this._mesh = gltf.scene;
        scene.add(this._mesh);
        this._mesh.rotation.y = 3.14 / 2;
        this._mesh.position.z = 1;
      },
      undefined,
      error => {
        console.error(error);
      }
    );
  }
}
