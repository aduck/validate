/* 常用正则
	regEmail=/^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/ // email
	regPhone=/^(((1[0-9][0-9]{1}))+\d{8})$/  // 手机号
	regPwd=/^[a-z0-9_-]{6,18}$/  // 密码
*/
;(function(){

	var validate={};
	function checkAll(arr){
		for(var i=0,len=arr.length;i<len;i++){
			res=check(arr[i]);
			if(res.error) return res;
		}
		return {"error":0};
	}

	// trim
	function trim(str){
		return str.trim ? str.trim() : str.replace(/(^\s*)|(\s*$)/g,"")
	}

	/*
	*	rule类型: required RegExp Function 
	*/
	function check(item){
		var id=item.id
		var val=trim(document.getElementById(id).value)
		var title=item.title
		var rules=item.items
		for(var i=0,len=rules.length;i<len;i++){
			var rule=rules[i]['rule'];
			var msg=rules[i]['err'] || '不符合规则'
			if(rule=='required'){
				if(val==''){
					return {"error":1,"id":id,"msg":title+msg};
				}
			}else if(rule instanceof RegExp){  // 正则
				if(!rule.test(val)){
					return {"error":1,"id":id,"msg":title+msg};
				}
			}else if(typeof rule=='function'){  // 函数，务必返回值
				if(!rule(val)){
					return {"error":1,"id":id,"msg":title+msg};
				}
			}	
		}
		return {"error":0};
	}

	// event
	function addEvent(o,type,callback){
		if(o.addEventListener){
			o.addEventListener(type,callback,false);
		}else if(o.attachEvent){
			o.attachEvent('on'+type,callback);
		}
	}

	// init
	validate.init=function(opts){
		var opts=opts || {},
			formId=opts.formId || "",
			checkArr=opts.checkArr || [],
			submit=opts.submit || 0,
			success=opts.success || null,
			pass=opts.pass || null,
			fall=opts.fall || null;
		var formBox=document.getElementById(formId);
		addEvent(formBox,'submit',function(e){
			var e=e || window.event;
			if(e.preventDefault){
				e.preventDefault();
			}else{
				e.returnValue=false;
			}
			var res=checkAll(checkArr);
			if(res.error){
				fall(res)
			}else{
				if(submit){
					formBox.submit();
				}
				if(!!pass && typeof pass=='function') pass();  
			}
		});
		for(var i=0;i<checkArr.length;i++){
			var item=checkArr[i];
			var ipt=document.getElementById(item.id);
			(function(o){
				addEvent(ipt,'blur',function(e){
					res=check(o);
					if(res.error){
						fall(res);
					}else if(!!success && typeof success=='function'){
						success()
					}
				})
			})(item);
		}
	}

	window.validate=validate;
})();
