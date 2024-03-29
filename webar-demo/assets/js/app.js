!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(require("three"))
    : "function" == typeof define && define.amd
    ? define(["three"], t)
    : t(e.THREE);
})(this, function (e) {
  "use strict";
  class t {
    static request(e, t, i = null) {
      return new Promise((s, n) => {
        const o = new XMLHttpRequest();
        (o.onload = () => {
          try {
            const e = JSON.parse(o.responseText);
            200 === o.status ? s(e) : n(e);
          } catch (e) {
            n(e);
          }
        }),
          (o.onerror = (e) => {
            n(e);
          }),
          o.open(e, t),
          i
            ? (o.setRequestHeader(
                "Content-Type",
                "application/json;Charset=UTF-8"
              ),
              o.send("string" == typeof i ? i : JSON.stringify(i)))
            : o.send();
      });
    }
    static post(e, i) {
      return t.request("POST", e, i);
    }
    static get(e) {
      return t.request("GET", e);
    }
  }
  class i {
    constructor(e, t) {
      (this.interval = 1e3),
        (this.recognizeUrl = ""),
        (this.videoSetting = { width: 320, height: 240 }),
        (this.videoElement = null),
        (this.videoDeviceElement = null),
        (this.canvasElement = null),
        (this.canvasContext = null),
        (this.timer = null),
        (this.isRecognizing = !1),
        (this.interval = e),
        (this.recognizeUrl = t);
    }
    listCamera(e) {
      return (
        (this.videoDeviceElement = e),
        new Promise((e, t) => {
          navigator.mediaDevices
            .enumerateDevices()
            .then((i) => {
              i.map((e) => {
                if ("videoinput" === e.kind) {
                  const t = document.createElement("option");
                  (t.text =
                    e.label ||
                    "camera " +
                      (this.videoDeviceElement.length + 1).toString()),
                    (t.value = e.deviceId),
                    this.videoDeviceElement.appendChild(t);
                }
              }),
                0 === this.videoDeviceElement.length
                  ? t("没有摄像头")
                  : ((this.videoDeviceElement.style.display = "inline-block"),
                    (this.canvasElement = document.createElement("canvas")),
                    (this.canvasContext = this.canvasElement.getContext("2d")),
                    e(!0));
            })
            .catch((e) => {
              t(e);
            });
        })
      );
    }
    openCamera(e, t) {
      let i;
      return (
        (this.videoElement = e),
        (i =
          "" != t
            ? { audio: !1, video: { deviceId: { exact: t } } }
            : { audio: !1, video: { facingMode: { exact: "environment" } } }),
        this.videoElement.srcObject &&
          this.videoElement.srcObject.getTracks().forEach((e) => {
            e.stop();
          }),
        new Promise((e, t) => {
          navigator.mediaDevices
            .getUserMedia(i)
            .then((i) => {
              (this.videoElement.style.display = "block"),
                (this.videoElement.srcObject = i),
                (this.videoElement.onloadedmetadata = () => {
                  (this.videoSetting = {
                    width: this.videoElement.offsetWidth,
                    height: this.videoElement.offsetHeight,
                  }),
                    this.canvasElement.setAttribute(
                      "width",
                      this.videoSetting.width + "px"
                    ),
                    this.canvasElement.setAttribute(
                      "height",
                      this.videoSetting.height + "px"
                    ),
                    window.innerWidth < window.innerHeight
                      ? this.videoElement.offsetHeight < window.innerHeight &&
                        this.videoElement.setAttribute(
                          "height",
                          window.innerHeight.toString() + "px"
                        )
                      : this.videoElement.offsetWidth < window.innerWidth &&
                        this.videoElement.setAttribute(
                          "width",
                          window.innerWidth.toString() + "px"
                        ),
                    e(!0);
                });
              const s = this.videoElement.play();
              s &&
                s
                  .then((e) => {})
                  .catch((e) => {
                    t(e);
                  });
            })
            .catch((e) => {
              t(e);
            });
        })
      );
    }
    captureVideo() {
      return (
        this.canvasContext.drawImage(
          this.videoElement,
          0,
          0,
          this.videoSetting.width,
          this.videoSetting.height
        ),
        this.canvasElement.toDataURL("image/jpeg", 0.5).split("base64,")[1]
      );
    }
    startRecognize(e) {
      this.timer = window.setInterval(() => {
        if (this.isRecognizing) return;
        this.isRecognizing = !0;
        const t = { image: this.captureVideo() };
        this.httpPost(this.recognizeUrl, t)
          .then((t) => {
            this.stopRecognize(), e(t);
          })
          .catch((e) => {
            this.isRecognizing = !1;
          });
      }, this.interval);
    }
    stopRecognize() {
      this.timer &&
        (window.clearInterval(this.timer), (this.isRecognizing = !1));
    }
    httpPost(e, t) {
      return new Promise((i, s) => {
        const n = new XMLHttpRequest();
        (n.onload = () => {
          try {
            const e = JSON.parse(n.responseText);
            200 === n.status && 0 === e.statusCode ? i(e.result) : s(e);
          } catch (e) {
            s(e);
          }
        }),
          (n.onerror = (e) => {
            s(e);
          }),
          n.open("POST", e),
          n.setRequestHeader("Content-Type", "application/json;Charset=UTF-8"),
          n.send(JSON.stringify(t));
      });
    }
  }
  class s {
    static isIos() {
      return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    }
    static isWeiXin() {
      return /micromessenger/.test(navigator.userAgent.toLowerCase());
    }
    static isMiniprogram() {
      return (
        /miniprogram/.test(navigator.userAgent.toLowerCase()) ||
        "miniprogram" === window.__wxjs_environment
      );
    }
    static $(e) {
      return document.querySelector(e);
    }
    static $show(e) {
      s.$(e).style.display = "block";
    }
    static $hide(e) {
      s.$(e).style.display = "none";
    }
    static $value(e) {
      return s.$(e).value.trim();
    }
    static $remove(e) {
      document.body.removeChild(s.$(e));
    }
    static isMobile(e) {
      return /^1[345789][0-9]{9}$/.test(e);
    }
    static reload() {
      s.isWeiXin()
        ? (window.location.href =
            window.location.href.split("?")[0] +
            "?t=" +
            new Date().getTime().toString())
        : window.location.reload();
    }
  }
  class n {
    constructor(e, t, i) {
      (this.shareIcon = ""),
        (this.shareDesc = ""),
        (this.shareIcon = t),
        (this.shareDesc = i);
      const s = document.createElement("script");
      (s.src = "https://res.wx.qq.com/open/js/jweixin-1.3.2.js"),
        (s.onload = (t) => {
          this.init(e);
        }),
        document.body.appendChild(s);
    }
    init(e) {
      t.get(e + "?url=" + window.location.href)
        .then((e) => {
          this.initShare(e);
        })
        .catch((e) => {
          console.info(JSON.stringify(e));
        });
    }
    initShare(e) {
      wx.config({
        debug: !1,
        appId: e.app_key,
        timestamp: e.timestamp,
        nonceStr: e.nonce_str,
        signature: e.signature,
        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"],
      }),
        wx.ready((e) => {
          const t = {
            title: document.title,
            desc: this.shareDesc,
            link: window.location.href.split("?")[0],
            imgUrl: this.shareIcon,
            success: (e) => {
              this.shareSuccess(e);
            },
            cancel: (e) => {},
          };
          wx.onMenuShareTimeline(t), wx.onMenuShareAppMessage(t);
        }),
        wx.error((e) => {
          console.info("wx.error"), console.info(JSON.stringify(e));
        });
    }
  }
  class o {
    constructor() {
      (this.mixers = []),
        (this.scene = new e.Scene()),
        this.scene.add(new e.AmbientLight(16777215)),
        (this.camera = new e.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          0.1,
          1e3
        )),
        (this.renderer = new e.WebGLRenderer({ antialias: !0, alpha: !0 })),
        this.renderer.setSize(window.innerWidth, window.innerHeight),
        this.renderer.domElement.setAttribute("class", "mainCanvas"),
        document
          .querySelector("#pagePreview")
          .appendChild(this.renderer.domElement),
        (this.control = new e.OrbitControls(
          this.camera,
          this.renderer.domElement
        )),
        (this.clock = new e.Clock()),
        this.render(),
        window.addEventListener(
          "resize",
          () => {
            (this.camera.aspect = window.innerWidth / window.innerHeight),
              this.camera.updateProjectionMatrix(),
              this.renderer.setSize(window.innerWidth, window.innerHeight);
          },
          !1
        );
    }
    render() {
      this.control.update(), this.renderer.render(this.scene, this.camera);
      for (const e of this.mixers) e.update(this.clock.getDelta());
      window.requestAnimationFrame(() => {
        this.render();
      });
    }
    resetModel() {
      this.camera.position.set(
        this.setting.cameraPosition[0],
        this.setting.cameraPosition[1],
        this.setting.cameraPosition[2]
      ),
        this.camera.lookAt(
          new e.Vector3(
            this.setting.position[0],
            this.setting.position[1],
            this.setting.position[2]
          )
        ),
        this.model.position.set(
          this.setting.position[0],
          this.setting.position[1],
          this.setting.position[2]
        ),
        this.model.scale.setScalar(this.setting.scale);
    }
    loadModel(t, i, s, n) {
      this.setting = i;
      const o = new e.SpotLight(16777215, 0.2);
      o.position.set(
        i.lightPosition[0],
        i.lightPosition[1],
        i.lightPosition[2]
      ),
        (o.castShadow = !0),
        this.scene.add(o),
        this.camera.position.set(
          i.cameraPosition[0],
          i.cameraPosition[1],
          i.cameraPosition[2]
        ),
        this.camera.lookAt(
          new e.Vector3(i.position[0], i.position[1], i.position[2])
        ),
        new e.FBXLoader().load(
          i.model,
          (t) => {
            if (
              ((this.model = t),
              t.scale.setScalar(i.scale),
              t.position.set(i.position[0], i.position[1], i.position[2]),
              this.scene.add(t),
              t.animations.length > 0)
            ) {
              (t.mixer = new e.AnimationMixer(t)), this.mixers.push(t.mixer);
              const s = t.mixer.clipAction(t.animations[0]);
              if ((s.play(), !i.isLoop)) {
                s.loop = e.LoopOnce;
                const t = window.setInterval(() => {
                  s.isRunning() || (window.clearInterval(t), n());
                }, 500);
              }
            }
            s();
          },
          (e) => {
            t(e);
          },
          (e) => {
            console.info(e);
          }
        );
    }
  }
  new (class {
    constructor() {
      (this.apiHost = "/api/webar01/"),
        (this.isTurntableRunning = !1),
        (this.userId = ""),
        (this.video = document.querySelector("#video")),
        (this.isMiniprogram = !1),
        (this.webAr = new i(
          1e3,
          "https://webar.easyar.com/webar/recognize.php"
        )),
        this.checkWx(),
        this.pageFirst();
    }
    checkWx() {
      s.isWeiXin()
        ? ((this.isMiniprogram = s.isMiniprogram()),
          this.isMiniprogram
            ? this.openCamera(!0)
            : (s.$show("#pageFirst"),
              s.isIos() &&
                (s.$show("#pageWxIos"),
                s.$("#pageWxIos").addEventListener(
                  "click",
                  () => {
                    s.$hide("#pageWxIos");
                  },
                  !1
                )),
              (new n(
                "wx.php",
                "http://sightppp.oss-cn-shanghai.aliyuncs.com/webar/share.jpg",
                "只需要浏览器，即可体验酷炫AR,快来试试吧~"
              ).shareSuccess = (e) => {}),
              s.$show("#pageFirst")))
        : s.$show("#pageFirst");
    }
    toPage(e) {
      const t = document.querySelectorAll(".page");
      for (const e of t) e.style.display = "none";
      s.$show("#" + e);
    }
    startTurnTable() {
      this.isTurntableRunning ||
        (s.$hide("#lotteryFail"),
        this.btnTurntableArrow.setAttribute("style", ""),
        t
          .get(this.apiHost + "lottery")
          .then((e) => {
            const t = e.lottery.degree + 7200;
            (this.userId = e.userId),
              window.setTimeout(() => {
                this.btnTurntableArrow.setAttribute(
                  "style",
                  "transition: transform 5s;transform: rotate(" +
                    t.toString() +
                    "deg)"
                ),
                  (this.isTurntableRunning = !0),
                  window.setTimeout(() => {
                    216 != e.lottery.degree
                      ? s.$show("#lotterySuccess")
                      : s.$show("#lotteryFail");
                  }, 5e3);
              }, 1);
          })
          .catch((e) => {
            alert("网络错误，请稍后重试。");
          }));
    }
    pageFirst() {
      s.$("#btnScan").addEventListener(
        "click",
        () => {
          this.toPage("pageScan"), this.openCamera(!1);
        },
        !1
      ),
        s.$("#btnDirect").addEventListener(
          "click",
          () => {
            this.openCamera(!0);
          },
          !1
        );
    }
    openCamera(e) {
      document.body.style.backgroundColor = "#000000";
      const t = document.createElement("select");
      this.webAr
        .listCamera(t)
        .then((i) => {
          let n = t[0].value;
          !s.isIos() && t.length > 1 && (n = t[t.length - 1].value),
            this.webAr
              .openCamera(this.video, n)
              .then((t) => {
                e
                  ? this.loadPackage()
                  : (this.toPage("pageScan"),
                    this.webAr.startRecognize((e) => {
                      this.loadPackage(JSON.parse(window.atob(e.meta)));
                    }));
              })
              .catch((t) => {
                this.removeVideo(),
                  e
                    ? this.loadPackage()
                    : (alert("打开摄像头失败，请点击“立即体验”。"),
                      this.toPage("pageFirst"));
              });
        })
        .catch((t) => {
          console.info(t),
            this.removeVideo(),
            e
              ? this.loadPackage()
              : (alert("打开摄像头失败，请点击“立即体验”。"),
                this.toPage("pageFirst"));
        });
    }
    removeVideo() {
      document.body.removeChild(this.video);
    }
    updateProgress(e) {
      document.querySelector("#progress");
      const t = (e.loaded / e.total) * 100;
      (s.$("#loadingPercent").innerHTML =
        t < 100 ? t.toFixed(1) + "%" : "100%"),
        t >= 100 &&
          window.setTimeout(() => {
            document.body.removeChild(s.$("#pageLoading")),
              s.$show("#pagePreview");
          }, 10);
    }
    loadPackage(e = null) {
      e ||
        (e = {
          model:
            "https://staticfile-cdn.sightp.com/easyar/webar/xiaoxiongmao.fbx",
          scale: 0.13,
          isLoop: !0,
          position: [0, -7, 0],
          cameraPosition: [0, 15, 50],
          lightPosition: [5, 55, 10],
        }),
        this.toPage("pageLoading");
      const t = new o();
      t.loadModel(
        this.updateProgress,
        e,
        () => {},
        () => {
          console.info("finished");
        }
      ),
        s.$("#btnOrigin").addEventListener(
          "click",
          () => {
            t.resetModel();
          },
          !1
        );
    }
    toMiniPage(e = "") {
      wx.miniProgram.navigateBack({ delta: 2 });
    }
  })();
});
