import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import model from './assets/sphere.glb';

export default class Star {
  constructor(scene, x, y) {
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

  remove() {
    this._mesh.visible = false;
  }

  getPosition() {
    return this._mesh.position;
  }

  exists() {
    return this._mesh;
  }

  visible() {
    this._mesh.visible = true;
  }
}
