$(document).ready(function(){
	function getInputText(){
		var ret = {'error':false,'input':$('.search-file').val(),'query':$('.search-query').val()};
		if(ret.input == "") {
			ret.error = true;
		}
		return ret;
	}

	function updateResults(data){
		$('.json-results').text(data);
	}

	$('.create').click(function(){
		var file = getInputText('.search-a');
		if(file.error)
			alert("Please enter a file name");
		else {
			$.ajax({
				method: "POST",
				url: '/create',
				data : {filename: file.input}
			}).done(function(data){
				updateResults(data);
			});
		}
	});

	$('.read').click(function(){
		var formInput = getInputText('search-b');
		if(formInput.error)
			alert("Please enter a filename");
		else {
			var url = '/read/'+formInput.input+'/'+formInput.query;
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
			alert("Please enter a filename");
		else {
			var url = '/update/'+formInput.input+'?'+formInput.query;
			
			$.ajax({
				method: "GET",
				url: url
			}).done(function(data){
				updateResults(data);
			});
		}
		
	});

	$('.delete').click(function(){
		var file = getInputText('.search-a');
		$.ajax({
			method: "POST",
			url: '/delete',
			data : {filename: file.input}
		}).done(function(data){
			updateResults(data);
		});
	});
});