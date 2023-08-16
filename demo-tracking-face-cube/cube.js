(function () {
  var CubeRenderer = function () {};

  CubeRenderer.prototype.init = function (container) {
    if (!CubeRenderer.isWebGLEnabled()) {
      throw new Error("WebGL is not enabled in your browser.");
    }
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.scene.add(this.camera);

    var geometry = new THREE.BoxGeometry(100, 100, 100);
    var material = new THREE.MeshLambertMaterial({ color: 0x000ffff });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.set(200, 200, 200);

    var createDirectionalLight = function (intensity, x, y, z, scene) {
      var light = new THREE.DirectionalLight("#ffffff", intensity);
      light.position.set(x, y, z);
      light.distance = 10;
      scene.add(light);
    };

    const ambientLight = new THREE.AmbientLight(new THREE.Color(0xffffff), 0.6);
    this.scene.add(ambientLight);

    createDirectionalLight(0.3, 0, 200, -200, this.scene);
    createDirectionalLight(0.3, 0, 0, 200, this.scene);

    var _params = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
    };

    var width = window.innerWidth || 2;
    var height = window.innerHeight || 2;

    this.renderer = new THREE.WebGLRenderer(width, height, _params);
    container.appendChild(this.renderer.domElement);
    this.renderer.setSize(width, height);
  };

  var tempArr = [];
  CubeRenderer.prototype.render = function (controlX, controlY) {
    var dir;
    if (controlX < 4000) {
      dir = -1;
    } else {
      dir = 1;
    }
    this.cube.rotation.y += 0.02 * dir;

    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  };

  CubeRenderer.isWebGLEnabled = function () {
    try {
      var canvas = document.createElement("canvas");
      return (
        !!window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  };

  window.CubeRenderer = CubeRenderer;
})();
