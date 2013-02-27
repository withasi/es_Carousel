/**
 * es.base.js类库说明:
 * 1)此类库为平时收集，针对此组件，并进行相应的修剪；
 * 2)主要包含的功能：类定义方式、命名空间定义方法、事件管理器、自定义事件管理器、外部js和css引入等基础功能；
 * 3)有两个全局变量：es和e$,其中es.e$==e$,如果es命名空间冲突，可调用es.onConflict
 */
;(function(){
    /**
     * es为顶级包名
     *
     * @namespace
     * @name es
     * @public
     */
    var es = {
        VERSION:"1.0.1",
        /**
         * @description 主脚本运行路径
         * @return {String}
         * @field
         * @public
         */
        PATH : (function () {
            var scriptName = "es.base.js";// 此脚本的名称
            var scriptLocation = "";
            var isOL = new RegExp("(^|(.*?\\/))(" +scriptName + ")(\\?|$)");
            var scripts = document.getElementsByTagName('script');
            for (var i=0, len=scripts.length; i<len; i++) {
                var src = scripts[i].getAttribute('src');
                if (src) {
                    var match = src.match(isOL);
                    if(match) {
                        scriptLocation = match[1];
                        break;
                    }
                }
            }
            return scriptLocation;
        }()),

        /**
         * @description 获得一个命名空间
         * @param {String} space 命名空间符符串。如果命名空间不存在，则自动创建。
         * @param {Object} root  命名空间的起点。当没传root时：如果space以“.”打头，则是默认为es为根，否则默认为window<br/>
         * 参数可以省略
         * @return {Object} 返回命名空间对应的对象
         * @public
         */
        namespace: function(space, root) {
            var arr = space.split('.'),i = 0,nameI;
            if (space.indexOf('.') == 0) {
                i = 1;
                root = root || es;
            }
            root = root || window;
            for (; nameI = arr[i++];) {
                if (!root[nameI]) {
                    root[nameI] = {};
                }
                root = root[nameI];
            }
            return root;
        },
        /**
         * extend
         */
        /**
         * @description：将destination扩展source
         * @param destination
         *            {object} 目标对象
         * @param source
         *            {object} 源对象
         * @param override
         *            {String} 重复内容是否强制覆盖
         * @return {Void}
         * @public
         */
        extend: function (destination, source, override) {
            if (override === undefined) override = true;
            for (var property in source) {
                if (override || !(property in destination)) {
                    destination[property] = source[property];
                }
            }
            return destination;
        },
        /**
         * deepextend
         */
        /**
         * @description：destination深度复制source
         * @param destination
         *            {object} 目标对象
         * @param source
         *            {object} 源对象
         * @return {Void}
         * @public
         */
        deepextend: function (destination, source) {
            for (var property in source) {
                var copy = source[property];
                if ( destination === copy ) continue;
                if ( typeof copy === "object" ){
                    destination[property] = arguments.callee( destination[property] || {}, copy );
                }else{
                    destination[property] = copy;
                }
            }
            return destination;
        },

        /**
         * @description 解决window.es冲突问题,还原可能被抢用的window.es变量
         * @param {Boolean} isExclusive 是否强制侵占es这个全局变量，省略时，指非独占性es命名空间<br/>
         * 参数省略：可以省略
         * @return {Object} 返回es命名空间
         * @public
         */
        noConflict: (function(isExclusive) {
            var previous = window.es;
            return function() {
                window.es = previous;
                return es;
            }
        }())
    };
    window.es = es;
}());
/**
 * ***********************************************************************************************
 * 2.[一些touch设备的全局变量约定。包括部分在window对象住的全局弥补和设定，针对andorid2.3，ios5及其以下版本的一些设置，未来以下设置可能无效]
 * ***********************************************************************************************
 */
(function(e){
    //***************1)判定动画api,关于requestAnimationFrame，可参照http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);//1000/60根据firefox中的定义，大约是30fps
            }
    })(),
        window.cancelRequestAnimationFrame = (function () {
            return window.cancelRequestAnimationFrame
                || window.webkitCancelAnimationFrame
                || window.webkitCancelRequestAnimationFrame
                || window.mozCancelRequestAnimationFrame
                || window.oCancelRequestAnimationFrame
                || window.msCancelRequestAnimationFrame
                || clearTimeout
        })();

    //***************2)一些touch公用变量
    var vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'Moz' :'opera' in window ? 'O' : '',//内核供应商

    //设备判断是andorid还是ios设备
        isAndroid = (/android/gi).test(navigator.appVersion),//android设备
        isIPhone = /iphone/gi.test(navigator.appVersion),//iphone设备
        isIPhone4 = window.devicePixelRatio >= 2,//iphone4设备
        isIPad = /ipad/gi.test(navigator.appVersion),//ipad设备
        isIDevice = isIPhone  || isIPad,//ios设备

    //是否具有相关效果，均针对目前浏览器内核和touch内核的版本
        has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
    //has3d = false,
        trnOpen = 'translate' + (has3d ? '3d(' : '('),//如果css中支持translate3d，则使用
        trnClose = has3d ? ',0)' : ')',
        hasTouch = 'ontouchstart' in window,
        hasTransform = vendor + 'Transform' in document.documentElement.style,
        hasTransitionEnd = true,//如果是ios系统，则可以使用css3的动画效果,因为ios对css3进行硬件加速，android均采用requestAnimationFrame?
    //在2.2及其以上版本机器中  requestAnimationFrame造成卡顿，还不如css3的动画

    //touch事件判定，
        RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
        WHEEL_EV = vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel',
        TOUCH_EV = hasTouch ? "touchend" : "click",
        HOVERIN_EV = 'hoverin',//自定义的hoverin事件，用于手指触摸上
        HOVEROUT_EV = 'hoverout';//自定义的hoverout事件，用于手指触摸上



    //定义es关于touch设备的一些全局判断
    e.vendor = vendor,
        e.isAndroid = isAndroid,
        e.isIPhone = isIPhone,
        e.isIPhone4 = isIPhone4,
        e.isIPad = isIPad,
        e.isIDevice = isIDevice,

        //设备特性判断，只针对当前版本的touch设备
        e.has3d = has3d,
        e.trnOpen = trnOpen,
        e.trnClose = trnClose,
        e.hasTouch = hasTouch,
        e.hasTransform = hasTransform,
        e.hasTransitionEnd = hasTransitionEnd,

        //touch事件判定，
        e.RESIZE_EV = RESIZE_EV,
        e.START_EV = START_EV,
        e.MOVE_EV = MOVE_EV,
        e.END_EV = END_EV,
        e.CANCEL_EV = CANCEL_EV,
        e.WHEEL_EV = WHEEL_EV,
        e.TOUCH_EV = TOUCH_EV,
        e.HOVERIN_EV = HOVERIN_EV,
        e.HOVEROUT_EV = HOVEROUT_EV;

}(es));
/**
 * ***********************************************************************************************
 * 3.[对象说明：定义es.Class
 * ***********************************************************************************************
 */
(function(e) {
    /**
     * Class
     */
    /**
     * 类创建方法：
     * Class1 = es.Class({
	  *  initialize : function(p1){
	  *   this._p1 = p1 || 2;
	  *  },
	  *  _p1:null,
	  *  showP1 : function(){
	  *   alert(this._p1);
	  *  },
	  *  CLASS_NAME : "Class1"
	  * });
     *
     * Class2 继承Class1
     * Class2 = es.Class(Class1, {
	  *  initialize : function(p21,p22){
	  *   this._p21 = p21 || 22;
	  *   this._p22 = p22 || 23;
	  *   Class1.prototype.initialize.apply(this, [this._p21]);
	  *  },
	  *  _p21:null,
	  *  _p22:null,
	  *  CLASS_NAME : "Class2"
	  * });
     *
     *
     * 示例：
     * var o1 = new Class1(1);
     * o1.showP1();
     * var o2 = new Class2(1,2);
     * o2.showP1();
     */
    var extend = e.extend;
    var Class = function() {
        var Class = function() {
            if (arguments && arguments[0] != e.Class.isPrototype) {
                this.initialize.apply(this, arguments);
            }
        };
        var extended = {};
        var parent, initialize;
        for (var i = 0,
                 len = arguments.length; i < len; ++i) {
            if (typeof arguments[i] == "function") {
                if (i == 0 && len > 1) {
                    initialize = arguments[i].prototype.initialize;
                    arguments[i].prototype.initialize = function() {};
                    extended = new arguments[i];
                    if (initialize === undefined) {
                        delete arguments[i].prototype.initialize;
                    } else {
                        arguments[i].prototype.initialize = initialize;
                    }
                }
                parent = arguments[i].prototype;
            } else {
                parent = arguments[i];
            }
            extend(extended, parent);
        }
        Class.prototype = extended;
        return Class;
    };
    Class.isPrototype = function() {};
    Class.create = function() {
        return function() {
            if (arguments && arguments[0] != e.Class.isPrototype) {
                this.initialize.apply(this, arguments);
            }
        };
    };
    Class.inherit = function() {
        var superClass = arguments[0];
        var proto = new superClass(e.Class.isPrototype);
        for (var i = 1,
                 len = arguments.length; i < len; i++) {
            if (typeof arguments[i] == "function") {
                var mixin = arguments[i];
                arguments[i] = new mixin(es.Class.isPrototype);
            }
            extend(proto, arguments[i]);
        }
        return proto;
    };

    function dateFormat(date, format){
        var o = {
            "M+" : date.getMonth()+1, //month
            "d+" : date.getDate(),    //day
            "h+" : date.getHours(),   //hour
            "m+" : date.getMinutes(), //minute
            "s+" : date.getSeconds(), //second
            "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
            "S" : date.getMilliseconds() //millisecond
        }
        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
            (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length==1 ? o[k] :
                    ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    }

    e.Class = Class,e.dateFormat = dateFormat;
}(es));

/**
 * ***********************************************************************************************
 * 4.[在当前document中引入配置的js和css,通过document.write("<script...")方式引入，由于脚本加载的异步性，目前暂时没有考虑到脚本依赖和加载顺序，以后可参照seajs等,进行脚本加载同步化优化]
 * ***********************************************************************************************
 */
(function(e){
    /*********************************start*********************************/
    /**
     * 配置此数组，将数组中的脚本引入到页面当中
     */
    var jsfiles = [
            //"es.touchevent.js",//用hammer开源类库来替换touchevent
            "es.hammer.js",
            "es.carousel.js"
        ],
        /**
         *  配置此数组，将数组中的样式表引入到页面当中
         */
            cssfiles = [
            "assets/carousel.css"//放入主页面中，因为es.base_path.js为合并了的脚本，但是css目前没有合并就一个，未来如果css较多，也进行合并

        ];

    if(e.isAndroid)jsfiles.unshift("es.pg_android.js");
    else if(es.isIDevice)jsfiles.unshift("es.pg_ios.js") ;
    /*********************************end*********************************/
    var agent = navigator.userAgent;
    var docWrite = (agent.match("MSIE") || agent.match("Safari"));
    if(docWrite) {
        var allScriptTags = new Array(jsfiles.length);
        var allCSSTags = new Array(cssfiles.length);
    }
    var host = e.PATH;
    for (var i=0, len=jsfiles.length; i<len; i++) {
        if (docWrite) {
            allScriptTags[i] = "<script type='text/javascript' src='" + host + jsfiles[i] +
                "'></script>";
        } else {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = host + jsfiles[i];
            var h = document.getElementsByTagName("head").length ?
                document.getElementsByTagName("head")[0] :
                document.body;
            h.appendChild(s);
        }
    }
    for (var i=0, len=cssfiles.length; i<len; i++) {
        if (docWrite) {
            allCSSTags[i] = "<link  type='text/css' rel='stylesheet' href='" + host + cssfiles[i] +
                "'/>";
        } else {
            var s = document.createElement("link");
            s.type = "text/css";
            s.rel="stylesheet"
            s.src = host + jsfiles[i];
            var h = document.getElementsByTagName("head").length ?
                document.getElementsByTagName("head")[0] :
                document.body;
            h.appendChild(s);
        }
    }
    if (docWrite) {
        document.write(allScriptTags.join(""));
        document.write(allCSSTags.join(""));
    }
}(es));