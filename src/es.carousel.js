/**
 * @class:  Carousel类
 * @example  var testCarousel = new es.Carousel("view","content")
 * @param overviewEl {HTMLElement|String} 为视角容器，为视角容器，即 Carousel的视角
 * @param contentEl {HTMLElement||String} 为上边容器的子容器，内容区的容器，宽度为page之和，为page页面的父容器
 * @param options {Object} 构造设置，参数说明：
 *           {
                clientWidth : window.innerWidth, //客户区宽度
                clientHeight : window.innerHeight, //客户区高度
                swipeTime:300,//切换时间，单位为ms
                pageSwitchThred:100,//页面切换阈值，单位为px。表示当左右切换时，当切换的宽度为大于pageSwitchThred时，无论速度，在弹起时均切换
                isIndicator:true,//是否创建指示器
                useTransform:true, //如果没有采用transform,则直接通过改变style的top和left属性
                useTransition:true //如果没有采用Transition,则设定style的top和left作为变换属性，而非指定transform
            }
 * @public
 */
;(function(e){
    e.Carousel = e.Class({
        initialize:function(overviewEl, contentEl,  options){
            this.overviewEl = typeof overviewEl == "string" ? document.getElementById(overviewEl) : overviewEl;
            this.contentEl = typeof contentEl == "string" ? document.getElementById(contentEl) : contentEl;
            this.pageCount = this.contentEl.children.length;//页面个个数
            this.opts = {
                clientWidth : this.overviewEl.clientWidth, //客户区宽度
                clientHeight :  this.overviewEl.clientHeight, //客户区高度
                swipeTime:300,//切换时间，单位为ms
                pageSwitchThred:100,//页面切换阈值，单位为px。表示当左右切换时，当切换的宽度为大于pageSwitchThred时，无论速度，在弹起时均切换
                isIndicator:true,//是否创建指示器
                useTransform:true, //如果没有采用transform,则直接通过改变style的top和left属性
                useTransition:true
            }

            for(n in options)this.opts[n]=options[n];


            this.statusBars = [];
            this.contentEl.style.width = this.pageCount * 100 + "%";
            for(var i=0; i<this.pageCount; i++)this.contentEl.children[i].style.width=(1/this.pageCount)*100 + "%";
            this.index = 0;




            //this.contentEl.style[e.vendor + 'TransitionProperty'] = this.opts.useTransform ? '-' + e.vendor.toLowerCase() + '-transform' : 'top left';




            //*******2-3）创建控制区域工具条或者状态工具条
            if( this.opts.isIndicator){
                this.createPageStatusBar(this.overviewEl, this.pageCount);
                this.updateStatusBar(0, this.statusBars);
            }


            //*******2-4）绑定contentDiv的拖动动作
            this.attachContentDrag(this.contentEl);

        },
        /**
         * 给el添加拖动事件绑定
         * @param el
         */
        attachContentDrag : function(el) {
            var peer = this;
            var hm = new es.Hammer(el,{swipe_delay:false,swipe_time:200});
            //var events = ['press','hold','tap','doubletap','transformstart','transform','transformend','dragstart','drag','dragend','swipe','doubleswipe','delayswipe','release'];
            hm['ondragstart'] = function () {
                peer.curStartLeft = peer.index * - peer.opts.clientWidth, //开始拖动时的指头X轴位置
                    el.style[e.vendor + 'TransitionDuration'] = 0;
                peer.swiped = false;
            }
            hm['ondrag'] = function (evt) {
                peer.distanceX = evt.distanceX;//记录住当前拖动的距离
                var slowFactor = 1;

                if (evt.distanceX > 0 && peer.index == 0 || evt.distanceX < 0 && peer.index == peer.pageCount - 1)slowFactor = 0.4;
                var newPosX = peer.curStartLeft + evt.distanceX * slowFactor;
                el.style[e.vendor + 'Transform'] = e.trnOpen + newPosX + 'px,0' + e.trnClose;
            }
            hm['ondragend'] = function () {
                if (!peer.swiped) {
                    peer.slideEnd();
                }
            }
            hm['onswipe'] = function (evt) {
                if (evt.direct == 1001) {
                    peer.swiped = true;
                    peer.slideEnd(true);
                } else if (evt.direct == 1002) {
                    peer.swiped = true;
                    peer.slideEnd(true);
                }
            }
        },
        /**
         * 根据index更新最底部statusbar的状态
         * @param index
         * @param statusBars
         */
        updateStatusBar : function(index, statusBars) {
            for (var i = 0; i < statusBars.length; i++) {
                if (i == index) {
                    statusBars[index].className = "pageindicatoricon highlight";
                } else {
                    statusBars[i].className = "pageindicatoricon normal";
                }
            }
        },
        /**
         * 创建状态栏
         * @param el
         * @param count
         */
        createPageStatusBar : function(el, count) {
            var bar = document.createElement("div");
            bar.style.cssText = 'position: absolute;z-index:1;text-align:center;bottom:0;width:100%;';
            var tdiv = document.createElement("div");
            tdiv.className = "pageindicator";
            bar.appendChild(tdiv);
            for (var i = 0; i < count; i++) {
                var ib = document.createElement("div");
                ib.className = 'pageindicatoricon normal';
                tdiv.appendChild(ib);
                this.statusBars.push(ib);
            }
            el.appendChild(bar);
        },
        /**
         * 拖动完毕后的动画动作
         * @param isDrag 是不是拖动，如果不是拖动则是swipe，此时就不需要距离判断了
         */
        slideEnd: function(isDrag) {
            var peer = this;
            this.contentEl.style[e.vendor + 'TransitionDuration'] = this.opts.swipeTime + "ms";
            var endPosX = this.curStartLeft;
            if (isDrag || Math.abs(this.distanceX) > this.opts.pageSwitchThred) {
                if (this.distanceX < 0) {
                    if (this.index < this.pageCount - 1) {
                        //右边一屏展现出来
                        this.index++;
                        endPosX -= this.opts.clientWidth;

                        setTimeout(function () {
                            peer.updateStatusBar(peer.index, peer.statusBars)
                        }, this.opts.swipeTime);
                    }
                } else if (this.index > 0) {
                    //左边边一屏展现出来
                    this.index--;
                    endPosX += this.opts.clientWidth;
                    setTimeout(function () {
                        peer.updateStatusBar(peer.index, peer.statusBars)
                    }, this.opts.swipeTime);
                }
            }
            this.contentEl.style[e.vendor + 'Transform'] = e.trnOpen + endPosX + 'px,0' + e.trnClose;
        },
        CLASS_NAME:"Carousel"
    });
}(es));