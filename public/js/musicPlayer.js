var Player = {
	init:function(userConf){
		this.conf = {
			src : userConf.src,
			autoPlay : userConf.autoPlay || false,
			isLoop: userConf.isLoop || false
		}
		this.conf.item = 0;
		this.createDom();
		
	},
	createDom :function(){
		var audio = document.createElement('audio');
		var thisPlayer = this;
		audio.oncanplay = function(){
			console.log(333);
			thisPlayer.conf.autoPlay && audio.play();
			thisPlayer.conf.isLoop && audio.setAttribute('loop','loop');
			thisPlayer.audio = audio;
			thisPlayer.createButton();
			thisPlayer.addEvent();
		}

		audio.src = thisPlayer.conf.src[0];
		
	},
	createButton:function(){
		var button = document.createElement('div');
		button.setAttribute('class','player-button play');
		document.body.appendChild(button);
		this.button = button;
	},
	loadFile : function(src){
		this.conf.src = src;
		this.audio.src = this.conf.src[0];
		this.audio.play();
	},
	addEvent:function(){
		var thisPlayer = this;
		this.button.addEventListener('click',function(){
			var isPaused = thisPlayer.audio.paused;
			if(isPaused){
				thisPlayer.audio.play();
				this.setAttribute('class','player-button play');
			}else{
				thisPlayer.audio.pause();
				this.setAttribute('class','player-button pause');
			}
		});

		this.audio.addEventListener('ended',function(){
			thisPlayer.conf.item++;
			if(thisPlayer.conf.item >= thisPlayer.conf.src.length){
				thisPlayer.conf.item = 0;
			}
			this.src = thisPlayer.conf.src[thisPlayer.conf.item];
			thisPlayer.audio.play();
		});
	}
}