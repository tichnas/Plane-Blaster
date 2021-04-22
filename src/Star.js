import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Object from './Object';
import model from './assets/star.glb';

export default class Star extends Object {
  constructor(scene, x, y) {
    super();
    const loader = new GLTFLoader();

    loader.load(
      model,
      gltf => {
        this._mesh = gltf.scene;
        this._mesh.position.x = x;
        this._mesh.position.y = y;
        this._mesh.visible = false;
        scene.add(this._mesh);
      },
      undefined,
      error => {
        console.error(error);
      }
    );
  }
}
