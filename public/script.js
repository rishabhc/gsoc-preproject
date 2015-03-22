$(document).ready(function(){
	function getInputText(){
		var ret = {'error':false,'input':$('input').val()};
		if(ret.input == "") {
			ret.error = true;
		}
		return ret;
	}

	function updateResults(data){
		$('.json-results').text(data);
	}

	$('.create').click(function(){
		var file = getInputText();
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
		var file = getInputText();
		if(file.error)
			alert("Please enter a file name");
		else {
			var url = '/read/'+file.input;
			$.ajax({
				method: "GET",
				url: url
			}).done(function(data){
				updateResults(data);
			});
		}
	})

	$('.update').click(function(){
		
	});

});