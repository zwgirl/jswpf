// main.js
//require([ 'math' ], function(math) {
//	alert(math.add(1, 1));
//});

require(['domReady'], function (doc){
	// called once the DOM is ready
	alert("doc ready!");
	var input=document.createElement("input");
	input.type="text";
	input.value="212121";
	document.body.appendChild(input);
});