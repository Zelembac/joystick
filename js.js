var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
    engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
    engine.adaptToDeviceRatio = true;
  });
};

let chosenColor;
let chosenPattern;
let chosenPart = 2;
let colors = document.getElementsByClassName("color");
let pattern = document.getElementsByClassName("pattern");
let parts = document.getElementsByClassName("parts");

let addOnPrice = 0;
let startingPrice = 50;

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};
var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera(
    "camera",
    BABYLON.Tools.ToRadians(90),
    BABYLON.Tools.ToRadians(65),
    10,
    BABYLON.Vector3.Zero(),
    scene
  );

  var defaultPipeline = new BABYLON.DefaultRenderingPipeline(
    "DefaultRenderingPipeline",
    false, // is HDR?
    scene,
    scene.cameras
  );
  if (defaultPipeline.isSupported) {
    /* MSAA */
    defaultPipeline.samples = 1; // 1 by default
    /* imageProcessing */
    defaultPipeline.imageProcessingEnabled = true; //true by default
    if (defaultPipeline.imageProcessingEnabled) {
      defaultPipeline.imageProcessing.contrast = 1; // 1 by default
      defaultPipeline.imageProcessing.exposure = 1; // 1 by default
      /* color grading */
      defaultPipeline.imageProcessing.colorGradingEnabled = false; // false by default
      if (defaultPipeline.imageProcessing.colorGradingEnabled) {
        // using .3dl (best) :
        defaultPipeline.imageProcessing.colorGradingTexture =
          new BABYLON.ColorGradingTexture("textures/LateSunset.3dl", scene);
        // using .png :
        /*
                                                                                                                                                                                                                                                                                                                                                                        var colorGradingTexture = new BABYLON.Texture("textures/colorGrade-highContrast.png", scene, true, false);
                                                                                                                                                                                                                                                                                                                                                                        colorGradingTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                                                                                                                                                                                                                                                                                                                                                                        colorGradingTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
                                                                                                                                                                                                                                                                                                                                                                        defaultPipeline.imageProcessing.colorGradingTexture = colorGradingTexture;
                                                                                                                                                                                                                                                                                                                                                                        defaultPipeline.imageProcessing.colorGradingWithGreenDepth = false;
                                                                                                                                                                                                                                                                                                                                                                        */
      }
      /* color curves */
      defaultPipeline.imageProcessing.colorCurvesEnabled = false; // false by default
      if (defaultPipeline.imageProcessing.colorCurvesEnabled) {
        var curve = new BABYLON.ColorCurves();
        curve.globalDensity = 0; // 0 by default
        curve.globalExposure = 0; // 0 by default
        curve.globalHue = 30; // 30 by default
        curve.globalSaturation = 0; // 0 by default
        curve.highlightsDensity = 0; // 0 by default
        curve.highlightsExposure = 0; // 0 by default
        curve.highlightsHue = 30; // 30 by default
        curve.highlightsSaturation = 0; // 0 by default
        curve.midtonesDensity = 0; // 0 by default
        curve.midtonesExposure = 0; // 0 by default
        curve.midtonesHue = 30; // 30 by default
        curve.midtonesSaturation = 0; // 0 by default
        curve.shadowsDensity = 0; // 0 by default
        curve.shadowsExposure = 0; // 0 by default
        curve.shadowsHue = 30; // 30 by default
        curve.shadowsDensity = 80;
        curve.shadowsSaturation = 0; // 0 by default;
        defaultPipeline.imageProcessing.colorCurves = curve;
      }
    }
    /* bloom */
    defaultPipeline.bloomEnabled = false; // false by default
    if (defaultPipeline.bloomEnabled) {
      defaultPipeline.bloomKernel = 64; // 64 by default
      defaultPipeline.bloomScale = 0.5; // 0.5 by default
      defaultPipeline.bloomThreshold = 0.9; // 0.9 by default
      defaultPipeline.bloomWeight = 0.15; // 0.15 by default
    }
    /* chromatic abberation */
    defaultPipeline.chromaticAberrationEnabled = false; // false by default
    if (defaultPipeline.chromaticAberrationEnabled) {
      defaultPipeline.chromaticAberration.aberrationAmount = 30; // 30 by default
      defaultPipeline.chromaticAberration.adaptScaleToCurrentViewport = false; // false by default
      defaultPipeline.chromaticAberration.alphaMode = 0; // 0 by default
      defaultPipeline.chromaticAberration.alwaysForcePOT = false; // false by default
      defaultPipeline.chromaticAberration.enablePixelPerfectMode = false; // false by default
      defaultPipeline.chromaticAberration.forceFullscreenViewport = true; // true by default
    }
    /* DOF */
    defaultPipeline.depthOfFieldEnabled = false; // false by default
    if (
      defaultPipeline.depthOfFieldEnabled &&
      defaultPipeline.depthOfField.isSupported
    ) {
      defaultPipeline.depthOfFieldBlurLevel = 0; // 0 by default
      defaultPipeline.depthOfField.fStop = 1.4; // 1.4 by default
      defaultPipeline.depthOfField.focalLength = 50; // 50 by default, mm
      defaultPipeline.depthOfField.focusDistance = 2000; // 2000 by default, mm
      defaultPipeline.depthOfField.lensSize = 50; // 50 by default
    }
    /* FXAA */
    defaultPipeline.fxaaEnabled = false; // false by default
    if (defaultPipeline.fxaaEnabled) {
      defaultPipeline.fxaa.samples = 1; // 1 by default
      defaultPipeline.fxaa.adaptScaleToCurrentViewport = false; // false by default
    }
    /* glowLayer */
    defaultPipeline.glowLayerEnabled = true;
    if (defaultPipeline.glowLayerEnabled) {
      defaultPipeline.glowLayer.blurKernelSize = 46; // 16 by default
      defaultPipeline.glowLayer.intensity = 0.6; // 1 by default
    }
    /* grain */
    defaultPipeline.grainEnabled = false;
    if (defaultPipeline.grainEnabled) {
      defaultPipeline.grain.adaptScaleToCurrentViewport = false; // false by default
      defaultPipeline.grain.animated = false; // false by default
      defaultPipeline.grain.intensity = 30; // 30 by default
    }
    /* sharpen */
    defaultPipeline.sharpenEnabled = false;
    if (defaultPipeline.sharpenEnabled) {
      defaultPipeline.sharpen.adaptScaleToCurrentViewport = false; // false by default
      defaultPipeline.sharpen.edgeAmount = 0.3; // 0.3 by default
      defaultPipeline.sharpen.colorAmount = 1; // 1 by default
    }
  }

  // camera.angularSensibilityX = 2500;
  // camera.angularSensibilityY = 2500;

  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  camera.lowerRadiusLimit = 7;
  camera.upperRadiusLimit = 8;

  const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
    "003.env",
    scene
  );
  hdrTexture.rotationY = -0.2;

  scene.environmentIntensity = 0.75;

  scene.environmentTexture = hdrTexture;

  camera.setTarget(BABYLON.Vector3.Zero());

  camera.attachControl(canvas, true);
  camera.position = new BABYLON.Vector3(
    -0.011843759771134445,
    -0.8585185708946625,
    10.966439968776717
  );

  let srcArray = [
    "https://cdn.spectrumcustomizer.com/xbox/v3/frontend/img/body-color-",
    "https://cdn.spectrumcustomizer.com/xbox/v3/frontend/img/back-color-",
    "https://cdn.spectrumcustomizer.com/xbox/v3/frontend/img/thumbsticks-",
    "https://cdn.spectrumcustomizer.com/xbox/v3/frontend/img/bumpers-color-",
    "https://cdn.spectrumcustomizer.com/xbox/v3/frontend/img/triggers-color-",
    "https://cdn.spectrumcustomizer.com/xbox/v3/frontend/img/abxy-color-",
    "https://cdn.spectrumcustomizer.com/xbox/v3/frontend/img/d-pad-",
  ];

  function focusPart() {
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].id == chosenPart) {
        parts[i].style.backgroundColor =
          "rgb(" + 33 + "," + 36 + "," + 38 + ")";

        parts[i].children[0].src = srcArray[i] + "active.svg";
      } else {
        parts[i].style.backgroundColor =
          "rgb(" + 44 + "," + 48 + "," + 51 + ")";
        parts[i].children[0].src = srcArray[i] + "inactive.svg";
      }
    }
  }
  let sticksMaterial = new BABYLON.PBRMaterial("sticksMaterial", scene);
  sticksMaterial.metallic = 0;
  sticksMaterial.roughness = 0.999;
  sticksMaterial.useRoughnessFromMetallicTextureAlpha = true;
  sticksMaterial.iridescence.indexOfRefraction = 1.3;
  sticksMaterial.albedoColor = new BABYLON.Color3(
    0.00309546,
    0.00309546,
    0.00309546
  );
  sticksMaterial.ambientColor = new BABYLON.Color3(0, 0, 0);
  sticksMaterial.metallicF0Factor = 1;
  sticksMaterial.metallicReflectanceColor = new BABYLON.Color3(1, 1, 1);

  let buttonMatterial = new BABYLON.PBRMaterial("buttonMatterial", scene);
  buttonMatterial.metallic = 0;
  buttonMatterial.roughness = 0.999;
  buttonMatterial.useRoughnessFromMetallicTextureAlpha = true;
  buttonMatterial.iridescence.indexOfRefraction = 1.3;
  buttonMatterial.albedoColor = new BABYLON.Color3(
    0.00309546,
    0.00309546,
    0.00309546
  );
  buttonMatterial.ambientColor = new BABYLON.Color3(0, 0, 0);

  buttonMatterial._metalicReflectanceColor = new BABYLON.Color3(
    0.4668026694351782,
    0.4668026694351782,
    0.4668026694351782
  );
  buttonMatterial._metalic = 0;
  buttonMatterial._metalicFOFactor = 1;
  buttonMatterial._roughness = 0.29133856296539307;

  let buttonLMatterial = new BABYLON.PBRMaterial("buttonLMatterial", scene);
  buttonLMatterial.metallic = 0;
  buttonLMatterial.roughness = 0.999;
  buttonLMatterial.useRoughnessFromMetallicTextureAlpha = true;
  buttonLMatterial.iridescence.indexOfRefraction = 1.3;
  buttonLMatterial.albedoColor = new BABYLON.Color3(
    0.00309546,
    0.00309546,
    0.00309546
  );
  buttonLMatterial.ambientColor = new BABYLON.Color3(0, 0, 0);
  buttonLMatterial._metalicReflectanceColor = new BABYLON.Color3(
    0.4668026694351782,
    0.4668026694351782,
    0.4668026694351782
  );
  buttonLMatterial._metalic = 0;
  buttonLMatterial._metalicFOFactor = 1;
  buttonLMatterial._roughness = 0.29133856296539307;

  let buttonRMatterial = new BABYLON.PBRMaterial("buttonRMatterial", scene);
  buttonRMatterial.metallic = 0;
  buttonRMatterial.roughness = 0.999;
  buttonRMatterial.useRoughnessFromMetallicTextureAlpha = true;
  buttonRMatterial.iridescence.indexOfRefraction = 1.3;
  buttonRMatterial.albedoColor = new BABYLON.Color3(
    0.00309546,
    0.00309546,
    0.00309546
  );
  buttonRMatterial.ambientColor = new BABYLON.Color3(0, 0, 0);

  buttonRMatterial._metalicReflectanceColor = new BABYLON.Color3(
    0.4668026694351782,
    0.4668026694351782,
    0.4668026694351782
  );
  buttonRMatterial._metalic = 0;
  buttonRMatterial._metalicFOFactor = 1;
  buttonRMatterial._roughness = 0.29133856296539307;

  const buttonPressL = new BABYLON.Animation(
    "buttonPressL",
    "position.z",
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const buttonPressA = new BABYLON.Animation(
    "buttonPressL",
    "position.y",
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  const backSide = new BABYLON.Animation(
    "backSide",
    "position",
    60,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  let keyFramesB = [];

  const upSide = new BABYLON.Animation(
    "upSide",
    "position",
    60,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  let keyFramesU = [];

  const frontSide = new BABYLON.Animation(
    "frontSide",
    "position",
    60,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );

  let keyFramesF = [];

  scene.onBeforeRenderObservable.add(() => {
    keyFramesB = [];

    keyFramesB.push({
      frame: 0,
      value: new BABYLON.Vector3(
        camera.position.x,
        camera.position.y,
        camera.position.z
      ),
    });

    keyFramesB.push({
      frame: 60,
      value: new BABYLON.Vector3(
        0.17046631408004462,
        1.8326442885075471,
        -10.844923058628156
      ),
    });
    backSide.setKeys(keyFramesB);
    camera.animations.push(backSide);

    keyFramesU = [];

    keyFramesU.push({
      frame: 0,
      value: new BABYLON.Vector3(
        camera.position.x,
        camera.position.y,
        camera.position.z
      ),
    });

    keyFramesU.push({
      frame: 60,
      value: new BABYLON.Vector3(
        0.00952593205145582,
        9.915347920771115,
        4.762959675105227
      ),
    });
    upSide.setKeys(keyFramesU);
    camera.animations.push(upSide);

    keyFramesF = [];
    keyFramesF.push({
      frame: 0,
      value: new BABYLON.Vector3(
        camera.position.x,
        camera.position.y,
        camera.position.z
      ),
    });

    keyFramesF.push({
      frame: 60,
      value: new BABYLON.Vector3(
        -0.011843759771134445,
        -0.8585185708946625,
        10.966439968776717
      ),
    });

    frontSide.setKeys(keyFramesF);
    camera.animations.push(frontSide);
  });

  function updattePrice() {
    document.getElementById("addOn").children[1].textContent =
      addOnPrice + " $";
    document.getElementById("finalPrice").children[1].textContent =
      startingPrice + addOnPrice + " $";
  }

  // const myPath = [
  //   new BABYLON.Vector3(0, -2, 0.0),

  //   new BABYLON.Vector3(0, -2.01, 0),
  // ];

  // const tube = BABYLON.MeshBuilder.CreateTube(
  //   "tube",
  //   { path: myPath, radius: 3, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
  //   scene
  // );
  // const myPath1 = [
  //   new BABYLON.Vector3(0, -2, 0.0),

  //   new BABYLON.Vector3(0, -2.01, 0),
  // ];

  // const tube1 = BABYLON.MeshBuilder.CreateTube(
  //   "tube",
  //   {
  //     path: myPath1,
  //     radius: 2.5,
  //     sideOrientation: BABYLON.Mesh.DOUBLESIDE,
  //     arc: 1,
  //   },
  //   scene
  // );

  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "dzojstik2.glb",
    null,
    scene,
    (evt) => {
      let loadedPercent = 0;
      if (evt.lengthComputable) {
        loadedPercent = ((evt.loaded * 100) / evt.total).toFixed();
      } else {
        const dlCount = evt.loaded / (1024 * 1024);
        loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
      }
      document.getElementById(
        "loadingPercentages"
      ).innerHTML = `${loadedPercent}%`;
    }
  ).then((result) => {
    document.getElementsByClassName("loadingL")[0].className = "loadingLA";

    setTimeout(() => {
      interval = null;
      document.getElementById("customLoadingScreenDiv").style.display = "none";
    }, 1000);

    document.getElementById("customLoadingScreenDiv").className = "fade";

    result.meshes[2].material.ambientTexture = new BABYLON.Texture(
      "images/Joystick_Lightmap.png",
      scene
    );
    result.meshes[2].material.ambientTexture.uScale = 1;
    result.meshes[2].material.ambientTexture.vScale = -1;

    result.meshes[2].material.roughness = 0.4;
    result.meshes[3].material.roughness = 0.4;

    result.meshes[`${chosenPart}`].material.albedoTexture = null;
    result.meshes[`${chosenPart}`].material.albedoColor =
      new BABYLON.Color3.FromHexString(`#050505`);
    result.meshes[6].material.albedoColor = new BABYLON.Color3.FromHexString(
      `#050505`
    );

    let keyFramesBPL = [];
    keyFramesBPL.push({
      frame: 0,
      value: result.meshes[20].position.z,
    });

    keyFramesBPL.push({
      frame: 30,
      value: result.meshes[20].position.z - 0.2,
    });
    keyFramesBPL.push({
      frame: 60,
      value: result.meshes[20].position.z,
    });
    buttonPressL.setKeys(keyFramesBPL);

    let keyFramesBPA = [];
    keyFramesBPL.push({
      frame: 0,
      value: result.meshes[8].position.y,
    });

    keyFramesBPA.push({
      frame: 30,
      value: result.meshes[8].position.y + 0.03,
    });
    keyFramesBPA.push({
      frame: 60,
      value: result.meshes[8].position.y,
    });
    buttonPressA.setKeys(keyFramesBPA);

    result.meshes[0].scaling = new BABYLON.Vector3(40, 40, -40);

    result.meshes[42].material.clearCoat._isEnabled = true;
    result.meshes[42].material.clearCoat._indexOfRefraction = 2;

    result.meshes[42].material.clearCoat._useRoughnessFromMainTexture = false;
    result.meshes[42].material.roughness = 0;

    result.meshes[5].material.emissiveTexture = new BABYLON.Texture(
      "images/glow2.jpg",
      scene
    );

    document.getElementById("reset").addEventListener("click", function () {
      addOnPrice = 0;
      updattePrice();

      result.meshes[2].material.albedoColor = new BABYLON.Color3.FromHexString(
        `#050505`
      );
      result.meshes[2].material.albedoTexture = null;
      buttonLMatterial.albedoColor = new BABYLON.Color3.FromHexString(
        `#050505`
      );
      buttonRMatterial.albedoColor = new BABYLON.Color3.FromHexString(
        `#050505`
      );
      buttonMatterial.albedoColor = new BABYLON.Color3.FromHexString(`#050505`);
      sticksMaterial.albedoColor = new BABYLON.Color3.FromHexString(`#050505`);
      result.meshes[39].material.albedoColor = new BABYLON.Color3.FromHexString(
        `#050505`
      );

      result.meshes[11].material.albedoColor = new BABYLON.Color3.FromHexString(
        `#050505`
      );
      result.meshes[6].material.albedoColor = new BABYLON.Color3.FromHexString(
        `#050505`
      );
    });

    for (let i = 0; i < pattern.length; i++) {
      pattern[i].addEventListener("click", function () {
        chosenPattern = "images/" + this.id;
        result.meshes[2].material.albedoColor =
          new BABYLON.Color3.FromHexString("#cecece");
        result.meshes[2].material.albedoTexture = new BABYLON.Texture(
          chosenPattern,
          scene
        );
        addOnPrice = 5;
        updattePrice();
      });
    }

    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener("click", function () {
        chosenColor = this.id;
        if (chosenPart == 32) {
          buttonMatterial.albedoColor = new BABYLON.Color3.FromHexString(
            `${chosenColor}`
          );
          result.meshes[32].material = buttonMatterial;
          result.meshes[44].material = buttonMatterial;
        } else if (chosenPart == 36) {
          sticksMaterial.albedoColor = new BABYLON.Color3.FromHexString(
            `${chosenColor}`
          );
          result.meshes[36].material = sticksMaterial;
          result.meshes[38].material = sticksMaterial;
          result.meshes[39].material.albedoColor =
            new BABYLON.Color3.FromHexString(`${chosenColor}`);
        } else if (chosenPart == 43) {
          buttonRMatterial.albedoColor = new BABYLON.Color3.FromHexString(
            `${chosenColor}`
          );
          result.meshes[43].material = buttonRMatterial;
        } else if (chosenPart == 11) {
          result.meshes[11].material.albedoColor =
            new BABYLON.Color3.FromHexString(`${chosenColor}`);
        } else if (chosenPart == 33) {
          buttonLMatterial.albedoColor = new BABYLON.Color3.FromHexString(
            `${chosenColor}`
          );
          result.meshes[33].material = buttonLMatterial;
        } else {
          result.meshes[`${chosenPart}`].material.albedoColor =
            new BABYLON.Color3.FromHexString(`${chosenColor}`);

          result.meshes[`${chosenPart}`].material.albedoTexture = null;
          addOnPrice = 0;
          if (chosenPart == 2) {
            updattePrice();
          }
        }

        if (chosenPart == 16) {
          result.meshes[`${chosenPart}`].material.emissiveColor =
            new BABYLON.Color3.FromHexString(`${chosenColor}`);
        }
      });
    }
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].id == chosenPart) {
        parts[i].style.backgroundColor =
          "rgb(" + 33 + "," + 36 + "," + 38 + ")";

        document.getElementById("side").style.zIndex = 100;
      } else {
        parts[i].style.backgroundColor =
          "rgb(" + 44 + "," + 48 + "," + 51 + ")";
      }
      parts[i].addEventListener("click", function () {
        var id = window.setTimeout(function () {}, 0);

        while (id--) {
          window.clearTimeout(id);
        }

        chosenPart = this.id;
        if (chosenPart == 2) {
          document.getElementById("patternBlock").style.display = "flex";
          document.getElementById("patternTitle").style.display = "flex";
        } else {
          document.getElementById("patternBlock").style.display = "none";
          document.getElementById("patternTitle").style.display = "none";
        }

        document.getElementById("side").children[0].textContent =
          document.getElementById(chosenPart).children[0].alt;

        if (chosenPart == 6) {
          scene.beginDirectAnimation(camera, [backSide], 0, 60, false);
          setTimeout(() => {
            scene.stopAnimation(camera);
          }, 1000);
        } else if (chosenPart == 32 || chosenPart == 43) {
          scene.beginDirectAnimation(camera, [upSide], 0, 60, false);
          setTimeout(() => {
            scene.stopAnimation(camera);
          }, 1000);
        } else {
          scene.beginDirectAnimation(camera, [frontSide], 0, 60, false);
          setTimeout(() => {
            scene.stopAnimation(camera);
          }, 1000);
        }
        focusPart();
      });
    }
  });

  // BABYLON.SceneLoader.ImportMesh(
  //   "",
  //   "",
  //   "dzojstik2.glb",
  //   scene,
  //   (meshes, particleSystem, skeleton, animationGroups) => {

  // );

  return scene;
};
window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene;
});

window.addEventListener("resize", function () {
  engine.resize();
});
