(function (exportName) {

    var $ = function (dom, options) {
        //默认配置
        var defaultOptions = {
            width: 200,
            height: 200,
            background: 'rgba(0,0,0,.5)',
            initScale: 1,
        }

        //整合自定义配置
        this.options = extend(options, defaultOptions || {});
        //获取图像Dom
        this.img = this.options.img;
        //获取容器Dom
        this.dom = dom;

        this.init().bindEvt();
    }

    $.prototype = {
        /**
         * @description 设置图像位置以及初始尺寸
         * @returns {$} 返回this（$）
         */
        init: function () {
            var _this = this;

            this.screenWidth = document.body.clientWidth;
            this.screenHeight = document.body.clientHeight;

            this.windowOffsetTop = (_this.screenHeight - _this.options.height) / 2;
            this.windowOffsetLeft = (_this.screenWidth - _this.options.width) / 2;

            var cacheImg = document.createElement('img');
            cacheImg.src = _this.img.src;
            cacheImg.style.opacity = 0;

            cacheImg.onload = function () {

                _this.picInitWidth = cacheImg.offsetWidth;
                _this.picInitHeight = cacheImg.offsetHeight;
                _this.initWH = {
                    width: cacheImg.offsetWidth,
                    height: cacheImg.offsetHeight,
                    scale: 1,
                };

                _this.img.style.transformOrigin = 0.5 * _this.initWH.scale + ' ' + 0.5 * _this.initWH.scale

                if (_this.picInitWidth / _this.picInitHeight > _this.screenWidth / _this.screenHeight) {

                    _this.initWH.scale = _this.screenWidth / _this.initWH.width;
                    _this.currentScale = 1;
                    _this.currentX = 0;
                    _this.currentY = 0;

                    _this.img.setAttribute('style', 'left: 0;' +
                        '            position: absolute;' +
                        '            -moz-transform-origin: ' + 0.5 / _this.initWH.scale + ' ' + 0.5 / _this.initWH.scale + ';' +
                        '            -ms-transform-origin: ' + 0.5 / _this.initWH.scale + ' ' + 0.5 / _this.initWH.scale + ';' +
                        '            -o-transform-origin: ' + 0.5 / _this.initWH.scale + ' ' + 0.5 / _this.initWH.scale + ';' +
                        '            transform-origin: ' + 0.5 / _this.initWH.scale + ' ' + 0.5 / _this.initWH.scale + ';' +
                        '            top: ' + (_this.screenHeight - _this.initWH.height * _this.initWH.scale) / 2 + 'px;' +
                        '            width:100%');
                } else {

                    _this.initWH.scale = _this.screenHeight / _this.initWH.height;

                    _this.img.setAttribute('style', '-webkit-transform: translateY(-50%);' +
                        '            -moz-transform-origin: ' + 0.5 / _this.initWH.scale + ' ' + 0.5 / _this.initWH.scale + ';' +
                        '            -ms-transform-origin: ' + 0.5 / _this.initWH.scale + ' ' + 0.5 / _this.initWH.scale + ';' +
                        '            -o-transform-origin: ' + 0.5 / _this.initWH.scale + ' ' + 0.5 / _this.initWH.scale + ';' +
                        '            transform-origin: ' + 0.5 / _this.initWH.scale + ' ' + 0.5 / _this.initWH.scale + ';' +
                        '            position: absolute;' +
                        '            left: ' + (_this.screenWidth - _this.initWH.width * _this.initWH.scale) + 'px;' +
                        '            top: 0;' +
                        '            height:100%');
                }

                _this.initWH.initWidth = _this.initWH.width * _this.initWH.scale;
                _this.initWH.initHeight = _this.initWH.height * _this.initWH.scale;
                _this.initLeft = _this.img.offsetLeft;
                _this.initTop = _this.img.offsetTop;
                _this.initWidth = _this.img.offsetWidth;
                _this.initHeight = _this.img.offsetHeight;


                var topMask = document.getElementById('topMask');
                var leftMask = document.getElementById('leftMask');
                var rightMask = document.getElementById('rightMask');
                var bottomMask = document.getElementById('bottomMask');
                topMask.setAttribute('style', 'height:' + _this.windowOffsetTop + 'px');
                bottomMask.setAttribute('style', 'height:' + _this.windowOffsetTop + 'px');
                leftMask.setAttribute('style', 'width:' + _this.windowOffsetLeft + 'px;top:' + _this.windowOffsetTop + 'px');
                rightMask.setAttribute('style', 'width:' + _this.windowOffsetLeft + 'px;top:' + _this.windowOffsetTop + 'px');

                document.body.removeChild(cacheImg);
                cacheImg = undefined;

                _this.initScale();
            }

            document.body.appendChild(cacheImg);

            document.body.addEventListener('touchmove', function (e) {
                e.preventDefault();
            });


            return this;
        },
        /**
         * @description 设置初始缩放比例
         */
        initScale: function () {
            this.img.style.transform = 'scale(' + this.currentScale * this.options.initScale + ')';
            this.scaleTo(this.options.initScale);
        },
        /**
         * @description 绑定滑动缩放事件
         */
        bindEvt: function () {
            var _this = this;

            this.HM = new Hammer(document.getElementById('touchMask'));
            this.HM.add(new Hammer.Pinch());

            //移动
            this.HM.on("panmove", function (e) {
                _this.img.style.left = _this.initLeft + e.deltaX + "px";
                _this.img.style.top = _this.initTop + e.deltaY + "px";
            });
            this.HM.on("panend", function (e) {
                _this.moveTo(e.deltaX, e.deltaY);
            });


            //缩放
            this.HM.on("pinchin", function (e) {
                document.getElementById('test-content').innerText = parseFloat(_this.currentScale * e.scale).toFixed(2) + '';
                _this.img.style.transform = 'scale(' + _this.currentScale * e.scale + ')';
            });
            this.HM.on("pinchout", function (e) {
                _this.img.style.transform = 'scale(' + _this.currentScale * e.scale + ')';
                document.getElementById('test-content').innerText = parseFloat(_this.currentScale * e.scale).toFixed(2) + '';
            });
            this.HM.on("pinchend", function (e) {
                setTimeout(function () {
                    _this.scaleTo(e.scale);
                }, 200)
            })
        },
        /**
         * @description 移动Img
         * @param x X轴距离
         * @param y Y轴距离
         */
        moveTo: function (x, y) {
            this.initLeft = this.img.offsetLeft;
            this.initTop = this.img.offsetTop;
            this.currentX += x;
            this.currentY += y;
        },
        /**
         * @description 缩放Imag
         * @param scale 缩放比例
         */
        scaleTo: function (scale) {
            this.currentScale *= scale;
        },
        /**
         * @description 获取裁剪结果（Canvas）
         * @returns {Element} 返回内容为裁剪结果的Canvas
         */
        getResult: function () {
            var resultCanvas = document.getElementById('resultCanvas');

            var scale = this.currentScale * this.initWH.scale;
            var clipWidth = this.options.width / scale;
            var clipHeight = this.options.height / scale;

            var centerX = this.initWH.width / 2;
            var centerY = this.initWH.height / 2;

            var newCenterX = centerX - this.currentX / scale;
            var newCenterY = centerY - this.currentY / scale;

            var LTY = newCenterY - clipHeight / 2;
            var LTX = newCenterX - clipWidth / 2;

            resultCanvas.getContext('2d').drawImage(this.img, LTX, LTY, clipWidth, clipHeight, 0, 0, this.options.width, this.options.height);

            return resultCanvas
        }
    };

    function extend(pre, nxt) {
        for (var i in pre) {
            if (pre.hasOwnProperty(i)) {
                nxt[i] = pre[i];
            }
        }
        return nxt;
    }

    window[exportName] = function (dom, options) {
        return new $(dom, options);
    }

})('clipper');