function gup(name, url) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	let regexS = "[\\?&]" + name + "=([^&#]*)";
	let regex = new RegExp(regexS);
	let results = regex.exec(url);
	return results == null ? null : results[1];
}

let contain_message = document.getElementById('mention_conversation');
let img = "https://ice.icephone.id:8013/ApiBounty/ImageSave";
let img_feed = "https://ice.icephone.id:8013/ApiBounty/ImageSaveFeed";
let img_profile = "https://ice.icephone.id:8013/ApiBounty/ImageSaveProfile";

$(document).ready(function () {
	// let userid = gup('userid', location.search);
	let userid = getCookie("userid");
	$('#AgentName').val(userid);
	
});

//koneksi signalr
$.connection.hub.url = "https://ice.icephone.id:8013/signalR_ty1/signalr";
let chat = $.connection.serverHub;
// console.log(chat);


$(function () {

	//set login profile
    chat.client.ReturnLoginAgent = function (AgentID, Agent_name, message) {
		// alert("oke");FAILED
		let msg = message.substr(0,6);
		if(msg === "FAILED"){
			notify('error', 'Chat Not Ready.', message);
			/* $.toast({
				heading: 'Not Ready.',
				text: '<p>'+message+'</p>',
				position: 'bottom-left',
				loaderBg:'#d90000',
				class: 'jq-toast-danger',
				hideAfter: 3500, 
				stack: 6,
				showHideTransition: 'fade'
			}); */
		}		
    }
	
	chat.client.ReturnPusher_Que_sosmed_FBMention = function (Type, ChatID, CustID, CustName, AgentID, AgentName, Message, RoomID, imgBase, AlamatIP, AssignTo) {
		//list post
		ListMention();
		// notify('facebook', CustName, Message);
		PushNotification(CustName,Message,ChatID,'facebook.png');	
		
		let d = new Date();
        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
		let icon,content = "";
		
		SoundControl.getInstance().playSound("MESSAGE");
		
		if (Type == "True") {
			// pesan chat masuk di ui pisahin berdasarkan id customer masing2
			if(CustID == $('#CustID').val()){
				let html = '<li class="media received">'+
					'<div class="avatar">'+
						'<img src="'+img_profile+'/'+CustID+'.jpg" alt="user" class="avatar-img rounded-circle">'+
					'</div>'+
					'<div class="media-body">'+
						'<div class="msg-box">'+
							'<div>'+
								'<p>' + Message + '</p>'+
								'<span class="chat-time">'+h+':'+m+'</span>'+
								'<div class="arrow-triangle-wrap">'+
									'<div class="arrow-triangle right"></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</li>';
				
				$("#CustID").val(CustID);
				$("#CustName").val(CustName);
				$('#mention_conversation').append(html);
				$(".nicescroll-bar").animate({
					scrollTop: contain_message.scrollHeight
				}, "fast");
			}
			else{}
		}
	
	};
	
	chat.client.ReturnPusher_Que_sosmed_TWMention = function (Type, ChatID, CustID, CustName, AgentID, AgentName, Message, RoomID, imgBase, AlamatIP, AssignTo) {
		//list post
		ListMention();
		// notify('twitter', CustName, Message);
		PushNotification(CustName,Message,ChatID,'twitter.png');	
		
		let d = new Date();
        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
		let icon,content = "";
		
		SoundControl.getInstance().playSound("MESSAGE");
		
		if (Type == "True") {
			// pesan chat masuk di ui pisahin berdasarkan id customer masing2
			if(CustID == $('#CustID').val()){
				let html = '<li class="media received">'+
					'<div class="avatar">'+
						'<img src="'+img_profile+'/'+CustID+'.jpg" alt="user" class="avatar-img rounded-circle">'+
					'</div>'+
					'<div class="media-body">'+
						'<div class="msg-box">'+
							'<div>'+
								'<p>' + Message + '</p>'+
								'<span class="chat-time">'+h+':'+m+'</span>'+
								'<div class="arrow-triangle-wrap">'+
									'<div class="arrow-triangle right"></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</li>';
				
				$("#CustID").val(CustID);
				$("#CustName").val(CustName);
				$('#mention_conversation').append(html);
				$(".nicescroll-bar").animate({
					scrollTop: contain_message.scrollHeight
				}, "fast");
			}
			else{}
		}
	
	};

		
	
    $.connection.hub.start().done(function () {
        $("#AgentID").val($.connection.hub.id);
		
		function LoginSignalR(){
			chat.server.loginAgent($('#AgentID').val(), $('#AgentName').val());
			chat.server.loginNotification($("#AgentID").val(),$("#AgentName").val()); //login notif
            $('#message').val('').focus();
			
		}

        setTimeout( function() {
			LoginSignalR();
			ListMention();
        }, 2000);
    });
});


function ListMention(){
	let url = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"ListMention",Data2:"'+$('#AgentName').val()+'",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}';
	
	fetch(url)
	.then((response) => response.json())
	.then((responseJson) => {
		let str = JSON.stringify(responseJson);
		let obj = JSON.parse(str);
		// console.log(obj.Raw);
		
		let html = "";
		let icon = "";
		let label = "";
		if (obj.Result == "True"){
			for (i = 0; i < obj.Raw.length; i++) {
				
				let aktif = "";
				if($("#ChatID").val() == obj.Raw[i].ChatID ){
					aktif = "aktif";
					$("#CustID").val(obj.Raw[i].UserID); //set id ketika customer relogin
				}

				if (obj.Raw[i].AssignTo == "FBMention"){
					icon = "facebook.png";
					label = "FB Mention";
				}
				else if (obj.Raw[i].AssignTo == "TWMention"){
					icon = "twitter.png";
					label = "TW Mention";
				}
				else{
					icon = "";
				}
				
				html += "<a href='javascript:void(0)' class='media read-chat "+aktif+"' onclick='selectMention(\"" + obj.Raw[i].UserID + "\",\"" + obj.Raw[i].Nama +
					"\",\"" + obj.Raw[i].ChatID +"\",\"" + obj.Raw[i].AssignTo +"\",\"" + obj.Raw[i].PageID +"\")'>"+
					'<div class="media-img-wrap">'+
						'<div class="avatar"><img src="'+img_profile+'/'+obj.Raw[i].UserID+'.jpg" class="avatar-img rounded-circle"></div>'+
					'</div>'+
					'<div class="media-body">'+
						'<div>'+
							'<div class="user-name">' + obj.Raw[i].Nama + '</div>'+
							'<div class="user-last-chat">' + obj.Raw[i].UserID + '</div>'+
						'</div>'+
						// '<div><div class="last-chat-time" id="'+obj.Raw[i].ChatID+'">'+label+'<span class="badge"><img src="dist/img/icon/'+icon+'" class="avatar-img rounded-circle" height="12" width="12"></span></div></div>'+
						'<div><div class="last-chat-time" id="'+obj.Raw[i].ChatID+'">'+obj.Raw[i].PageName+'<span class="badge"><img src="dist/img/icon/'+icon+'" class="avatar-img rounded-circle" height="12" width="12"></span></div></div>'+
					'</div>'+
				'</a>'+
				'<div class="chat-hr-wrap"><hr></div>';
			}
			$('#JmlLive').text(obj.Raw.length);
		}
		else{}
		
		$("#list_mention").html(""); //clear the tbody
		$('#list_mention').append(html); 
	

	})
	.catch((error) => {
		console.error(error);
	});
}
// setInterval(ListMention, 2000);


function commentMention(){
	let comment = "";
	let d = new Date();
	let h = addZero(d.getHours());
	let m = addZero(d.getMinutes());
	
	if($('#message').val() != ""){
		if($("#AssignTo").val() == "FBMention"){
			let message = $("#message").val();
			$.ajax({
				type: "GET",
				url: 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"LastData",Data2:"'+$("#ChatID").val()+'",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}',
				dataType: "JSON",
				success: function (res) {
					// console.log(res);

					let html = '<li class="media sent">'+
						'<div class="media-body">'+
							'<div class="msg-box">'+
								'<div>'+
									'<p>' + message + '</p>'+
									'<span class="chat-time">'+h+':'+m+'</span>'+
									'<div class="arrow-triangle-wrap">'+
										'<div class="arrow-triangle left"></div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</li>';
					
					$('#mention_conversation').append(html);
					$('#message').val('').focus();
					$(".nicescroll-bar").animate({
						scrollTop: contain_message.scrollHeight
					}, "fast");

					if(res.Result == "True"){
						let url = "https://ice.icephone.id:8013/ApiTeleport/Service1.svc/send_to_Tower?value={Raw:'',Data1:'"+ res.Raw[0].GroupID +"',Data2:'"+ res.Raw[0].RoomID +"',Data3:'"+message+"',Data4:'"+ $("#ChatID").val() +"',Data5:'"+ res.Raw[0].GroupID +"',Data6:'"+ $("#CustID").val() +"',Data7:'"+ $("#AgentName").val() +"',Data8:'"+ res.Raw[0].RoomID +"',Data9:'"+ res.Raw[0].AlamatIP +"',Data10:'FBMention'}";
						// console.log(url)

						$.ajax({
							type: 'GET',
							async: false,
							url: url,
							cache: false,
							success: function (obj) {
								console.log(obj);
							},
							error: function (xhr, ajaxOptions, thrownError) {
								console.log(thrownError);
							}
						});
					}

				}
			});
		}
		else if($("#AssignTo").val() == "TWMention"){
			let message = $("#message").val();
			$.ajax({
				type: "GET",
				url: 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"LastData",Data2:"'+$("#ChatID").val()+'",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}',
				dataType: "JSON",
				success: function (res) {
					// console.log(res);
					let html = '<li class="media sent">'+
						'<div class="media-body">'+
							'<div class="msg-box">'+
								'<div>'+
									'<p>' + message + '</p>'+
									'<span class="chat-time">'+h+':'+m+'</span>'+
									'<div class="arrow-triangle-wrap">'+
										'<div class="arrow-triangle left"></div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</li>';
					
					$('#mention_conversation').append(html);
					$('#message').val('').focus();
					$(".nicescroll-bar").animate({
						scrollTop: contain_message.scrollHeight
					}, "fast");

					if(res.Result == "True"){
						let url = "https://ice.icephone.id:8013/ApiTeleport/Service1.svc/send_pugna?value={Raw:'',Data1:'"+ $("#ChatID").val() +"',Data2:'"+ res.Raw[0].IDJenisChat +"',Data3:'"+ res.Raw[0].AlamatIP +"',Data4:'"+ message +"',Data5:'"+ $("#PageID").val() +"',Data6:'"+ $("#CustID").val() +"',Data7:'"+ $("#AgentName").val() +"',Data8:'"+ res.Raw[0].RoomID +"',Data9:'"+ res.Raw[0].AlamatIP +"',Data10:'TWMention'}";

						$.ajax({
							type: 'GET',
							async: false,
							url: url,
							cache: false,
							success: function (obj) {
								console.log(obj);
							},
							error: function (xhr, ajaxOptions, thrownError) {
								console.log(thrownError);
							}
						});
					}

				}
			});

		}
		else{}
        
	}else{
		$('#message').focus();
	}
	$("#message").val("");
}


function selectMention(CustID, custName,ChatID,AssignTo,RoomID,PageID) {
    $("#CustID").val(CustID);
    $("#ChatID").val(ChatID);
    $("#AssignTo").val(AssignTo);
    $("#RoomID").val(RoomID);
    $("#PageID").val(PageID);
    $('#message').val('').focus();
	
	ListMention();
	
	
	$("img[name=img_user]").attr('src', img_profile+'/'+CustID+'.jpg');
	$("div[name=CustName]").text(custName);
    $("div[name=CustID]").text(CustID);

    $(".chat_aktif").removeClass("hide").show();
    $(".chat_option").removeClass("hide").show();
    $("#form_send").removeClass("hide").show();
	
	//load conversation
	MentionConversation(ChatID);

	//read notif from notif.js
	ReadNotif(ChatID);

}

function MentionConversation(ChatID){
	let url_conversation = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"MentionConversation",Data2:"'+ChatID+'",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}';
	
	return fetch(url_conversation)
	.then((response) => response.json())
	.then((responseJson) => {
		let str = JSON.stringify(responseJson);
		let obj = JSON.parse(str);
		// console.log(obj);
		
		let text = "";
		$("#mention_conversation").html(""); //clear the tbody
		
        if (obj.Result == "True") {
            let raw = obj.Raw;

            for (i = 0; i < raw.length; i++) {
               
                if(raw[i].FlagTo == "Cust"){
					text += '<li class="media received">'+
						'<div class="avatar">'+
							'<img src="'+img_profile+'/'+obj.Raw[i].UserID+'.jpg" alt="user" class="avatar-img rounded-circle">'+
						'</div>'+
						'<div class="media-body">'+
							'<div class="msg-box">'+
								'<div>'+
									'<p>' + raw[i].Pesan + '</p>'+
									'<span class="chat-time">'+raw[i].DateCreate+'</span>'+
									'<div class="arrow-triangle-wrap">'+
										'<div class="arrow-triangle right"></div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</li>';
				}
				else{
					text += '<li class="media sent">'+
						'<div class="media-body">'+
							'<div class="msg-box">'+
								'<div>'+
									'<p>' + raw[i].Pesan + '</p>'+
									'<span class="chat-time">'+raw[i].DateCreate+'</span>'+
									'<div class="arrow-triangle-wrap">'+
										'<div class="arrow-triangle left"></div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</li>';
                }
            }
			
        } else {}
        // $("#mention_conversation").html(""); //clear the tbody
        $('#mention_conversation').append(text);
		$(".nicescroll-bar").animate({
			scrollTop: contain_message.scrollHeight
		}, "fast");
		
	})
	.catch((error) => {
		console.error(error);
	});

}

async function endChat(){
	const ticket = await import('./module.ticket.sosmed.js');
	const data = JSON.stringify({CustID:$("#CustID").val(),CustName:$("div[name=CustName]").text(),ChatID:$("#ChatID").val(),Email:$("#Email").val(),AssignTo:$("#AssignTo").val()});
	const url = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"EndChatMention",Data2:"'+$("#ChatID").val()+'",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}';
	
	swal({
		title: "Are you sure?",
		text: "End this conversation?",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
	.then((end) => {
		if (end) {
			swal({
				title: "Success.",
				text: "Do want to create ticket?",
				icon: "success",
				buttons: ["Not Now", true],
			})
			.then((create) => {
				if (create) {
					//? createTicket();
					createTicket();
					// ticket.windowCreateTicket(data);
				}

				// todo send data
				fetch(url)
				.then((response) => response.json())
				.then((json) => {
					const str = JSON.stringify(json);
					const obj = JSON.parse(str);
					console.log(obj);
						
				})
				.catch((error) => {
					console.log(error);
				});

				$('#mention_conversation').html("");
				$(".chat_aktif").addClass("hide").hide();
				$(".chat_option").addClass("hide").hide();
				$("#form_send").addClass("hide").hide();
				ListMention();
			});
		}
	});
}

async function InformationCustomer(){
	const data = JSON.stringify({CustID:$("#CustID").val(),CustName:$("div[name=CustName]").text(),ChatID:$("#ChatID").val(),Email:$("#Email").val(),AssignTo:$("#AssignTo").val()});
	const info = await import('./module.information.js');
	info.windowInformation(data);
}


function createTicket(){
    // alert($("#ChatID").val());
	let w = "200";
    let h = "400";
    let left = (screen.width/2)-(w/2);
    let top = (screen.height/2)-(h/2);
	// let userid = gup('id', location.search);
	let userid = getCookie("userid");
    
	// newwindow=window.open("../addticketchat.aspx?ket=chat&id="+$("#ChatID").val()+"&cid="+$("#ChatID").val()+"&agentid="+userid+"&email="+$("#Email").val(),'width=1000px,Height=700px,toolbar=0,menubar=0,location=0,top='+top+',left='+left);
	newwindow=window.open("https://ice.icephone.id:7021/HTML/tr_utama.aspx?ket=chat&id="+$("#ChatID").val()+"&cid="+$("#ChatID").val()+"&agentid="+userid+"&email="+$("#Email").val(),'width=1000px,Height=700px,toolbar=0,menubar=0,location=0,top='+top+',left='+left);
	
}


function encodeImageFileAsURL(element) {
	let file = element.files[0];
	let reader = new FileReader();
	let size = file.size;
	
	//console.log(size);
	if(size >= 1000000){
				
		let message = '<li class="media sent">'+
			'<div class="media-body">'+
				'<div class="msg-box">'+
					'<div>'+
						'<p> File tidak bisa lebih dari 2MB. </p>'+
						'<div class="arrow-triangle-wrap">'+
							'<div class="arrow-triangle left"></div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</li>';
		
		$('#mention_conversation').append(message);
		$('#message').val('').focus();
		$(".nicescroll-bar").animate({
			scrollTop: contain_message.scrollHeight
		}, "fast");
		
		//reset ulang
		clearFile();
		
	}else{
		reader.onloadend = function () {
			let solution = reader.result.split("base64,")[1];
			$("#Resultbase64").val(solution);
			$("#NameResultbase64").val(element.files[0].name);
			$("#message").val(element.files[0].name +" ("+ (size / 1000).toFixed(2) +" KB)");
			$("#SrcResultbase64").val(reader.result);
			//console.log(reader.result);
		}
		reader.readAsDataURL(file);
	}
}


function clearFile() {
	$("#Resultbase64").val("");
	$("#NameResultbase64").val("");
	$("#message").val("");
	$("#SrcResultbase64").val("");
}

function addZero(x) {
	if (x < 10) {
		x = "0" + x;
	}
	return x;
}
