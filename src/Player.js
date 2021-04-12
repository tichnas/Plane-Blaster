import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import model from './assets/sphere.glb';

export default class Player {
  constructor(scene, fireMissile) {
    const loader = new GLTFLoader();

    loader.load(
      model,
      gltf => {
        this._mesh = gltf.scene;
        scene.add(this._mesh);
      },
      undefined,
      error => {
        console.error(error);
      }
    );

    this._initInput();

    this._lastFire = 0;
    this._fireMissile = function () {
      const position = this._mesh.position;
      const target = new Vector3(position.x, position.y + 1, position.z);
      fireMissile(position, target);
    };

    this._speed = 1.5;
  }

  _initInput() {
    this._keys = {
      left: false,
      right: false,
      forward: false,
      backward: false,
      space: false,
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
      case 32:
        this._keys.space = true;
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
      case 32:
        this._keys.space = false;
        break;
    }
  }

  update(time, timeElapsed) {
    if (this._keys.forward) this._mesh.position.y += this._speed * timeElapsed;
    if (this._keys.backward) this._mesh.position.y -= this._speed * timeElapsed;
    if (this._keys.right) this._mesh.position.x += this._speed * timeElapsed;
    if (this._keys.left) this._mesh.position.x -= this._speed * timeElapsed;

    if (this._keys.space && time > this._lastFire + 1000) {
      this._fireMissile();
      this._lastFire = time;
    }
  }

  handleScope(minX, maxX, minY, maxY) {
    if (!this._mesh) return;
    this._mesh.position.x = Math.min(this._mesh.position.x, maxX);
    this._mesh.position.x = Math.max(this._mesh.position.x, minX);
    this._mesh.position.y = Math.min(this._mesh.position.y, maxY);
    this._mesh.position.y = Math.max(this._mesh.position.y, minY);
  }
}
