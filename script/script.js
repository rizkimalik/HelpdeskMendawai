
gup = (name, url) => {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	let regexS = "[\\?&]" + name + "=([^&#]*)";
	let regex = new RegExp(regexS);
	let results = regex.exec(url);
	return results == null ? null : results[1];
}
const vuserid = gup('userid', location.search);
const indexUrl = window.location;

setCookie = (cname,cvalue) => {
	var d = new Date();
	d.setTime(d.getTime() + (30*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

getCookie = (cname) => {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

delCookie = ( cek ) => {
	// document.cookie = name + '= ; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	// window.parent.location.href = "../index.html";
	const cookie = document.cookie.split(';');

	for (let i = 0; i < cookie.length; i++) {

		let chip = cookie[i],
			entry = chip.split("="),
			name = entry[0];

		document.cookie = name + '= ; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	}
	window.parent.location.href = "../index.html";
}

deleteAllCookies = () => {
	const cookie = document.cookie.split(';');

	for (let i = 0; i < cookie.length; i++) {

		let chip = cookie[i],
			entry = chip.split("="),
			name = entry[0];

		document.cookie = name + '= ; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	}
	window.parent.location.href = indexUrl;
}

checkCookie = () => {
	var user = getCookie("userid");
	$('#display_agent').text(user);
	
	if(user == null || user == ""){
		// alert("Agent Login Kosong!!");
		window.parent.location.href = "../index.html";
	}
} 
checkCookie();

//! Push Notification WEB
function AskPermission() {
	try {
		Notification.requestPermission().then((obj) => {
			console.log(obj);
		});
	} 
	catch(e) {
		return false;
	}
	return true;
}
// AskPermission();

function PushNotification(Title,Body,Tag,Icon) {
	AskPermission();
	var options = {
		body: Body,
		icon: 'dist/img/icon/'+Icon,
		tag: Tag
	}
	var notif = new Notification(Title,options);

	notif.onclick = function(event) {
		event.preventDefault(); 
		// location.href = "wa.aspx";
	}
}




