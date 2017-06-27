		function CarouseFigure() {
			this.cfWidth = 500; //默认宽度
			this.cfHeight = 100; //默认高度
			this.autoSize = true; //是否自动大小
			this.dis = 1; //步进长度
			this.duration = 20; //动画间隔时间
			this.oDiv;
			this.oUl;
			this.aLi;
			this.aDot;
			this.scrollLen = 0;
			this.widthOrHeight = 'Width';
			this.leftOrTop = 'left';
			this.direction = -1;
			this.float = 'left';
			this.timer;
			this.actWidth = 0;
			this.actHeight = 0;
			this.imgReadyCnt = 0;
			this.imgLeft = false;
			this.ulWidth = 0;
			this.maxHeight = 0;
			this.computedHeight = 0;
			this.maxWidth = 0;
			this.index;
			this.noDot = false; //是否需要焦点
			this.autoScoll = 'auto'; //是否自动轮播
			this.ctrBtn = [];
			this.init = function(oDiv, picUrl, type, picWidthLink, autoScoll) {
				var target = this;
				var oDiv;
				var oUl;
				var oDotUl;
				var aLi;
				var aDot;
				this.autoScoll = autoScoll;
				if (autoScoll == 'manual' && this.ctrBtn.length > 0) {
					this.ctrBtn[0].onclick = function() {
						target.setPositive();
						target.stepScroll();
					}
					this.ctrBtn[1].onclick = function() {
						target.setNegetive();
						target.stepScroll();
					}
				}
				if (picUrl == null) {
					oUl = oDiv.getElementsByTagName('ul')[0];
					aLi = oUl.getElementsByTagName('li');
					this.noDot = true;
				} else {
					oUl = document.createElement('ul');
					oDotUl = document.createElement('ul');
					this.oDotUl = oDotUl;
					aLi = new Array(picUrl.length);
					aDot = new Array(picUrl.length);
					oDiv.appendChild(oDotUl);
				}
				this.oUl = oUl;
				this.oDiv = oDiv;
				oDiv.style.visibility = 'hidden';
				oDiv.appendChild(oUl);
				if (picUrl != null) {
					for (var i = 0; i < picUrl.length; i++) {
						var oLi = document.createElement('li');
						oLi.style.backgroundPosition = 'center';
						oLi.style.listStyle = 'none';
						oLi.style.float = this.float;
						oLi.style.padding = '0';
						oLi.style.margin = '0';
						oUl.appendChild(oLi);
						aLi[i] = oLi;
					}
				}
				oDiv.style.width = this.cfWidth + 'px';
				oDiv.style.height = this.cfHeight + 'px';
				oDiv.style.position = 'relative';
				oDiv.style.overflow = 'hidden';
				this.aLi = aLi;
				if (picUrl != null) {
					var oImg;
					var oA;
					for (var i = 0; i < picUrl.length; i++) {
						aDot[i] = document.createElement('li');
						aDot[i].style.borderRadius = "50%";
						aDot[i].style.border = "1px solid #fff";
						aDot[i].style.width = '15px';
						aDot[i].style.height = '15px';
						aDot[i].style.float = 'left';
						aDot[i].style.margin = '5px';
						aDot[i].style.background = "rgba(0,0,0,.3)";
						aDot[i].index = i;
						oDotUl.appendChild(aDot[i]);
						aDot[i].onmouseenter = function() {
							target.stop();
							this.style.cursor = 'pointer';
							for (var i = 0; i < aDot.length; i++) {
								aDot[i].style.background = 'rgba(0,0,0,.3)';
							}
							this.style.background = '#fff';
							if (!target.imgLeft) {
								target.scrollLen = -this.index * target.dis;
								oUl.style['left'] = -this.index * target.dis + 'px';
							} else {
								target.scrollLen = -this.index * target.dis + target.imgLeft;
								oUl.style['left'] = -this.index * target.dis + target.imgLeft + 'px';
							}
						}
						aDot[i].onmouseleave = function() {
							this.style.cursor = 'default';
							target.setNegetive();
							target.timer = setInterval(function() {
								target.scroll()
							}, target.duration);
						}
						oImg = document.createElement('img');
						oImg.src = picUrl[i];
						oImg.target = this;
						oImg.onload = function() {
							this.target.ulWidth += this.offsetWidth;
							this.target.computedHeight += this.offsetHeight;
							this.target.maxHeight = this.offsetHeight > this.target.maxHeight ? this.offsetHeight : this.target.maxHeight;
							this.target.maxWidth = this.offsetWidth > this.target.maxWidth ? this.offsetWidth : this.target.maxWidth;
							this.target.imgReadyCnt++;
						}
						if (picWidthLink) {
							oA = document.createElement('a');
							oA.href = "javascript:void(0);";
							oA.appendChild(oImg);
							aLi[i].appendChild(oA);
						} else {
							aLi[i].appendChild(oImg);
						}
					}
					this.aDot = aDot;
					aDot[0].style.background = '#fff';
					var readyTimer = setInterval(checkImgReady, 10);
				} else {
					for (var i = 0; i < aLi.length; i++) {
						this.ulWidth += aLi[i].offsetWidth;
						this.computedHeight += aLi[i].offsetHeight;
						this.maxHeight = aLi[i].offsetHeight > this.maxHeight ? aLi[i].offsetHeight : this.maxHeight;
						this.maxWidth = aLi[i].offsetWidth > this.maxWidth ? aLi[i].offsetWidth : this.maxWidth;
					}
					this.maxWidth += aLi[0].offsetLeft;
					this.ulWidth += aLi[0].offsetLeft * aLi.length;
					imgReady();
				}

				function checkImgReady() {
					if (target.imgReadyCnt == target.aLi.length) {
						clearInterval(readyTimer);
						readyTimer = null;
						imgReady();
					}
				}

				function imgReady() {
					if (target.autoSize) {
						target.oDiv.style.width = target.ulWidth + 'px';
						target.oDiv.style.height = target.maxHeight + 'px';
					} else {
						target.oDiv.style.width = target.cfWidth + 'px';
						target.oDiv.style.height = target.cfHeight + 'px';
					}
					target.actWidth = target.ulWidth;
					target.actHeight += target.offsetHeight;
					oUl.style.position = 'absolute';
					oUl.style.width = 2 * target.ulWidth + 'px';
					oUl.style.padding = '0';
					oUl.style.margin = '0';
					oUl.innerHTML += oUl.innerHTML;
					target.oDiv.style.visibility = 'visible';

					if (target.imgLeft) {
						target.imgLeft = -Math.round(Math.abs((target.maxWidth - document.documentElement.clientWidth) / 4));

						oDotUl.style = 'position:absolute;left:750px;z-index:10;bottom:10px;margin-left:' + (target.imgLeft) + 'px;';
						target.scrollLen = target.imgLeft;
					}
					if (type == 'step') {
						target.dis = target.maxWidth;
						target.duration = 2000;
					}
					if (autoScoll != 'manual') {
						target.timer = setInterval(function() {
							target.scroll()
						}, target.duration);
					}
				}
			}
			this.stop = function() {
				clearInterval(this.timer);
				this.timer = null;
			}
			this.setPositive = function() {
				clearInterval(this.timer);
				this.direction = 1;
			}
			this.setNegetive = function() {
				clearInterval(this.timer);
				this.direction = -1;
			}
			this.initEngine = function() {

			}
			this.scroll = function() {
				this.scrollLen += this.direction * this.dis;
				this.oUl.style[this.leftOrTop.toLowerCase()] = this.scrollLen + 'px';

				if (!this.imgLeft) {
					if (this.scrollLen <= -this.oUl['offset' + this.widthOrHeight] / 2) {
						this.scrollLen = 0;
					} else if (this.scrollLen >= 0) {
						this.scrollLen = -this.oUl['offset' + this.widthOrHeight] / 2;
					}
				} else {
					if (this.scrollLen <= -this.oUl['offset' + this.widthOrHeight] / 2) {
						this.scrollLen = this.imgLeft;
					} else if (this.scrollLen >= 0) {
						this.scrollLen = -this.oUl['offset' + this.widthOrHeight] / 2 + this.imgLeft;
					}
				}
				if (!this.noDot) {
					for (var i = 0; i < this.aDot.length; i++) {
						this.aDot[i].style.background = 'rgba(0,0,0,.3)';
					}

					if (!this.imgLeft) {
						this.index = Math.ceil(Math.abs(this.scrollLen / this.dis));
					} else {
						this.index = Math.ceil(Math.abs((this.scrollLen - this.imgLeft) / this.dis));
					}
					this.aDot[this.index].style.background = '#fff';
				}
			}
			this.stepScroll = function() {
				this.scrollLen += this.direction * this.dis;
				this.oUl.style[this.leftOrTop.toLowerCase()] = this.scrollLen + 'px';
				if (this.scrollLen <= -this.oUl['offset' + this.widthOrHeight] / 2) {
					this.scrollLen = 0;
				} else if (this.scrollLen == 0) {
					this.scrollLen = -this.oUl['offset' + this.widthOrHeight] / 2;
				} else if (this.scrollLen > 0) {
					this.scrollLen = -this.oUl['offset' + this.widthOrHeight] / 2;
					this.scrollLen += this.direction * this.dis;
					this.oUl.style[this.leftOrTop.toLowerCase()] = this.scrollLen + 'px';
				}
				if (!this.noDot) {
					for (var i = 0; i < this.aDot.length; i++) {
						this.aDot[i].style.background = 'rgba(0,0,0,.3)';
					}
					this.index = Math.ceil(Math.abs(this.scrollLen / this.dis));
					this.aDot[this.index].style.background = '#fff';
				}
			}
		}