AC.Utils = AC.Utils || {};

AC.Utils.textToHTML = function( text ) {

	return text
		.replace(/\[url\(/g, '<a href="')
		.replace(/\)\]/g, '" target="_blank">')
		.replace(/\[\/url\]/g, '</a>')
		.replace(/\[br\]/g, '<br/>');
};