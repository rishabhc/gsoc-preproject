$(document).ready(function(){
	function getInputText(selector){
		if(selector == 'search-b') {
			var ret = {'error':false,'input':$('.search-file').val(),'query':$('.search-query').val()};
		}
		else {
			var ret = {'error':false,'input':$(selector + ' input').val()};
		}	
		if(ret.input == "") {
			ret.error = true;
		}
		return ret;
	}

	function makeActive(inputNumber){
		if(inputNumber == 1) {
			if($('.search-a').hasClass('hidden')) {
				$('.search-a').removeClass('hidden');
				$('.search-b').addClass('hidden');
			}
		}
		else {
			if($('.search-b').hasClass('hidden')) {
				$('.search-b').removeClass('hidden');
				$('.search-a').addClass('hidden');
			}
		}
	}

	function updateResults(data){
		$('.json-results').text(data);
	}

	$('.create').click(function(){
		if($('.search-a').hasClass('hidden')) {
			makeActive(1);
		}
		else {
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
		}
	});

	$('.read').click(function(){
		if($('.search-b').hasClass('hidden')) {
			makeActive(2);
		}
		else {
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
		}
	})

	$('.update').click(function(){
		// if($('.search-b').hasClass('hidden')) {
		// 	makeActive(2);
		// }
		// else {
		// 	var formInput = getInputText('search-b');
			
		// }
	});

	$('.delete').click(function(){
		if($('.search-a').hasClass('hidden')) {
			makeActive(1);
		}
		else {
			var file = getInputText('.search-a');
			$.ajax({
				method: "POST",
				url: '/delete',
				data : {filename: file.input}
			}).done(function(data){
				updateResults(data);
			});
		}
	});
});