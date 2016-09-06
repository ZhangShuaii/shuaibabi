/*	代码雨
	@启动  rain.init($canvas,seconds,callback);
	@param  $canvas canvas的jquery元素
			second为0时 时间无限长
			callback 动画完成时回调函数 可省略
	@autor  ZhangShuai
	@Date   2016.9.5
*/	
var rain = {
	fontSize :12, 
	bgc:'rgba(0,0,0,0.07)',
	fontColor:'#0f0',
	intervalTime:40,
	animateFrame : 0,

	initCanvas : function($canvas,seconds,callBack){
		this.fontsYPosionArr = [];
		this.cols =  $canvas.width() / this.fontSize;
		this.rows = $canvas.height() / this.fontSize;
		this.ctx = $canvas[0].getContext('2d');
		this.ctx.font = this.fontSize +'px arial';
		this.canvas = $canvas;

		for(var i=0;i<this.cols;i++){
			this.fontsYPosionArr[i] = Math.random()* this.rows | 0;
		}
		this.ctx.fillStyle = '#000';
		this.ctx.fillRect(0,0,$canvas.width(),$canvas.height());
		this.start(seconds,callBack);
	},

	//param 动画总时长，回调函数
	start : function(seconds,callBack){
		this.allTimes = seconds * 1000 / this.intervalTime ;
		this.loop();
		this.callBack = callBack || function(){};
	},
	
	//param 循环间隔 总次数 回调函数
	loop : function(){
		this.ctx.fillStyle = this.bgc;
		this.ctx.fillRect(0,0,$canvas.width(),$canvas.height());
		for(var i=0;i<this.cols;i++){
			if(Math.random()>0.95){
				this.ctx.fillStyle = '#fff';
			}else{
				this.ctx.fillStyle = this.fontColor;
			}
			var randomChar = String.fromCharCode(Math.random()*2000);
			this.ctx.fillText(randomChar , i*this.fontSize , this.fontsYPosionArr[i]* this.fontSize);
			this.fontsYPosionArr[i]++;
			if(this.fontsYPosionArr[i] > this.rows){
				this.fontsYPosionArr[i] = 0;
			}
		}

		this.animateFrame++;
			if(this.allTimes && this.animateFrame >= this.allTimes){
				this.callBack();
				return;
			}
		setTimeout("rain.loop()", this.intervalTime);
	}
}