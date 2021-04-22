import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Object from './Object';
import model from './assets/player.glb';

export default class Player extends Object {
  constructor(scene, fireMissile) {
    super();
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
      const front = new Vector3(0, 1, 0);
      front.applyAxisAngle(new Vector3(0, 0, 1), this._mesh.rotation.z);
      const target = front.add(this._mesh.position);
      fireMissile(this, target);
    };

    this._speed = 10;
  }

  _initInput() {
    this._keys = {
      left: false,
      right: false,
      forward: false,
      backward: false,
      space: false,
      rotateLeft: false,
      rotateRight: false,
      resetRotate: false,
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
      case 65:
        this._keys.rotateLeft = true;
        break;
      case 68:
        this._keys.rotateRight = true;
        break;
      case 83:
        this._keys.resetRotate = true;
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
      case 65:
        this._keys.rotateLeft = false;
        break;
      case 68:
        this._keys.rotateRight = false;
        break;
      case 83:
        this._keys.resetRotate = false;
        break;
    }
  }

  update(camera, time, timeElapsed) {
    super.update(camera);

    if (!this._mesh) return;

    const axis = new Vector3(0, 0, 1);
    const front = new Vector3(0, this._speed * timeElapsed, 0);
    front.applyAxisAngle(axis, this._mesh.rotation.z);
    const right = front.clone().applyAxisAngle(axis, -Math.PI / 2);
    const back = front.clone().negate();
    const left = right.clone().negate();

    if (this._keys.forward) this._mesh.position.add(front);
    if (this._keys.backward) this._mesh.position.add(back);
    if (this._keys.left) this._mesh.position.add(left);
    if (this._keys.right) this._mesh.position.add(right);
    if (this._keys.rotateLeft)
      this._mesh.rotation.z += (this._speed * timeElapsed) / 2;
    if (this._keys.rotateRight)
      this._mesh.rotation.z -= (this._speed * timeElapsed) / 2;
    if (this._keys.resetRotate) this._mesh.rotation.z = 0;

    if (this._keys.space && time > this._lastFire + 500) {
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
