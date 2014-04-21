/**
 * EntryIndex
 */

define(["dojo/_base/declare", "my/SuperA"], function(declare, SuperA){
	var Enum = SuperA.prototype.Enum;
	alert("enum of baseclass : " + Enum.a);
	var EntryIndex = declare("EntryIndex", [SuperA],{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
			
			this.inherited(arguments, [false]);
			
//			internalSayHello();
			
			EntryIndex.SayHello(after);
			
			
			this.Age=count++;
			console.log("constructor getter:" + this.Age);
		}
	});
	
	Object.defineProperties(EntryIndex.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() {
				var t=new EntryIndex(10);
				alert("hehe i'm here!", t);
				return this._store & 0x7FFFFFFF; }
		},
		Age:{
			get:function(){
				console.log("execute here : Age get");
				return this.Name;
			},
			set:function(value){
				console.log("execute here : Age set: " + value);
				this.Name=value;
				this.Index=100;
			}
		},
		Name:{
			get:function(){
				console.log("execute here : Name get");
				return this.name;
			},
			set:function(value){
				console.log("execute here : Name set");
				this.name=value;
				this.Index=100;
			}
		}
	});
	
	var after = "after";
	
	EntryIndex._test="wqwqwqwqw";
	
	Object.defineProperties(EntryIndex,{
		Test:
		{
			get:function(){
				return this._test;
			},
			
//			set:function(value){
//				this._test = value;
//			}
		}
	});
	
	

	EntryIndex.SayHello=function(ttt){
		internalSayHello(ttt);
	};
	
	function internalSayHello(ttt){
		alert("i'm private static method: " + ttt);
	}
	
	var count=0;
	
	return EntryIndex;
});
