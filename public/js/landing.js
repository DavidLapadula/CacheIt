


$(document).ready(function () {

	// Selectors for the floating icon and background that it shows when clickced
	let aboutDiv = $('#about-div');
	let landingQMark = $('#landing-qMark');

	// Hide the side-drop about div whwnever the page loads
	aboutDiv.hide();

	//'About' div toggle when question mark pressed
	landingQMark.click(function () {
		aboutDiv.animate({
			height: 'toggle'
		});
		if ($('#landing-page-br').css('filter') === 'blur(5px)') {
			$('#landing-page-br').css('filter', 'blur(0px)');
		} else {
			$('#landing-page-br').css('filter', 'blur(5px)');
		}
	});
 

});




