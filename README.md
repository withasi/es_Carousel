Introduction
===
一个carousel小组件
one carousel component for mobile broswers

Index
===
[主页](http://182.92.83.234/carousel/)<br />  


API Introduction
===
/**
 * @fileOverview es.Carousel
 * Copyright (c) 2012, All rights reserved.
 *
 * @author    @si(<a href="mailto:withasi@gmail.com">withasi@gmail.com</a>)
 *
 */

此类库中部分为平时代码积累、某些开源类库中的部分代码，如jet，hammer.js等。
/************** define： start  **************/
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
/************** define： end  **************/

Example
===
/************** example： start  **************/
## <div class="view" id="view">
     <div id="content" class="carouselContent">
         <div class="contentpage">
             <p>page 1</p>
         </div>
         <div class="contentpage">
             <p>page 2</p>
         </div>
         <div class="contentpage">
             <p>page 3</p>
         </div>
     </div>
 </div>
##<script type="text/javascript">
     window.onload = function(){
         /**
          * @description:  Carousel类
          * @param overviewEl {HTMLElement||String} 为视角容器，为视角容器，即 Carousel的视角
          * @param contentEl {HTMLElement||String} 为上边容器的子容器，内容区的容器，宽度为page之和，为page页面的父容器
          * @param options {Object} 构造设置
          *           {
                 clientWidth : window.innerWidth, //客户区宽度
                 clientHeight : window.innerHeight, //客户区高度
                 swipeTime:300,//切换时间，单位为ms
                 pageSwitchThred:100,//页面切换阈值，单位为px。表示当左右切换时，当切换的宽度为大于pageSwitchThred时，无论速度，在弹起时均切换
                 isIndicator:true//是否创建指示器
             }
          * @type {*}
          */
         var testCarousel = new es.Carousel("view","content");
     }
 </script>
 /************** example： end  **************/

