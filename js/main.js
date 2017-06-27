function get(selector, obj) {
	if (!obj) {
		return document.querySelectorAll(selector);
	} else {
		return obj.querySelectorAll(selector);
	}
}

function getTarget() {
	return window.event.target || window.event.srcElement;
}
window.onscroll = function() {
	var wHeight = document.documentElement.clientHeight;
	var surveySec = get('.survey-sec')[0];
	if (document.body.scrollTop > wHeight / 4) {
		surveySec.style.display = 'block';
	} else {
		surveySec.style.display = 'none';
	}
	var oLi = get('aside li')[3];
	if (document.body.scrollTop > wHeight / 4) {
		oLi.style.display = 'block';
	} else {
		oLi.style.display = 'none';
	}
}
window.onload = function() {
	var picUrl = "img/banner1.jpg|img/banner2.png|img/banner3.jpg".split('|');
	var cf1 = new CarouseFigure();
	var cfs = new Array();
	cf1.autoSize = true;
	cf1.imgLeft = true;
	cf1.init(get('.carouse-figure')[0], picUrl, 'step', true);
	initDesignerShow(cfs);
	initMainNav('.main-nav', 'li', 0);
	initMainNav('.designer-nav', 'a');
	initOrg();
	initGallery();
	initStatSec();
	initSideBar();
	initSurveySec();
	initSearchBox();
}

function initSearchBox() {
	var oSel = get('.search-box select')[0];
	oSel.onmouseenter = oSel.onmouseleave = function() {
		this.click();
	}
}

function setCurrent(target, navItems, exceptIndx) {
	var node;
	navItems.forEach(function(val, i, arr) {
		if (i == exceptIndx) {
			return;
		}
		arr[i].className = arr[i].className.replace(/current/g, ' ').replace(/\s{2}/g, ' ');
	});
	if (target.tagName.toLowerCase() == 'a') {
		node = target.parentNode;
	} else {
		node = target;
	}
	node.className += ' current';
}

function toggle(arr, index, exceptIndx) {
	for (var i = 0; i < arr.length; i++) {
		if (i == exceptIndx) {
			continue;
		}
		arr[i].style.display = 'none';
	}
	if (arr[index]) {
		arr[index].style.display = 'block';
	}
}

function initMainNav(sec, targetTagName, exceptIndx) {
	var flag = false;
	if (exceptIndx == undefined) {
		exceptIndx = -1;
	}
	var navItems = get(sec + '>ul>li');
	var navUl = get(sec + '>ul')[0];
	var aSubNavUl;
	if (targetTagName == 'li') {
		aSubNavUl = get(sec + '>ul>li>ul');
	} else if (targetTagName == 'a') {
		aSubNavUl = get(' .designer-show');
	}
	for (var i = 0; i < navItems.length; i++) {
		navItems[i].index = i;
	}
	navUl.addEventListener("mouseover", function() {
		var target = getTarget();
		if (target.tagName.toLowerCase() == targetTagName.toLowerCase()) {
			setCurrent(target, navItems, exceptIndx);
			if (targetTagName == 'a') {
				toggle(aSubNavUl, target.parentNode.index);
			} else {
				clearTimeout(aSubNavUl[target.index].timer);
				toggle(aSubNavUl, target.index, exceptIndx);
			}
		}
	}, false);
	if (targetTagName.toLowerCase() == 'li') {
		navUl.addEventListener("mouseout", function() {
			var target = getTarget();
			if (target.tagName.toLowerCase() == targetTagName.toLowerCase()) {
				if (i == exceptIndx) {
					return;
				}(function(target, targetTagName, aSubNavUl, exceptIndx) {
					target.timer = setTimeout(function() {
						if (target.tagName.toLowerCase() == targetTagName.toLowerCase() && target.index && exceptIndx != target.index) {
							target.className = target.className.replace(/current/g, '').replace(/\s{2}/g, '');
							aSubNavUl[target.index].style.display = 'none';
						}

					}, 500);
				})(target, targetTagName, aSubNavUl, exceptIndx);
			}
		}, false);
	}
	for (var i = 0; i < aSubNavUl.length; i++) {
		if (i == exceptIndx) {
			continue;
		}
		aSubNavUl[i].index = i;
		aSubNavUl[i].addEventListener('mouseenter', function() {
			var target = getTarget();
			clearTimeout(navItems[target.index].timer);
		}, false);
		aSubNavUl[i].addEventListener('mouseleave', function() {
			var target = getTarget();
			if (target.tagName.toLowerCase() != 'ul') {
				return;
			}(function(target, targetTagName, aSubNavUl, exceptIndx) {
				target.timer = setTimeout(function() {
					if (target.index && exceptIndx != target.index) {
						navItems[target.index].className = navItems[target.index].className.replace(/current/g, '').replace(/\s{2}/g, '');
						target.style.display = 'none';
					}

				}, 500);
			})(target, targetTagName, aSubNavUl, exceptIndx);
		}, false);
	}
}

function initOrg() {
	var aImg = get('.org-list>li');
	var timer = null;
	var maxWidth = 550;
	var minWidth = 200;
	var pre = aImg[0];
	var timer = null;
	aImg[0].style.width = '550px';
	aImg.forEach(function(val, i, arr) {
		arr[i].index = i;
		arr[i].onmouseover = function() {
			clearInterval(timer);
			var target = this;
			var flag = false;
			var cnt = 0;
			var stepLen = 2;
			timer = setInterval(function() {
				cnt = 0
				for (var i = 0; i < aImg.length; i++) {
					if (i == target.index) {
						continue;
					}
					if (aImg[i].offsetWidth <= minWidth) {
						flag = true;
					} else {
						aImg[i].style.width = aImg[i].offsetWidth - stepLen + 'px';
						flag = false;
						cnt += stepLen;
					}
				}
				if (target.offsetWidth >= maxWidth) {
					flag = true;
				} else {
					target.style.width = target.offsetWidth + cnt + 'px';
					flag = false;
				}
				if (flag) {
					for (var i = 0; i < aImg.length; i++) {
						if (i == target.index) {
							continue;
						}
						aImg[i].style.width = '200px';
					}
					target.style.width = "550px";
					clearInterval(timer);
					pre = target;
				}
			}, 4);
		}
	});
}

function initGallery() {
	var aTab = get('span', get('.gallery-sec .multi-title')[0]);
	var aBody = get('.gallery-sec .sec-body');
	for (var i = 0; i < aTab.length; i++) {
		if (aTab[i].className.indexOf('current') >= 0) {
			aBody[i].style.display = 'block';
		}
		aTab[i].index = i;
		aTab[i].onmouseenter = function() {
			for (var j = 0; j < aTab.length; j++) {
				if (j != this.index) {
					aBody[j].style.display = 'none';
				}
				aTab[j].className = aTab[j].className.replace(/current/g, '').replace(/\s{2}/g, ' ');
			}
			this.className += ' current';
			aBody[this.index].style.display = 'block';
		}
	}
}

function initDesignerShow(cfs) {
	var showDiv = get('.designer-show');
	for (var i = 0; i < showDiv.length; i++) {
		var tmp = showDiv[i].style.display;
		showDiv[i].index = i;
		showDiv[i].style.display = 'block';
		cfs[i] = new CarouseFigure();
		cfs[i].autoSize = true;
		cfs[i].ctrBtn[0] = get('.designer-ctr-btn-l')[i];
		cfs[i].ctrBtn[1] = get('.designer-ctr-btn-r')[i];
		cfs[i].init(get('.designer-show')[i], null, 'step', false, 'manual');
		showDiv[i].style.display = tmp;
	}
}

function initStatSec() {
	var cfs = [];
	var statList = get('.stat-list');
	for (var i = 0; i < statList.length; i++) {
		statList[i].index = i;
		statList[i].dis = -1;
		statList[i].innerHTML += statList[i].innerHTML;
		(function(obj) {
			obj.timer = setInterval(function() {
				if (obj.dis <= -obj.offsetHeight / 2) {
					obj.dis = 0;
				}
				obj.style.top = obj.dis + 'px';
				obj.dis -= 1;
			}, 50);
		})(statList[i]);

		statList[i].onmouseenter = function() {
			clearInterval(this.timer);
		}
		statList[i].onmouseleave = function() {
			clearInterval(this.timer);
			(function(obj) {
				obj.timer = setInterval(function() {
					if (obj.dis <= -obj.offsetHeight / 2) {
						obj.dis = 0;
					}
					obj.style.top = obj.dis + 'px';
					obj.dis -= 1;
				}, 50);
			})(this);
		}
	}
}

function scrollToTop() {
	var timer = setInterval(function() {
		if (document.body.scrollTop <= 0) {
			clearInterval(timer);
		}
		var speed = -Math.ceil(document.body.scrollTop / 70);
		document.body.scrollTop = speed + document.body.scrollTop;
		speed--;
	}, 4)
}

function initSideBar() {
	var sTop = document.body.scrollTop;
	var oLi = get('aside li')[3];
	if (sTop == 0) {
		oLi.style.display = 'none';
	}
}

function initSurveySec() {
	var sTop = document.body.scrollTop;
	var surveySec = get('.survey-sec')[0];
	var handPointer = get('.survey-sec .hand-pointer-up')[0];
	var oriTop = surveySec.style.bottom;
	var wHeight = document.documentElement.clientHeight;
	surveySec.onclick = function() {
		var target = getTarget();
		if (target.className != 'head-title' && target.className.indexOf('hand-pointer') == -1) {
			return;
		}
		if (this.style.bottom && parseInt(this.style.bottom) == 0) {
			this.style.bottom = oriTop;
			setTimeout(function() {
				handPointer.className = 'hand-pointer-up';
			}, 1000);
		} else {
			this.style.bottom = '0';
			setTimeout(function() {
				handPointer.className = 'hand-pointer-down';
			}, 1000);
		}
	}
	if (sTop > wHeight / 4) {
		surveySec.style.display = 'block';
	} else {
		surveySec.style.display = 'none';
	}
}