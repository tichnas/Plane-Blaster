import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  AmbientLight,
  DirectionalLight,
  PlaneGeometry,
  MeshStandardMaterial,
  SphereGeometry,
  MeshBasicMaterial,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import playerModel from './assets/player.glb';
import enemyModel from './assets/enemy.glb';
import missileModel from './assets/missile.glb';
import starModel from './assets/star.glb';

function wait(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, time);
  });
}

export default class Video {
  constructor() {
    this._scene = new Scene();
    this._modelsLoaded = 0;

    this._audio = {
      bg: document.getElementById('audio-bg'),
      fire: document.getElementById('audio-fire'),
    };

    this._audio.bg.volume = 0.05;

    this._camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );

    let plane = new Mesh(
      new PlaneGeometry(200, 200, 1, 1),
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

    this._controls = new OrbitControls(this._camera, this._renderer.domElement);

    window.addEventListener(
      'resize',
      () => {
        this._onWindowResize();
      },
      false
    );

    this._loadModels();

    this._animate();
  }

  _loadModels() {
    const blastGeometry = new SphereGeometry(5, 32, 32);
    const blastMaterial = new MeshBasicMaterial({ color: 0xd16817 });
    this._blast = new Mesh(blastGeometry, blastMaterial);
    this._scene.add(this._blast);

    const loader = new GLTFLoader();

    loader.load(
      playerModel,
      gltf => {
        this._modelsLoaded++;
        this._player = gltf.scene;
        this._scene.add(this._player);
      },
      undefined,
      error => {
        console.error(error);
      }
    );

    loader.load(
      enemyModel,
      gltf => {
        this._modelsLoaded++;
        this._enemies = [];
        for (let i = 0; i < 5; i++) {
          let enemy = gltf.scene.clone();
          this._enemies.push(enemy);
          this._scene.add(enemy);
        }
        this._middleEnemy = this._enemies[Math.floor(this._enemies.length / 2)];
      },
      undefined,
      error => {
        console.error(error);
      }
    );

    loader.load(
      starModel,
      gltf => {
        this._modelsLoaded++;
        this._star = gltf.scene;
        this._scene.add(this._star);
      },
      undefined,
      error => {
        console.error(error);
      }
    );

    loader.load(
      missileModel,
      gltf => {
        this._modelsLoaded++;
        this._missile = gltf.scene;
        this._scene.add(this._missile);
      },
      undefined,
      error => {
        console.error(error);
      }
    );
  }

  async _startVideo() {
    const lag = 35;
    let period;

    this._camera.position.z = 15;
    this._camera.position.y = -15;
    this._camera.lookAt(0, 30, 15);

    this._player.position.z = 10;
    this._player.position.y = 50;
    this._player.rotation.z = Math.PI;

    for (let i = 0; i < this._enemies.length; i++) {
      let enemy = this._enemies[i];
      enemy.rotation.z = Math.PI;
      enemy.position.z = 10;
      enemy.position.y = -55;
      enemy.position.x = 10 * (i - Math.floor(this._enemies.length / 2));
    }

    this._missile.visible = false;
    this._blast.visible = false;
    this._star.visible = false;

    // Player plane landing
    period = 200;
    for (let i = 1; i <= period; i++) {
      this._player.position.y -= 50 / period;
      this._camera.lookAt(0, 30, 15 - (15 * i) / period);
      await wait(lag);
    }

    // Camera showing full ground
    period = 100;
    for (let i = 1; i <= period; i++) {
      this._camera.position.y -= 50 / period;
      this._camera.position.z += 20 / period;
      this._camera.lookAt(0, 30 - (40 * i) / period, 0);
      await wait(lag);
    }

    // Enemies coming forward
    period = 10;
    for (let i = 1; i <= period; i++) {
      for (let i = 0; i < this._enemies.length; i++) {
        let enemy = this._enemies[i];
        enemy.position.y += 10 / period;
        await wait(lag);
      }
    }

    // Dhum ta na na na Dhum ta na na na between player & enemies
    period = 20;
    this._camera.updateProjectionMatrix();
    this._camera.position.x = 0;
    this._camera.position.y = -25;
    this._camera.position.z = 20;
    for (let i = 0; i < 2; i++) {
      this._camera.up.set(0, 0, 1);
      this._camera.lookAt(0, 0, 20);
      await wait(period * lag);
      this._camera.up.set(0, 0, 1);
      this._camera.lookAt(0, -40, 15);
      await wait(period * lag);
    }

    // Middle enemy jumping to fire missile
    period = 15;
    for (let i = 1; i <= period; i++) {
      let change = 2 / (period / 2);
      if (i > period / 2) change *= -1;
      this._middleEnemy.position.z += change;
      await wait(lag);
    }

    // Missile from enemy to player
    this._audio.fire.currentTime = 0;
    this._audio.fire.play();
    this._missile.visible = true;
    this._missile.position.x = 0;
    this._missile.position.y = -42;
    this._missile.position.z = 10;
    this._player.position.y = 20;
    period = 100;
    for (let i = 1; i <= period; i++) {
      this._missile.position.y += 50 / period;
      this._camera.position.y += 20 / period;
      this._camera.position.x += 20 / period;
      this._camera.lookAt(this._missile.position);
      await wait(lag);
    }

    // Player avoiding missile
    period = 50; // ideally should be half as above for constant missile speed
    for (let i = 1; i <= period; i++) {
      this._missile.position.y += 25 / period;
      this._player.position.y -= 10 / period;
      this._player.position.x += (i > period / 2 ? -10 : 10) / (period / 2);
      await wait(lag);
    }

    // Player jumping to fire missile
    period = 15;
    wait(15 * lag);
    for (let i = 1; i <= period; i++) {
      let change = 2 / (period / 2);
      if (i > period / 2) change *= -1;
      this._player.position.z += change;
      await wait(lag);
    }

    // Player firing missile
    this._audio.fire.currentTime = 0;
    this._audio.fire.play();
    this._missile.position.y = 7;
    period = 100;
    for (let i = 1; i <= period; i++) {
      this._missile.position.y -= 50 / period;
      this._camera.position.y -= 20 / period;
      this._camera.position.x -= 20 / period;
      this._camera.lookAt(this._missile.position);
      await wait(lag);
    }

    // Blast enemy plane and generate star
    period = 24;
    this._blast.visible = true;
    this._blast.position.x = this._middleEnemy.position.x;
    this._blast.position.y = this._middleEnemy.position.y;
    this._blast.position.z = this._middleEnemy.position.z;
    for (let i = 1; i <= period; i++) {
      this._blast.scale.x = i / period;
      this._blast.scale.y = i / period;
      this._blast.scale.z = i / period;
      await wait(lag);
    }
    this._middleEnemy.visible = false;
    this._missile.visible = false;
    this._star.visible = true;
    this._star.scale.x = 2;
    this._star.scale.y = 2;
    this._star.scale.z = 2;
    this._star.position.x = this._middleEnemy.position.x;
    this._star.position.y = this._middleEnemy.position.y;
    this._star.position.z = this._middleEnemy.position.z;

    // Remove blast
    period = 24;
    for (let i = 1; i <= period; i++) {
      this._blast.scale.x = 1 - i / period;
      this._blast.scale.y = 1 - i / period;
      this._blast.scale.z = 1 - i / period;
      await wait(lag);
    }
    this._blast.visible = false;

    // Camera looking at whole picture
    period = 100;
    for (let i = 1; i <= period; i++) {
      this._camera.position.y += 19 / period;
      this._camera.position.z += 50 / period;
      const initialLook = this._star.position.y;
      this._camera.lookAt(0, initialLook + (28 * i) / period, 0);
      await wait(lag);
    }

    // Camera zooming
    period = 20;
    for (let i = 1; i <= period; i++) {
      this._camera.position.z -= 50 / period;
      await wait(lag);
    }

    const trailerText = document.getElementById('trailer');
    trailerText.innerHTML += 'THE FIGHT<br />FOR JUSTICE';
    trailerText.classList.add('trailer-animate');
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

      if (this._modelsLoaded === 4) {
        this._modelsLoaded = -1;
        this._startVideo();
      }

      this._renderer.render(this._scene, this._camera);
      this._animate();
    });
  }
}
