AC.Utils = AC.Utils || {};

AC.Utils.textToHTML = function( text ) {

	return text
		.replace(/\[name\]/g, '<div class="name">')
		.replace(/\[\/name\]/g, '</div>')
		.replace(/\[url\(/g, '<a href="')
		.replace(/\)\]/g, '" target="_blank">')
		.replace(/\[\/url\]/g, '</a>')
		.replace(/\[br\]/g, '<br/>');


};

AC.Utils.formatNews = function( text ) {

	return text
		.replace(/\[date\]/g, '<span class="date">')
		.replace(/\[\/date\]/g, '</span>')
		.replace(/\[title\]/g, '<span class="title">')
		.replace(/\[\/title\]/g, '</span>')
		.replace(/\[url\(/g, '<a href="')
		.replace(/\)\]/g, '" target="_blank">')
		.replace(/\[\/url\]/g, '</a>')
		.replace(/\[br\]/g, '<br/>');
};

AC.Utils.createCookie = function(name,value,days) {

	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	document.cookie = name+"="+value+expires+"; path=/";
};

AC.Utils.readCookie = function(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
};

AC.Utils.eraseCookie = function(name) {
	AC.Utils.createCookie(name,"",-1);
};