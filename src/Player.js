import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import model from './assets/sphere.glb';

export default class Player {
  constructor(scene) {
    const loader = new GLTFLoader();

    loader.load(
      model,
      gltf => {
        this._mesh = gltf.scene;
        this._mesh.position.z = 7;
        scene.add(this._mesh);
      },
      undefined,
      error => {
        console.error(error);
      }
    );

    this._initInput();
  }

  _initInput() {
    this._keys = {
      left: false,
      right: false,
      forward: false,
      backward: false,
    };

    document.addEventListener('keydown', e => {
      this._onKeyDown(e);
    });
    document.addEventListener('keyup', e => {
      this._onKeyUp(e);
    });
  }

  _onKeyDown(e) {
    switch (e.keyCode) {
      case 38:
        this._keys.forward = true;
        break;
      case 40:
        this._keys.backward = true;
        break;
      case 37:
        this._keys.left = true;
        break;
      case 39:
        this._keys.right = true;
        break;
    }
  }

  _onKeyUp(e) {
    switch (e.keyCode) {
      case 38:
        this._keys.forward = false;
        break;
      case 40:
        this._keys.backward = false;
        break;
      case 37:
        this._keys.left = false;
        break;
      case 39:
        this._keys.right = false;
        break;
    }
  }

  update(time) {
    if (this._keys.forward) this._mesh.position.y += time;
    if (this._keys.backward) this._mesh.position.y -= time;
    if (this._keys.right) this._mesh.position.x += time;
    if (this._keys.left) this._mesh.position.x -= time;
  }
}
