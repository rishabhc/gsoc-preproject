$(document).ready(function(){
	$('.create').click(function(){
		var file_name = $('input').val();
		if(file_name == "") {
			alert("Please enter a file name");
			return;
		}
		$.ajax({
			method: "POST",
			url: '/create',
			data : {filename: file_name}
		}).done(function(data){
			$('.json-results').text(data);
		});
	});
});