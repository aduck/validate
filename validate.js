/* 常用正则
	regEmail=/^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/ // email
	regPhone=/^(((1[0-9][0-9]{1}))+\d{8})$/  // 手机号
	regPwd=/^[a-z0-9_-]{6,18}$/  // 密码
*/
;(function(){

	var validate={};
	function checkAll(arr){
		for(var i=0,len=arr.length;i<len;i++){
			var item=document.getElementById(arr[i]['id']),
				val=typeof String.prototype.trim !='undefined' ? item.value.trim() : item.value.replace(/(^\s*)|(\s*$)/g,""),
				rules=arr[i]['rules'],
				title=arr[i]['title'],
				res=check(val,title,rules);
			if(res.error) return res;
		}
		return {"error":0};
	}

	/*
	*	rule类型: required RegExp Function 
	*/
	function check(val,title,rules){
		for(var i=0,len=rules.length;i<len;i++){
			var rule=rules[i];
			if(rule=='required'){
				if(val==''){
					return {"error":1,"title":title,"msg":"不能为空"};
				}
			}else if(rule instanceof RegExp){  // 正则
				if(!rule.test(val)){
					return {"error":1,"title":title,"msg":"不符合规则"};
				}
			}else if(typeof rule=='function'){  // 函数，务必返回值
				if(!rule(val)){
					return {"error":1,"title":title,"msg":"不符合规则"};
				}
			}	
		}
		return {"error":0};
	}

	function addEvent(o,type,callback){
		if(o.addEventListener){
			o.addEventListener(type,callback,false);
		}else if(o.attachEvent){
			o.attachEvent('on'+type,callback);
		}
	}

	validate.init=function(opts){
		var opts=opts || {};
			formId=opts.formId || "",
			checkArr=opts.checkArr || [],
			success=opts.success || null,
			fall=opts.fall || null;
		var form=document.getElementById(formId);
		addEvent(form,'submit',function(e){
			var e=e || window.event;
			if(e.preventDefault){
				e.preventDefault();
			}else{
				e.returnValue=false;
			}
			var res=checkAll(checkArr);
			if(!res.error){
				if(success) success();
				form.submit();
			}else{
				fall(res);
			}
		});
		for(var i=0;i<checkArr.length;i++){
			var item=document.getElementById(checkArr[i].id),
				title=checkArr[i].title,
				rules=checkArr[i].rules,
				val,res;
			(function(item,title,rules){
				addEvent(item,'blur',function(e){
					val=typeof String.prototype.trim !='undefined' ? item.value.trim() : item.value.replace(/(^\s*)|(\s*$)/g,"");
					res=check(val,title,rules);
					if(res.error){
						fall(res);
					}
				})
			})(item,title,rules);
		}
	}

	window.validate=validate;
})();
