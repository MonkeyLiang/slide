
;(function(window,document,undefined){
	var sliders,width,liW,liH;
	var slide=function(targetDom,options){
		 if(!(this instanceof slide))return new slide(targetDom,options);
        // 参数合并
        this.options = this.extend({
        // 默认参数以后可能会更改所以暴露出去
            type:"horizontal",// 垂直vertical           
        },options);

        // 判断传进来的是DOM还是字符串
        if((typeof targetDom)==="string"){
            this.targetDom = document.querySelector(targetDom);
        }else{
            this.targetDom = targetDom;
        }
        sliders=this;
         // 初始化
        this.init();
	};

	 slide.prototype = {
	 	icon:document.getElementById('icon'),
	 	li:slider.getElementsByTagName('li'),
	 	span:icon.getElementsByTagName('span'),
	 	index:1,//显示元素的索引
	 	touch:('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
	 	init:function(){
            var self = this; //this指slide对象
            self.load(self);//页面设置
            if(!!self.touch) self.targetDom.addEventListener('touchstart',self.events,false); //addEventListener第二个参数可以传一个对象，会调用该对象的handleEvent属性
        	self.icon.addEventListener('click',self.iconsClick,false);
	 	},
        extend:function(obj,obj2){
            for(var k in obj2){
                obj[k] = obj2[k];
            }
            return obj;
        },
        load:function(self){
        	var ll=self.li[self.li.length-1].innerHTML,lf=self.li[0].innerHTML;
			var l1=document.createElement('li'),l2=document.createElement('li');
			l1.innerHTML=ll;
			l2.innerHTML=lf;
			self.targetDom.insertBefore(l1,self.targetDom.childNodes[0]);
			self.targetDom.appendChild(l2,self.targetDom.childNodes[self.li.length]);
			if(self.options.type=="horizontal"){
				self.targetDom.style.width=self.li.length*100+'%';		
				width=slider.offsetWidth;
				liW=width/self.li.length;
				setTransition(0,-(self.index/self.li.length*width),0);
				for (var l=0;l<self.li.length;l++) {
					self.li[l].style.width=liW+'px';
				}
			}else{				
				self.targetDom.className="cnt clearfix hz";
				self.targetDom.style.height=self.li.length*100+'%';
				self.targetDom.style.width='100%';
				self.icon.style.display="none";			
				height=slider.offsetHeight;
				liH=height/self.li.length;
				setTransition(0,0,-(self.index/self.li.length*height));
				for (var l=0;l<self.li.length;l++) {
					self.li[l].style.height=liH+'px';
					self.li[l].style.width='100%';
				}
			}
        },
        events:function(event){	
        	if(event.type == 'touchstart'){
                      sliders.start(event);
                 }else if(event.type == 'touchmove'){
                      sliders.move(event);
                 }else if(event.type == 'touchend'){
                      sliders.end(event);
                  }
        },
        iconsClick:function(e){ //导航按钮
        	if(!(e.target.localName==='span')){return;}
        	var t=e.target.innerHTML;
        	for(var i=0;i<sliders.span.length;i++){
        		var txt=sliders.span[i].innerHTML;
        		sliders.span[i].className="";
	        	if(t===txt){
	        		sliders.index=i+1;
	        		sliders.span[i].className="curr";
	        	}
	        }
			setTransition(0.5,-sliders.index*liW,0);
        },
       start:function(event){
        	startP=event.changedTouches[0];
          	this.targetDom.addEventListener('touchmove',this.events,false);
           	this.targetDom.addEventListener('touchend',this.events,false);    
        },
       move:function(event){
         	if(event.changedTouches.length > 1 || event.scale && event.scale !== 1) return;//如果有多个touch事件或者页面被缩放过不执行
        	moveP=event.changedTouches[0];
 			var moveX=moveP.pageX-startP.pageX;
 			var moveY=moveP.pageY-startP.pageY;
 			if(this.options.type=="horizontal"){//水平
	 			if(moveX>0){
					var x=parseInt(-this.index*liW)+parseInt(moveX);
		        	setTransition(0.1,x,0);
	 			}else{
	 				var x=parseInt(-this.index*liW)+parseInt(moveX);
		        	setTransition(0.1,x,0);
	 			}
 			}else{//垂直
 				if(moveY>0){
 					var y=parseInt(-this.index*liH)+parseInt(moveY);
		        	setTransition(0.1,0,y);
	 			}else{
	 				var y=parseInt(-this.index*liH)+parseInt(moveY);
					setTransition(0.1,0,y);
	 			}
 			}
        },
       end:function(event){
        endP=event.changedTouches[0];//获取结束位置
        var endX=endP.pageX-startP.pageX;
        var endY=endP.pageY-startP.pageY;
        //
		var lx=liW*0.3;
		var ly=liH*0.3;
		if(this.options.type=="horizontal"){//判断水平滑动
	        if(endX<-lx){
	            if(this.index<this.li.length-2){
	                this.span[this.index-1].className = '';
	                this.index=this.index+1;
					setTransition(0.8,-this.index*liW,0);
	                this.span[this.index-1].className = 'curr';
	            }else if(this.index==this.li.length-2){//最后一页
	                this.span[this.index-1].className = '';         
	                this.index=this.index+1;
	                setTransition(0.8,-this.index*liW,0);
	                this.span[0].className = 'curr'; 
	                var that=this
	                setTimeout(function(){ 
			            that.index=1;   
						setTransition(0,-that.index*liW,0);
	                },810)              
	            }
	        }else if(endX>-lx&&endX<=0){//滑动距离未达到翻页所需距离
	            setTransition(0.2,-this.index*liW,0);
	        }
	        if(endX>lx){
	            if(this.index>1){
	                this.span[this.index-1].className = '';
	                this.index=this.index-1;
	            	setTransition(0.8,-this.index*liW,0);
	                this.span[this.index-1].className = 'curr';
	            }else if(this.index==1){
	                this.span[this.index-1].className = '';
	                this.index=this.index-1;
	                var newIndex=this.li.length-2
	            	setTransition(0.8,-this.index*liW,0);
	                this.span[newIndex-1].className = 'curr';
	                var that=this
	                setTimeout(function(){ 
			            that.index=newIndex;
			            setTransition(0,-that.index*liW,0);
	                },810)  
	            }
	        }else if (endX<lx&&endX>0){
	            setTransition(0.2,-this.index*liW,0);
	        }
	        
        }else{//判断垂直滑动
        	if(endY<-ly){
	            if(this.index<this.li.length-2){
	                this.span[this.index-1].className = '';
	                this.index=this.index+1;
	                setTransition(0.8,0,-this.index*liH);
	                this.span[this.index-1].className = 'curr';
	            }else if(this.index==this.li.length-2){
	                this.span[this.index-1].className = '';         
	                this.index=this.index+1;
	                setTransition(0.8,0,-this.index*liH);
	                this.span[0].className = 'curr'; 
	                var that=this
	                setTimeout(function(){ 
			            that.index=1;    
						setTransition(0,0,-that.index*liH);
	                },810)              
	            }
	        }else if(endY>-ly&&endY<=0){
	            setTransition(0.2,0,-this.index*liH);
	        }
	        if(endY>ly){
	            if(this.index>1){
	                this.span[this.index-1].className = '';
	                this.index=this.index-1;
	            	setTransition(0.8,0,-this.index*liH);
	                this.span[this.index-1].className = 'curr';
	            }else if(this.index==1){
	                this.span[this.index-1].className = '';
	                this.index=this.index-1;
	                var newIndex=this.li.length-2;
	            	setTransition(0.8,0,-this.index*liH);
	                this.span[newIndex-1].className = 'curr';
	                var that=this
	                setTimeout(function(){ 
			            that.index=newIndex;
			            setTransition(0,0,-that.index*liH);
	                },810)  
	            }
	        }else if (endY<ly&&endY>0){
	            setTransition(0.2,0,-this.index*liH);
	        }
        }    
       }      
	};
	 var setTransition=function(time,x,y){
	 	slider.style.webkitTransition='-webkit-transform '+time+'s ease-in-out';
	 	slider.style.MozTransition='-moz-transform '+time+'s ease-in-out';
	 	slider.style.MsTransition='-ms-transform '+time+'s ease-in-out';
	 	slider.style.OTransition='-o-transform '+time+'s ease-in-out';
	    slider.style.transition='transform '+time+'s ease-in-out';
	    slider.style.webkitTransform='translate('+x+'px,'+y+'px)';
	    slider.style.MozTransform='translate('+x+'px,'+y+'px)';
	    slider.style.MsTransform='translate('+x+'px,'+y+'px)';
	    slider.style.OTransform='translate('+x+'px,'+y+'px)';
	    slider.style.transform= 'translateX('+x+'px,'+y+'px)';
	 }
	// 暴露方法
    window.slide = slide;
})(window,document)
