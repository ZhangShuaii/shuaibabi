/*
*	src 图片地址
*	animateDuration 动画时长
*	frame 动画帧数（每秒）
*	ctx 画布对象
*	x y  最终成像的坐标修正
*	blackBg 黑色背景
*/
var drawImg = {
	init:function(userConf){
		this.conf = {
			src : userConf.src,		
			animateDuration : userConf.animateDuration || 3000,
			frame : userConf.frame || 1000/25,
			ctx : userConf.ctx,
			x:userConf.x || 0,
			y:userConf.y || 0,
			time: 0,
			blackBg:userConf.blackBg || false
		}
		this.load();
	},

	load:function(){
		var img = new Image();
		var thisDraw = this;
		img.onload  = function(){
			thisDraw.conf.ctx.drawImage(this,0,0);
			thisDraw.conf.imgData = thisDraw.conf.ctx.getImageData(0,0,img.width,img.height);
			thisDraw.getPosition();
			thisDraw.clearImg();
			thisDraw.drawAnimate();
		};

		img.src = this.conf.src;
	},
	
	getPosition:function(){
		var pointArr = [],
			imgData = this.conf.imgData.data;
		for(var i=0 ;i < imgData.length;i+=4){
			var pointData = {
				rgba:[imgData[i],imgData[i+1],imgData[i+2],imgData[i]+4],  //因性能问题 暂放弃使用
				rgb:"rgb("+imgData[i]+","+imgData[i+1]+","+imgData[i+2]+")",
				x:(i % (this.conf.imgData.width*4) / 4) + this.conf.x,    //最终坐标
				y:(i / (this.conf.imgData.width*4)|0 )+ this.conf.y,

				start:{										//起始坐标
					x:Math.random()*this.conf.ctx.canvas.width ,
					y:Math.random()*this.conf.ctx.canvas.height 
				}
			}
			pointData.distance = {							//坐标差
				x : pointData.x - pointData.start.x,
				y : pointData.y - pointData.start.y 
			}
			if(pointData.rgb!="rgb(0,0,0)"){
				// console.log('0');
				pointArr.push(pointData);
			}
		}
		this.conf.pointArr = pointArr;
	},
	
	clearImg :function(){
		if(this.conf.blackBg){
			this.conf.ctx.fillStyle="#000";
			this.conf.ctx.fillRect(0,0,this.conf.ctx.canvas.width,this.conf.ctx.canvas.height);
		}else{
			this.conf.ctx.clearRect(0,0,this.conf.ctx.canvas.width,this.conf.ctx.canvas.height);
		}
	},
	
	drawAnimate:function(){
		var thisDraw = this;

		var drawFrame = function(){
			if(thisDraw.conf.time > thisDraw.conf.animateDuration){
				return;
			}

			thisDraw.clearImg();

			for(var i=0;i<thisDraw.conf.pointArr.length;i++){
				var nowPosition = {
					x : thisDraw.easeOut(thisDraw.conf.time,
											thisDraw.conf.pointArr[i].start.x,
											thisDraw.conf.pointArr[i].distance.x,
											thisDraw.conf.animateDuration),
					y: thisDraw.easeOut(thisDraw.conf.time,
											thisDraw.conf.pointArr[i].start.y,
											thisDraw.conf.pointArr[i].distance.y,
											thisDraw.conf.animateDuration)
				};

				thisDraw.conf.ctx.fillStyle = thisDraw.conf.pointArr[i].rgb;

				thisDraw.conf.ctx.fillRect(nowPosition.x,nowPosition.y, 1,1);
			}

			setTimeout(drawFrame, thisDraw.conf.frame);
			thisDraw.conf.time+=thisDraw.conf.frame;
		};
		
		drawFrame();
	},
	/*tween 缓动算法*/
	easeOut: function(t,b,c,d){
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
    }
}

