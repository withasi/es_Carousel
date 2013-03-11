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
(function(){var es={VERSION:"1.0.1",namespace:function(space,root){var arr=space.split("."),i=0,nameI;if(space.indexOf(".")==0){i=1;root=root||es;}root=root||window;for(;nameI=arr[i++];){if(!root[nameI]){root[nameI]={};}root=root[nameI];}return root;},extend:function(destination,source,override){if(override===undefined){override=true;}for(var property in source){if(override||!(property in destination)){destination[property]=source[property];}}return destination;},deepextend:function(destination,source){for(var property in source){var copy=source[property];if(destination===copy){continue;}if(typeof copy==="object"){destination[property]=arguments.callee(destination[property]||{},copy);}else{destination[property]=copy;}}return destination;},noConflict:(function(isExclusive){var previous=window.es;return function(){window.es=previous;return es;};}())};window.es=es;}());(function(e){window.requestAnimFrame=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){window.setTimeout(callback,1000/60);};})(),window.cancelRequestAnimationFrame=(function(){return window.cancelRequestAnimationFrame||window.webkitCancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||clearTimeout;})();var vendor=(/webkit/i).test(navigator.appVersion)?"webkit":(/firefox/i).test(navigator.userAgent)?"Moz":"opera" in window?"O":"",isAndroid=(/android/gi).test(navigator.appVersion),isIPhone=/iphone/gi.test(navigator.appVersion),isIPhone4=window.devicePixelRatio>=2,isIPad=/ipad/gi.test(navigator.appVersion),isIDevice=isIPhone||isIPad,has3d="WebKitCSSMatrix" in window&&"m11" in new WebKitCSSMatrix(),trnOpen="translate"+(has3d?"3d(":"("),trnClose=has3d?",0)":")",hasTouch="ontouchstart" in window,hasTransform=vendor+"Transform" in document.documentElement.style,hasTransitionEnd=true,RESIZE_EV="onorientationchange" in window?"orientationchange":"resize",START_EV=hasTouch?"touchstart":"mousedown",MOVE_EV=hasTouch?"touchmove":"mousemove",END_EV=hasTouch?"touchend":"mouseup",CANCEL_EV=hasTouch?"touchcancel":"mouseup",WHEEL_EV=vendor=="Moz"?"DOMMouseScroll":"mousewheel",TOUCH_EV=hasTouch?"touchend":"click",HOVERIN_EV="hoverin",HOVEROUT_EV="hoverout";e.vendor=vendor,e.isAndroid=isAndroid,e.isIPhone=isIPhone,e.isIPhone4=isIPhone4,e.isIPad=isIPad,e.isIDevice=isIDevice,e.has3d=has3d,e.trnOpen=trnOpen,e.trnClose=trnClose,e.hasTouch=hasTouch,e.hasTransform=hasTransform,e.hasTransitionEnd=hasTransitionEnd,e.RESIZE_EV=RESIZE_EV,e.START_EV=START_EV,e.MOVE_EV=MOVE_EV,e.END_EV=END_EV,e.CANCEL_EV=CANCEL_EV,e.WHEEL_EV=WHEEL_EV,e.TOUCH_EV=TOUCH_EV,e.HOVERIN_EV=HOVERIN_EV,e.HOVEROUT_EV=HOVEROUT_EV;}(es));(function(e){var extend=e.extend;var Class=function(){var Class=function(){if(arguments&&arguments[0]!=e.Class.isPrototype){this.initialize.apply(this,arguments);}};var extended={};var parent,initialize;for(var i=0,len=arguments.length;i<len;++i){if(typeof arguments[i]=="function"){if(i==0&&len>1){initialize=arguments[i].prototype.initialize;arguments[i].prototype.initialize=function(){};extended=new arguments[i];if(initialize===undefined){delete arguments[i].prototype.initialize;}else{arguments[i].prototype.initialize=initialize;}}parent=arguments[i].prototype;}else{parent=arguments[i];}extend(extended,parent);}Class.prototype=extended;return Class;};Class.isPrototype=function(){};Class.create=function(){return function(){if(arguments&&arguments[0]!=e.Class.isPrototype){this.initialize.apply(this,arguments);}};};Class.inherit=function(){var superClass=arguments[0];var proto=new superClass(e.Class.isPrototype);for(var i=1,len=arguments.length;i<len;i++){if(typeof arguments[i]=="function"){var mixin=arguments[i];arguments[i]=new mixin(es.Class.isPrototype);}extend(proto,arguments[i]);}return proto;};function dateFormat(date,format){var o={"M+":date.getMonth()+1,"d+":date.getDate(),"h+":date.getHours(),"m+":date.getMinutes(),"s+":date.getSeconds(),"q+":Math.floor((date.getMonth()+3)/3),S:date.getMilliseconds()};if(/(y+)/.test(format)){format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4-RegExp.$1.length));}for(var k in o){if(new RegExp("("+k+")").test(format)){format=format.replace(RegExp.$1,RegExp.$1.length==1?o[k]:("00"+o[k]).substr((""+o[k]).length));}}return format;}e.Class=Class,e.dateFormat=dateFormat;}(es));
;(function(e){function Hammer(element,options,undefined){var self=this;var defaults={prevent_default:false,css_hacks:true,swipe:true,swipe_delay:true,swipe_double:true,swipe_time:300,swipe_max_interval:200,swipe_min_distance:20,drag:true,drag_vertical:true,drag_horizontal:true,drag_min_distance:3,transform:true,scale_treshold:0.1,rotation_treshold:15,tap:true,tap_double:true,tap_max_interval:200,tap_max_distance:3,tap_double_distance:20,hold:true,hold_timeout:500};options=mergeObject(defaults,options);(function(){if(!options.css_hacks){return false;}var vendors=["webkit","moz","ms","o",""];var css_props={userSelect:"none",touchCallout:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"};var prop="";for(var i=0;i<vendors.length;i++){for(var p in css_props){prop=p;if(vendors[i]){prop=vendors[i]+prop.substring(0,1).toUpperCase()+prop.substring(1);}element.style[prop]=css_props[p];}}})();var _distance=0;var _angle=0;var _direction=0;var _pos={};var _fingers=0;var _first=false;var _gesture=null;var _prev_gesture=null;var _touch_start_time=null;var _prev_tap_pos={x:0,y:0};var _prev_tap_end_time=null;var _prev_swipe_end_time=null;var _prev_swipe_direction=null;var _hold_timer=null;var _offset={};var _mousedown=false;var _event_start;var _event_move;var _event_end;var _has_touch=("ontouchstart" in window);this.option=function(key,val){if(val!=undefined){options[key]=val;}return options[key];};this.getDirectionFromAngle=function(angle){var directions={down:angle>=45&&angle<135,left:angle>=135||angle<=-135,up:angle<-45&&angle>-135,right:angle>=-45&&angle<=45};var direction,key;for(key in directions){if(directions[key]){direction=key;break;}}return direction;};function countFingers(event){return event.touches?event.touches.length:1;}function getXYfromEvent(event){event=event||window.event;if(!_has_touch){var doc=document,body=doc.body;return[{time:new Date().getTime(),x:event.pageX||event.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc&&doc.clientLeft||body&&doc.clientLeft||0),y:event.pageY||event.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc&&doc.clientTop||body&&doc.clientTop||0)}];}else{var pos=[],src,touches=event.touches.length>0?event.touches:event.changedTouches;for(var t=0,len=touches.length;t<len;t++){src=touches[t];pos.push({time:new Date().getTime(),x:src.pageX,y:src.pageY});}return pos;}}function getAngle(pos1,pos2){return Math.atan2(pos2.y-pos1.y,pos2.x-pos1.x)*180/Math.PI;}function calculateScale(pos_start,pos_move){if(pos_start.length==2&&pos_move.length==2){var x,y;x=pos_start[0].x-pos_start[1].x;y=pos_start[0].y-pos_start[1].y;var start_distance=Math.sqrt((x*x)+(y*y));x=pos_move[0].x-pos_move[1].x;y=pos_move[0].y-pos_move[1].y;var end_distance=Math.sqrt((x*x)+(y*y));return end_distance/start_distance;}return 0;}function calculateRotation(pos_start,pos_move){if(pos_start.length==2&&pos_move.length==2){var x,y;x=pos_start[0].x-pos_start[1].x;y=pos_start[0].y-pos_start[1].y;var start_rotation=Math.atan2(y,x)*180/Math.PI;x=pos_move[0].x-pos_move[1].x;y=pos_move[0].y-pos_move[1].y;var end_rotation=Math.atan2(y,x)*180/Math.PI;return end_rotation-start_rotation;}return 0;}function triggerEvent(eventName,params){params.touches=getXYfromEvent(params.originalEvent);params.type=eventName;var _directs={left:1001,right:1002,up:1003,down:1004};if(params.touches){params.x=params.touches[0].x;params.y=params.touches[0].y;}if(params.direction){params.direct=_directs[params.direction];}if(isFunction(self["on"+eventName])){self["on"+eventName].call(self,params);}}function cancelEvent(event){event=event||window.event;if(event.preventDefault){event.preventDefault();event.stopPropagation();}else{event.returnValue=false;event.cancelBubble=true;}}function reset(){_pos={};_first=false;_fingers=0;_distance=0;_angle=0;_gesture=null;}var gestures={hold:function(event){if(options.hold){_gesture="hold";clearTimeout(_hold_timer);_hold_timer=setTimeout(function(){if(_gesture=="hold"){triggerEvent("hold",{originalEvent:event,position:_pos.start});}},options.hold_timeout);}},swipe:function(event){if(!_pos.move){return;}var _distance_x=_pos.move[0].x-_pos.start[0].x;var _distance_y=_pos.move[0].y-_pos.start[0].y;_distance=Math.sqrt(_distance_x*_distance_x+_distance_y*_distance_y);var now=new Date().getTime();var touch_time=now-_touch_start_time;if(options.swipe&&(options.swipe_time>touch_time)&&(_distance>options.swipe_min_distance)){_angle=getAngle(_pos.start[0],_pos.move[0]);_direction=self.getDirectionFromAngle(_angle);var position={x:_pos.move[0].x-_offset.left,y:_pos.move[0].y-_offset.top};var _directs={left:1001,right:1002,up:1003,down:1004};var event_obj={originalEvent:event,position:position,direction:_direction,distance:_distance,distanceX:_distance_x,distanceY:_distance_y,angle:_angle,speed:_distance/touch_time};var is_double_swipe=(function(){if(options.swipe_double&&_prev_gesture=="swipe"&&(_touch_start_time-_prev_swipe_end_time)<options.swipe_max_interval){return _prev_swipe_direction==_direction;}return false;})();if(is_double_swipe){_gesture="swipe_double";_prev_swipe_end_time=null;triggerEvent("doubleswipe",event_obj);}else{_gesture="swipe";_prev_swipe_end_time=now;_prev_swipe_direction=_direction;triggerEvent("swipe",event_obj);}}else{if(_pos.movequeue.length>4){var mqlen=_pos.movequeue.length;var _distance_x=_pos.move[0].x-_pos.movequeue[mqlen-4][0].x;var _distance_y=_pos.move[0].y-_pos.movequeue[mqlen-4][0].y;_distance=Math.sqrt(_distance_x*_distance_x+_distance_y*_distance_y);var now=new Date().getTime();var touch_time=now-_pos.movequeue[mqlen-4][0].time;if(options.swipe_delay&&(options.swipe_time>touch_time)&&(_distance>options.swipe_min_distance)){_angle=getAngle(_pos.movequeue[mqlen-4][0],_pos.move[0]);_direction=self.getDirectionFromAngle(_angle);_gesture="swipe_delay";var position={x:_pos.move[0].x-_offset.left,y:_pos.move[0].y-_offset.top};var event_obj={originalEvent:event,position:position,direction:_direction,distance:_distance,distanceX:_distance_x,distanceY:_distance_y,angle:_angle,speed:_distance/touch_time};triggerEvent("delayswipe",event_obj);}}}},drag:function(event){var _distance_x=_pos.move[0].x-_pos.start[0].x;var _distance_y=_pos.move[0].y-_pos.start[0].y;_distance=Math.sqrt(_distance_x*_distance_x+_distance_y*_distance_y);if(options.drag&&(_distance>options.drag_min_distance)||_gesture=="drag"){_angle=getAngle(_pos.start[0],_pos.move[0]);_direction=self.getDirectionFromAngle(_angle);var is_vertical=(_direction=="up"||_direction=="down");if(((is_vertical&&!options.drag_vertical)||(!is_vertical&&!options.drag_horizontal))&&(_distance>options.drag_min_distance)){return;}_gesture="drag";var position={x:_pos.move[0].x-_offset.left,y:_pos.move[0].y-_offset.top};var event_obj={originalEvent:event,position:position,direction:_direction,distance:_distance,distanceX:_distance_x,distanceY:_distance_y,angle:_angle};if(_first){triggerEvent("dragstart",event_obj);_first=false;}triggerEvent("drag",event_obj);cancelEvent(event);}},transform:function(event){if(options.transform){if(countFingers(event)!=2){return false;}var rotation=calculateRotation(_pos.start,_pos.move);var scale=calculateScale(_pos.start,_pos.move);if(_gesture!="drag"&&(_gesture=="transform"||Math.abs(1-scale)>options.scale_treshold||Math.abs(rotation)>options.rotation_treshold)){_gesture="transform";_pos.center={x:((_pos.move[0].x+_pos.move[1].x)/2)-_offset.left,y:((_pos.move[0].y+_pos.move[1].y)/2)-_offset.top};var event_obj={originalEvent:event,position:_pos.center,scale:scale,rotation:rotation};if(_first){triggerEvent("transformstart",event_obj);_first=false;}triggerEvent("transform",event_obj);cancelEvent(event);return true;}}return false;},tap:function(event){var now=new Date().getTime();var touch_time=now-_touch_start_time;if(options.hold&&!(options.hold&&options.hold_timeout>touch_time)){return;}var is_double_tap=(function(){if(_prev_tap_pos&&options.tap_double&&_prev_gesture=="tap"&&(_touch_start_time-_prev_tap_end_time)<options.tap_max_interval){var x_distance=Math.abs(_prev_tap_pos[0].x-_pos.start[0].x);var y_distance=Math.abs(_prev_tap_pos[0].y-_pos.start[0].y);return(_prev_tap_pos&&_pos.start&&Math.max(x_distance,y_distance)<options.tap_double_distance);}return false;})();if(is_double_tap){_gesture="double_tap";_prev_tap_end_time=null;triggerEvent("doubletap",{originalEvent:event,position:_pos.start});cancelEvent(event);}else{var x_distance=(_pos.move)?Math.abs(_pos.move[0].x-_pos.start[0].x):0;var y_distance=(_pos.move)?Math.abs(_pos.move[0].y-_pos.start[0].y):0;_distance=Math.max(x_distance,y_distance);if(_distance<options.tap_max_distance){_gesture="tap";_prev_tap_end_time=now;_prev_tap_pos=_pos.start;if(options.tap){triggerEvent("tap",{originalEvent:event,position:_pos.start});cancelEvent(event);}}}}};function handleEvents(event){switch(event.type){case"mousedown":case"touchstart":_pos.start=getXYfromEvent(event);_touch_start_time=new Date().getTime();_fingers=countFingers(event);_first=true;_event_start=event;var box=element.getBoundingClientRect();var clientTop=element.clientTop||document.body.clientTop||0;var clientLeft=element.clientLeft||document.body.clientLeft||0;var scrollTop=window.pageYOffset||element.scrollTop||document.body.scrollTop;var scrollLeft=window.pageXOffset||element.scrollLeft||document.body.scrollLeft;_offset={top:box.top+scrollTop-clientTop,left:box.left+scrollLeft-clientLeft};_mousedown=true;triggerEvent("press",{originalEvent:event});gestures.hold(event);if(options.prevent_default){cancelEvent(event);}break;case"mousemove":case"touchmove":if(!_mousedown){return false;}_event_move=event;_pos.move=getXYfromEvent(event);_pos.movequeue?_pos.movequeue.push(_pos.move):_pos.movequeue=[_pos.move];if(!gestures.transform(event)){gestures.drag(event);}break;case"mouseup":case"mouseout":case"touchcancel":case"touchend":if(!_mousedown||(_gesture!="transform"&&event.touches&&event.touches.length>0)){return false;}_mousedown=false;_event_end=event;var dragging=_gesture=="drag";gestures.swipe(event);if(dragging){triggerEvent("dragend",{originalEvent:event,direction:_direction,distance:_distance,angle:_angle});}else{if(_gesture=="transform"){triggerEvent("transformend",{originalEvent:event,position:_pos.center,scale:calculateScale(_pos.start,_pos.move),rotation:calculateRotation(_pos.start,_pos.move)});}else{gestures.tap(_event_start);}}_prev_gesture=_gesture;var now=new Date().getTime();var touch_time=now-_touch_start_time;triggerEvent("release",{originalEvent:event,gesture:_gesture,touch_time:touch_time});reset();break;}}if(_has_touch){addEvent(element,"touchstart touchmove touchend touchcancel",handleEvents);}else{addEvent(element,"mouseup mousedown mousemove",handleEvents);addEvent(element,"mouseout",function(event){if(!isInsideHammer(element,event.relatedTarget)){handleEvents(event);}});}function isInsideHammer(parent,child){if(!child&&window.event&&window.event.toElement){child=window.event.toElement;}if(parent===child){return true;}if(child){var node=child.parentNode;while(node!==null){if(node===parent){return true;}node=node.parentNode;}}return false;}function mergeObject(obj1,obj2){var output={};if(!obj2){return obj1;}for(var prop in obj1){if(prop in obj2){output[prop]=obj2[prop];}else{output[prop]=obj1[prop];}}return output;}function isFunction(obj){return Object.prototype.toString.call(obj)=="[object Function]";}function addEvent(element,types,callback){types=types.split(" ");for(var t=0,len=types.length;t<len;t++){if(element.addEventListener){element.addEventListener(types[t],callback,false);}else{if(document.attachEvent){element.attachEvent("on"+types[t],callback);}}}}}e.Hammer=Hammer;}(es));
;(function(e){e.Carousel=e.Class({initialize:function(overviewEl,contentEl,options){var peer=this;this.overviewEl=typeof overviewEl=="string"?document.getElementById(overviewEl):overviewEl;this.contentEl=typeof contentEl=="string"?document.getElementById(contentEl):contentEl;this.pageCount=this.contentEl.children.length;this.opts={clientWidth:this.overviewEl.clientWidth,clientHeight:this.overviewEl.clientHeight,swipeTime:300,pageSwitchThred:100,isIndicator:true,useTransform:true,useTransition:true};for(n in options){this.opts[n]=options[n];}this.statusBars=[];this.contentEl.style.width=this.pageCount*100+"%";for(var i=0;i<this.pageCount;i++){this.contentEl.children[i].style.width=(1/this.pageCount)*100+"%";}this.index=0;if(this.opts.isIndicator){this.createPageStatusBar(this.overviewEl,this.pageCount);this.updateStatusBar(0,this.statusBars);}this.attachContentDrag(this.contentEl);window.addEventListener("resize",function(){peer.resize();var endPosX=peer.index*-peer.opts.clientWidth;peer.contentEl.style[e.vendor+"Transform"]=e.trnOpen+endPosX+"px,0"+e.trnClose;});},attachContentDrag:function(el){var peer=this;var hm=new es.Hammer(el,{swipe_delay:false,swipe_time:200});hm.ondragstart=function(){peer.curStartLeft=peer.index*-peer.opts.clientWidth,el.style[e.vendor+"TransitionDuration"]=0;peer.swiped=false;};hm.ondrag=function(evt){peer.distanceX=evt.distanceX;var slowFactor=1;if(evt.distanceX>0&&peer.index==0||evt.distanceX<0&&peer.index==peer.pageCount-1){slowFactor=0.4;}var newPosX=peer.curStartLeft+evt.distanceX*slowFactor;el.style[e.vendor+"Transform"]=e.trnOpen+newPosX+"px,0"+e.trnClose;};hm.ondragend=function(){if(!peer.swiped){peer.slideEnd();}};hm.onswipe=function(evt){if(evt.direct==1001){peer.swiped=true;peer.slideEnd(true);}else{if(evt.direct==1002){peer.swiped=true;peer.slideEnd(true);}}};},updateStatusBar:function(index,statusBars){for(var i=0;i<statusBars.length;i++){if(i==index){statusBars[index].className="pageindicatoricon highlight";}else{statusBars[i].className="pageindicatoricon normal";}}},createPageStatusBar:function(el,count){var bar=document.createElement("div");bar.style.cssText="position: absolute;z-index:1;text-align:center;bottom:0;width:100%;";var tdiv=document.createElement("div");tdiv.className="pageindicator";bar.appendChild(tdiv);for(var i=0;i<count;i++){var ib=document.createElement("div");ib.className="pageindicatoricon normal";tdiv.appendChild(ib);this.statusBars.push(ib);}el.appendChild(bar);},slideEnd:function(isDrag){var peer=this;this.contentEl.style[e.vendor+"TransitionDuration"]=this.opts.swipeTime+"ms";var endPosX=this.curStartLeft;if(isDrag||Math.abs(this.distanceX)>this.opts.pageSwitchThred){if(this.distanceX<0){if(this.index<this.pageCount-1){this.index++;endPosX-=this.opts.clientWidth;setTimeout(function(){peer.updateStatusBar(peer.index,peer.statusBars);},this.opts.swipeTime);}}else{if(this.index>0){this.index--;endPosX+=this.opts.clientWidth;setTimeout(function(){peer.updateStatusBar(peer.index,peer.statusBars);},this.opts.swipeTime);}}}this.contentEl.style[e.vendor+"Transform"]=e.trnOpen+endPosX+"px,0"+e.trnClose;},resize:function(){this.opts.clientWidth=window.innerWidth;this.opts.clientHeight=window.innerHeight;},CLASS_NAME:"Carousel"});}(es));