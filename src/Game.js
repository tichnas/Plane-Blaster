import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AmbientLight,
  DirectionalLight,
  PlaneGeometry,
  MeshStandardMaterial,
} from 'three';

import Player from './Player';
import Missile from './Missile';
import Star from './Star';
import Enemy from './Enemy';

export default class Game {
  constructor() {
    this._lastTime = 0;
    this._scene = new Scene();

    this._width = 100;
    this._length = 1000;
    this._rangeLength = 100;
    this._rangeWidth = 40;

    this._camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2 * this._rangeLength
    );
    this._camera.position.z = 15;
    this._camera.position.y = -15;
    this._camera.lookAt(0, 30, 0);

    let plane = new Mesh(
      new PlaneGeometry(this._width, this._length, 1, 1),
      new MeshStandardMaterial({ color: 0xffffff })
    );
    plane.position.z = -20;
    this._scene.add(plane);

    let light = new AmbientLight(0x444444);
    this._scene.add(light);
    light = new DirectionalLight(0xffffff);
    light.position.set(0, -50, 100);
    this._scene.add(light);

    this._renderer = new WebGLRenderer();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);

    window.addEventListener(
      'resize',
      () => {
        this._onWindowResize();
      },
      false
    );

    this._animate();

    this._generateLevel();
  }

  _onWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _animate() {
    requestAnimationFrame(t => {
      const time = (t - this._lastTime) / 1000;
      this._lastTime = t;

      this._update(t, time);

      this._renderer.render(this._scene, this._camera);
      this._animate();
    });
  }

  _generateLevel() {
    this._player = new Player(this._scene, this._fireMissile.bind(this));

    this._missiles = [];

    this._stars = [];
    for (let i = 0; i < this._length; i += this._rangeLength) {
      let noOfStars = Math.floor(Math.random() * 4) + 2;

      while (noOfStars--) {
        const x =
          Math.floor(Math.random() * this._rangeWidth) - this._rangeWidth / 2;
        const y = Math.floor(Math.random() * this._rangeLength) + 20;

        this._stars.push(new Star(this._scene, x, y));
      }
    }

    this._enemies = [];
    for (let i = 0; i < this._length; i += this._rangeLength) {
      let noOfEnemies = Math.floor(Math.random() * 4);

      while (noOfEnemies--) {
        const x =
          Math.floor(Math.random() * this._rangeWidth) - this._rangeWidth / 2;
        const y = Math.floor(Math.random() * this._rangeLength) + 20;

        this._enemies.push(new Enemy(this._scene, x, y, this._player));
      }
    }
  }

  _update(time, timeElapsed) {
    this._camera.position.y += 2 * timeElapsed;

    this._player.update(this._camera, time, timeElapsed);
    this._player.handleScope(
      -this._rangeWidth / 2,
      this._rangeWidth / 2,
      this._camera.position.y + 15,
      this._camera.position.y + 15 + this._rangeLength / 4
    );

    for (const missile of this._missiles) {
      if (!missile.isVisible()) continue;

      missile.update(this._camera, time, timeElapsed);

      if (
        this._camera.position.distanceTo(missile.getPosition()) >
        this._rangeLength
      )
        missile.destroy();
    }

    for (const star of this._stars) {
      star.update(this._camera);
    }

    for (const enemy of this._enemies) {
      enemy.update(this._camera, time, timeElapsed);
    }

    this._checkCollisions();
  }

  _checkCollisions() {
    for (const star of this._stars) {
      if (!star.isVisible()) continue;

      if (this._player.intersects(star)) {
        console.log('star');
        star.destroy();
      }
    }
  }

  _fireMissile(position, target) {
    this._missiles.push(new Missile(this._scene, position, target));
  }
}
