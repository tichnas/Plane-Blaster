import { Box3 } from 'three';

export default class Object {
  constructor() {
    this.collider = new Box3();
    this._activated = false;
  }

  intersects(obj) {
    if (!obj.isVisible() || !this.isVisible()) return false;

    return this.collider.intersectsBox(obj.collider);
  }

  update(camera) {
    if (!this._mesh) return;

    if (this._mesh.visible && !this._activated) this._mesh.visible = false;

    this.collider.setFromObject(this._mesh);
    if (this.getPosition().y < camera.position.y) this.destroy();
    else if (camera.position.distanceTo(this.getPosition()) <= 100)
      this.activate();
    else if (
      this._activated &&
      camera.position.distanceTo(this.getPosition()) >= 100
    )
      this.destroy();
  }

  exists() {
    return this._mesh;
  }

  isVisible() {
    return this._mesh && this._mesh.visible;
  }

  destroy() {
    this._mesh.visible = false;
  }

  getPosition() {
    return this._mesh.position;
  }

  getRotation() {
    return this._mesh.rotation;
  }

  activate() {
    if (this._activated) return;

    this._activated = true;
    this._mesh.visible = true;
  }

  getSize() {
    return this.collider.getSize();
  }
}
