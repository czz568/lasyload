function lasyImg(top){
	var imgs = Array.prototype.slice.call(document.getElementsByTagName('img'));
	this.imgs = imgs.filter(function(item,index){
		return item.dataset.src;//返回有data-src属性的img元素
	});
	this.top = top || 150;
	this.realFun = this.setSrc.bind(this);//由于this.setSrc事件要放在scroll等监听事件中，会改变执行环境，所以要提前绑定lasyImg对象的this
	this.timer = null;//采用setTimeOut函数进行防抖处理
}
lasyImg.prototype = {
	
	init:function(){
		this.event();
	},
	setSrc:function(){
		clearTimeout(this.timer);
		var _this = this;
		this.timer = setTimeout(function(){//这里的this会指向windwo，所以需要提前引入
			if (_this.imgs.length===0) {//图片全部加载后清除滚动监听事件
				if (window.removeEventListener) {
					window.removeEventListener("scroll",_this.realFun);
				}else{
					window.detachEvent("onscroll",_this.realFun);
				}
			};
			for(var i = _this.imgs.length-1; i>=0; i--){
				if (document.documentElement.clientHeight+document.documentElement.scrollTop+_this.top>_this.imgs[i].offsetTop || _this.imgs[i].offsetTop<document.documentElement.clientHeight) {
					_this.imgs[i].src = _this.imgs[i].dataset.src;
					_this.imgs.splice(i,1); //注意这里用forEach遍历时不可以这样直接删除数据，因为数组还在遍历中时删除元素会导致index错乱，但是用for()降序遍历删除item是可以的
				}
			}
		},300);
		
	},

	event:function(){
		
		if (window.addEventListener) {
			window.addEventListener("load",this.realFun);
			window.addEventListener("scroll",this.realFun);
		}else{
			window.attachEvent('onload',this.realFun);
			window.attachEvent('onscroll',this.realFun);
		}
	}
};
new lasyImg().init();
