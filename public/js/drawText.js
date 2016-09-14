/*
*canvas 绘制文字
* 使用 drawText.init(conf)
* @Date 2016.9.5
* @author:ZhangShuai
*/
var drawText = {
	init:function(userConf){
		this.conf= {
			fontContent: userConf.fontContent || 'drawText',	//文本内容
			fontSize: userConf.fontSize || 22,                  //字体大小
			x:userConf.x || 0,									//起始坐标x
			y:userConf.y || 0,									//起始坐标y
			colorRgb: userConf.colorRgb || [255,255,255] ,		//字体颜色,rgb数组				
			ctx: userConf.ctx, 									//画布ctx对象
			pixel:userConf.pixel || 12, 						//像素颗粒大小
			frame:userConf.frame || 1000/80,					//动画帧速度
			animateDuration:userConf.animateDuration || 2000,
			pixelContent:userConf.pixelContent || 0 , 			//像素填充内容 默认随机字符
			imgData:[],											//截取数据 
			time:0,

		};

		this.conf.width = userConf.width ||	this.conf.fontSize * this.conf.fontContent.length;
		this.conf.height = userConf.height || this.conf.fontSize + 4;
		this.createCanvas();
		this.parseDataArr();
		this.drawImg(false);
		return this;
	},
	createCanvas:function(){
		var orgCanvas = document.createElement('canvas');
		var orgCtx = orgCanvas.getContext('2d');

		orgCanvas.width = window.innerWidth;
		orgCanvas.height = window.innerHeight;
		orgCtx.font = this.conf.fontSize + 'px 宋体';

		orgCtx.fillStyle = 'rgba(0,0,0,1)';
		orgCtx.fillText(this.conf.fontContent,0,this.conf.fontSize);			

		this.conf.orgCanvas = orgCanvas;
		this.conf.orgCtx = orgCtx;
		this.conf.imgData = orgCtx.getImageData(0,0,this.conf.width,this.conf.height);

	},
	parseDataArr:function(){
		var textArr = [],
			imgData = this.conf.imgData;

		for(var i=0;i<imgData.data.length;i+=4){
			if(this.conf.imgData.data[i+3]==0){
				continue;
			}

			var textData = {
				content:this.conf.pixelContent || String.fromCharCode(Math.random()*1000),
				start : {
					x : (Math.random()-0.5)*this.conf.ctx.canvas.width*6,
					y : (Math.random()-0.5)*this.conf.ctx.canvas.height*6
				},
				over :{
					x: (i % (this.conf.imgData.width*4) / 4)*this.conf.pixel + this.conf.x,
					y:(i / (this.conf.imgData.width*4)|0 )*this.conf.pixel + this.conf.y
				},
				rgb : "rgba("+this.conf.colorRgb[0]+","
							+this.conf.colorRgb[1]+","
							+this.conf.colorRgb[2]+","
							+this.conf.imgData.data[i+3]/80
							+')'
			};

			textData.distance = {
				x:textData.over.x - textData.start.x,
				y:textData.over.y - textData.start.y
			}
			
				textArr.push(textData);
		}

		this.conf.textArr = textArr;
	},
	drawImg:function(isClear){
		var newCtx = this.conf.ctx;
			newCtx.font = this.conf.pixel + 'px arial';
		var thisDraw = this;
			thisDraw.conf.time = 0;

		var animateFrame = function(){
			newCtx.clearRect(0,0,newCtx.canvas.width,newCtx.canvas.height);
			for(var i=0;i<thisDraw.conf.textArr.length;i++){
				if(isClear){
					var nowPosition = {
						x: thisDraw.easeIn(thisDraw.conf.time,
											thisDraw.conf.textArr[i].over.x,
											-thisDraw.conf.textArr[i].distance.x,
											thisDraw.conf.animateDuration)|0,
						y: thisDraw.easeIn(thisDraw.conf.time,
											thisDraw.conf.textArr[i].over.y,
											-thisDraw.conf.textArr[i].distance.y,
											thisDraw.conf.animateDuration)|0
					};
				}else{
					var nowPosition = {
						x: thisDraw.easeOut(thisDraw.conf.time,
											thisDraw.conf.textArr[i].start.x,
											thisDraw.conf.textArr[i].distance.x,
											thisDraw.conf.animateDuration)|0,
						y: thisDraw.easeOut(thisDraw.conf.time,
											thisDraw.conf.textArr[i].start.y,
											thisDraw.conf.textArr[i].distance.y,
											thisDraw.conf.animateDuration)|0
					};
				}
				
				newCtx.fillStyle = thisDraw.conf.textArr[i].rgb;
				newCtx.fillStyle = thisDraw.conf.textArr[i].rgb;
				newCtx.fillText(thisDraw.conf.textArr[i].content,nowPosition.x,nowPosition.y);
			};

			thisDraw.conf.time += thisDraw.conf.frame;

			if(thisDraw.conf.time > thisDraw.conf.animateDuration){
				thisDraw.fun && thisDraw.fun.call(thisDraw);
				isClear && newCtx.clearRect(0,0,newCtx.canvas.width,newCtx.canvas.height);
				thisDraw.fun = null;
				return;
			}

			setTimeout(animateFrame, thisDraw.conf.frame);
		}
		animateFrame();
	},
	clearImg:function(fun){
		this.fun = fun;
		if(this.conf){
			this.drawImg(true)
		}else{
			drawText.drawImg(true);
		}
	},
	callBack:function(fun){
		this.fun = fun ;
	},
	/*tween 缓动算法*/
	easeOut: function(t,b,c,d){
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeIn: function(t,b,c,d){
        return c*(t/=d)*t*t*t + b;
    },
    easeInOut: function(t,b,c,d){
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    }
}