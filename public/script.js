$(document).ready(function(){
	function getInputText(){
		var ret = {'error':false,'input':$('.search-file').val(),'query':$('.search-query').val(),'token':$('.token').val()};
		if(ret.input == "" || ret.token == "") {
			ret.error = true;
		}
		return ret;
	}

	function updateResults(data){
		$('.json-results').text(data);
	}

	$('.create').click(function(){
		var file = getInputText('.search-b');
		if(file.error)
			alert("Please enter a file name and a token");
		else {
			$.ajax({
				method: "POST",
				url: '/create',
				data : {filename: file.input, token:file.token}
			}).done(function(data){
				updateResults(data);
			});
		}
	});

	$('.read').click(function(){
		var formInput = getInputText('search-b');
		if(formInput.error)
			alert("Please enter a filename and a token");
		else {
			var url = '/read/'+formInput.token+'/'+formInput.input+'/'+formInput.query;
			$.ajax({
				method: "GET",
				url: url
			}).done(function(data){
				updateResults(data);
			});
		}
	});

	$('.update').click(function(){
		var formInput = getInputText('search-b');
		if(formInput.error)
			alert("Please enter a filename and a token");
		else {
			var url = '/update/'+formInput.token+'/'+formInput.input+'?'+formInput.query;
			
			$.ajax({
				method: "GET",
				url: url
			}).done(function(data){
				updateResults(data);
			});
		}
		
	});

	$('.delete').click(function(){
		var formInput = getInputText('search-b');
		if(formInput.error)
			alert("Please enter a filename and a token");
		$.ajax({
			method: "POST",
			url: '/delete',
			data : {filename: formInput.input,token:formInput.token}
		}).done(function(data){
			updateResults(data);
		});
	});

	$('.token-generator').click(function(){
		updateResults('Generating token...');
		var name = prompt('Please enter your name');
		if(name != null) {
			$.ajax({
				method: "POST",
				url: '/secret',
				data : {name: name}
			}).done(function(data){
				if(!data.error)
				 $('.token').val(data.token);
				updateResults(data.message);
			});
		}
		else {
			updateResults('Token generation failed. You did not enter a name');
		}
	});
});