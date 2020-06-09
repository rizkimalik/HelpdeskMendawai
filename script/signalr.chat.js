function gup(name, url) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	const regexS = "[\\?&]" + name + "=([^&#]*)";
	const regex = new RegExp(regexS);
	const results = regex.exec(url);
	return results == null ? null : results[1];
}

const contain_message = document.getElementById('discussion');
const url_bounty = "https://ice.icephone.id:8013/ApiBounty/ImageSave";

$(document).ready(function () {
	let userid = getCookie("userid");
	// let userid = gup('userid', location.search);
	$('#AgentName').val(userid);
});

//koneksi signalr
$.connection.hub.url = "https://ice.icephone.id:8013/signalR_ty1/signalr";
const chat = $.connection.serverHub;
// console.log(chat);


$(function () {

	//set login profile
    chat.client.ReturnLoginAgent = function (AgentID, Agent_name, message) {
		let msg = message.substr(0,6);
		if(msg === "FAILED"){
			notify('error', 'Chat Not Ready.', message);
		}
	}
	
	
	//pesan chat
    chat.client.ReturnSendMessageDataCust = function (clientId, client_name, text, AgentId, Agent_name, typeFile, AttachImage, DateCreate) {
		NotifSosmed();
		SoundControl.getInstance().playSound("MESSAGE");
		PushNotification(client_name,text,'','chat.png');
		
        let d = new Date();
        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
        let icon = "";
		
		let channel = $("#AssignTo").val();
		if (channel == "FBMessenger"){
			icon = "messenger.png";
		}
		else if (channel == "DMTwitter"){
			icon = "twitter_dm.png";
		}
		else{
			icon = "chat.png";
		}

        let content = "";
        let txt = typeFile.substr(0,5);
        let type = typeFile.substr(5,5);
        // console.log(type);

        if(type == "image"){
            file = "<img src='"+typeFile+","+AttachImage+"' style='height:150px !important;width:auto !important;border-radius:0px !important' /><br/>" + text;
        }else{
            file = "<i class='fa fa-file-text-o'></i> "+ text +" (click to download)";
        }

        if(txt == "data:"){
            content = "<a href='"+typeFile+","+AttachImage+"' target='_blank' class='text-info'>" + file + "</a>";
        }else{
            content = text;
        }
		
		// pesan chat masuk di ui pisahin berdasarkan id customer masing2
		if(clientId == $('#CustID').val()){
			let pesanDariCustFormat = '<li class="media received">'+
				'<div class="avatar">'+
					'<img src="dist/img/icon/'+icon+'" alt="user" class="avatar-img rounded-circle">'+
				'</div>'+
				'<div class="media-body">'+
					'<div class="msg-box">'+
						'<div>'+
							'<p>' + content + '</p>'+
							'<span class="chat-time">'+h+':'+m+'</span>'+
							'<div class="arrow-triangle-wrap">'+
								'<div class="arrow-triangle right"></div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</li>';
			
			$("#CustID").val(clientId);
			$("#CustName").val(client_name);
			$('#discussion').append(pesanDariCustFormat);
			$(".nicescroll-bar").animate({
				scrollTop: contain_message.scrollHeight
			}, "fast");
		}		
    }
	
	// blending chat 
	chat.client.ReturnPusher_Que = function (Type, ChatID, CustID, CustName, AgentID, AgentName, Message) {
		chat.server.queueChat($("#AgentID").val());
		if (Type == "True") {
			NotifSosmed();
			ListCustomer($("#AgentName").val());
		}
    }
	
	// messenger
	chat.client.ReturnPusher_Que_sosmed = function (Type,ChatID,CustID,CustName,AgentID,AgentName,Message,PageID,imgBase) {
        NotifSosmed();
		SoundControl.getInstance().playSound("MESSAGE");
		PushNotification(CustName,Message,ChatID,'messenger.png');	
		chat.server.queueChat($("#AgentID").val());
		ListCustomer($("#AgentName").val());
		// console.log(Type);
  
		let d = new Date();
        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
		let icon,content = "";
		
		let channel = $("#AssignTo").val();
		if (channel == "FBMessenger"){
			icon = "messenger.png";
		}
		else if (channel == "DMTwitter"){
			icon = "twitter_dm.png";
		}
		else{
			icon = "chat.png";
		}
		
		if (Type == "True") {
			if(Message == ""){
				content = "<a href='"+url_bounty+"/"+imgBase+"' target='_blank' class='text-info'><img src='"+url_bounty+"/"+imgBase+"' style='height:150px !important;width:auto !important;border-radius:0px !important' /></a>";
			}
			else{
				content = Message;
			}
			
			// pesan chat masuk di ui pisahin berdasarkan id customer masing2
			if(CustID == $('#CustID').val()){
				let pesanDariCustFormat = '<li class="media received">'+
					'<div class="avatar">'+
						'<img src="dist/img/icon/'+icon+'" alt="user" class="avatar-img rounded-circle">'+
					'</div>'+
					'<div class="media-body">'+
						'<div class="msg-box">'+
							'<div>'+
								'<p>' + content + '</p>'+
								'<span class="chat-time">'+h+':'+m+'</span>'+
								'<div class="arrow-triangle-wrap">'+
									'<div class="arrow-triangle right"></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</li>';
				
				$("#PageID").val(PageID);
				$("#CustID").val(CustID);
				$("#CustName").val(CustName);
				$('#discussion').append(pesanDariCustFormat);
				$(".nicescroll-bar").animate({
					scrollTop: contain_message.scrollHeight
				}, "fast");
			}
		}
    }
	
	// dm twitter: 
	chat.client.ReturnPusher_Que_sosmed_DMTwitter = function (Type,ChatID,CustID,CustName,AgentID,AgentName,Message,PageID,imgBase) {
		NotifSosmed();
		SoundControl.getInstance().playSound("MESSAGE");
		PushNotification(CustName,Message,ChatID,'twitter_dm.png');	
		chat.server.queueChat($("#AgentID").val());
		ListCustomer($("#AgentName").val());
	
		let d = new Date();
        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
		let icon,content = "";
		
		let channel = $("#AssignTo").val();
		if (channel == "FBMessenger"){
			icon = "messenger.png";
		}
		else if (channel == "DMTwitter"){
			icon = "twitter_dm.png";
		}
		else{
			icon = "chat.png";
		}
		
		if (Type == "True") {
			if(Message == ""){
				content = "<a href='"+url_bounty+"/"+imgBase+"' target='_blank' class='text-info'><img src='"+url_bounty+"/"+imgBase+"' style='height:150px !important;width:auto !important;border-radius:0px !important' /></a>";
			}
			else{
				content = Message;
			}
			
			// pesan chat masuk di ui pisahin berdasarkan id customer masing2
			if(CustID == $('#CustID').val()){
				let pesanDariCustFormat = '<li class="media received">'+
					'<div class="avatar">'+
						'<img src="dist/img/icon/'+icon+'" alt="user" class="avatar-img rounded-circle">'+
					'</div>'+
					'<div class="media-body">'+
						'<div class="msg-box">'+
							'<div>'+
								'<p>' + content + '</p>'+
								'<span class="chat-time">'+h+':'+m+'</span>'+
								'<div class="arrow-triangle-wrap">'+
									'<div class="arrow-triangle right"></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</li>';
				
				$("#PageID").val(PageID);
				$("#CustID").val(CustID);
				$("#CustName").val(CustName);
				$('#discussion').append(pesanDariCustFormat);
				$(".nicescroll-bar").animate({
					scrollTop: contain_message.scrollHeight
				}, "fast");
			}
		}
    }
		
	//end chat
	chat.client.ReturnEndChat_User = function (CustID, AgentId, chatID) {
		// console.log(chatID);
		//notif end chat
		notify('info', 'Finish Chat', chatID);
		
		//load list customer
		ListCustomer($("#AgentName").val());
		$('#discussion').html("");
		$(".chat_aktif").addClass("hide").hide();
	}
		
	//queuing chat
	chat.client.ReturnQueueChat = function (obj) {
		// console.log("que : " + obj.Raw[0].Queue);
		let text = "";
		if (obj.Result == "True") {
			text = obj.Raw[0].Queue;
		} else {}
		$('#jml_queue').text(text); 
		// $('#jml_queue').text(obj.Raw.length); 
	}
	
	//load chat conversation
	chat.client.ReturnlistChat = function (obj) {
		// console.log(obj);
		let text = "";
		$("#discussion").html(""); //clear the tbody
		
        if (obj.Result == "True") {
            let raw = obj.Raw;

            for (i = 0; i < raw.length; i++) {
                let content,icon,txt,type = "";
				let channel = $("#AssignTo").val();
				
				if( raw[i].JenisChat == null ){
					txt = "";
					type = "";
				}
				else{
					txt = raw[i].JenisChat.substr(0,5);
					type = raw[i].JenisChat.substr(5,5);
				}
               
				if (channel == "FBMessenger"){
					icon = "messenger.png";
				}
				else if (channel == "DMTwitter"){
					icon = "twitter_dm.png";
				}
				else{
					icon = "chat.png";
				}

                if(type == "image"){
                    file = "<img src='"+raw[i].JenisChat+","+raw[i].imgbase+"' style='height:150px !important;width:auto !important;border-radius:0px !important' /><br/>" + raw[i].Pesan;
                }else{
                    file = "<i class='fa fa-file-text-o'></i> "+ raw[i].Pesan + " (click to download)";
                }
        
                if(txt == "data:"){
                    content = "<a href='"+raw[i].JenisChat+","+raw[i].imgbase+"' target='_blank' class='text-info'>" + file + "</a>";
                }
				else if(raw[i].Pesan == ""){
						content = "<a href='"+url_bounty+"/"+raw[i].imgbase+"' target='_blank' class='text-info'><img src='"+url_bounty+"/"+raw[i].imgbase+"' style='height:150px !important;width:auto !important;border-radius:0px !important' /></a>";
				}
				else{
                    content = raw[i].Pesan;
                }
				
                if(raw[i].FlagTo == "Cust"){
					text += '<li class="media received">'+
						'<div class="avatar">'+
							'<img src="dist/img/icon/'+icon+'" alt="user" class="avatar-img rounded-circle">'+
						'</div>'+
						'<div class="media-body">'+
							'<div class="msg-box">'+
								'<div>'+
									'<p>' + content + '</p>'+
									'<span class="chat-time">'+raw[i].DateCreate+'</span>'+
									'<div class="arrow-triangle-wrap">'+
										'<div class="arrow-triangle right"></div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</li>';
                }else{
					text += '<li class="media sent">'+
						'<div class="media-body">'+
							'<div class="msg-box">'+
								'<div>'+
									'<p>' + content + '</p>'+
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
        // $("#discussion").html(""); //clear the tbody
        $('#discussion').append(text);
		$(".nicescroll-bar").animate({
			scrollTop: contain_message.scrollHeight
		}, "fast");
	}
	

    $.connection.hub.start().done(function () {
        $("#AgentID").val($.connection.hub.id);
		
		function LoginSignalR(){
			chat.server.loginAgent($('#AgentID').val(), $('#AgentName').val());
			chat.server.loginNotification($("#AgentID").val(),$("#AgentName").val()); //login notif
			chat.server.queueChat($("#AgentID").val());
			ListCustomer($("#AgentName").val());
            $('#message').val('').focus();
		}

        setTimeout( function() {
			LoginSignalR();
        }, 2000);
        

        function sendMessage(){
            let d = new Date();
            let h = addZero(d.getHours());
            let m = addZero(d.getMinutes());
			
			let contain = "";
			let pesan = $('#message').val();
			let channel = $("#AssignTo").val();
			let typeFile = $('#SrcResultbase64').val().split(",")[0];
			// console.log(typeFile);
			if($('#message').val().split(" (")[0] == $('#NameResultbase64').val()){

				let file = "";
				let type = document.getElementById("file_attach").files[0].type;
				if(type == "image/png" || type == "image/jpeg" || type == "image/gif"){
					file = "<img src='"+$('#SrcResultbase64').val()+"' style='height:150px !important;width:auto !important;border-radius:0px !important' /><br/>" + $.trim($('#message').val());
				}else{
					file = $.trim($('#message').val());
				}

				// pesan = $('#SrcResultbase64').val();
				contain = "<a href='"+$('#SrcResultbase64').val()+"' target='_blank'>" + file + "</a>";
			}else{
				// pesan = $('#message').val();
				contain = $.trim($('#message').val());
			}
			
			// FBMessenger
			if (channel == "FBMessenger"){
				let values = '{Raw:"",Data1:"'+$('#PageID').val()+'",Data2:"'+$('#message').val()+'",Data3:"'+$('#CustID').val()+'",Data4:"",Data5:"",Data6:"",Data7:"",Data8:"",Data9:"",Data10:""}';
				let url = "https://ice.icephone.id:8013/ApiTeleport/Service1.svc/send_Teleport?value="+values;

				$.ajax({
					type: "GET",
					dataType: "json",
					url: url,
					success: function (json) {
						console.log("sukses kirim FBMessenger");
					},
					error: function (jqXhr, textStatus, errorThrown) {
						console.log("gagal kirim FBMessenger");
					},
				}); 
			}
			else if (channel == "DMTwitter"){
				let values = '{Raw:"",Data1:"",Data2:"",Data3:"'+$('#CustID').val()+'",Data4:"'+$('#message').val()+'",Data5:"'+$('#PageID').val()+'",Data6:"",Data7:"",Data8:"",Data9:"",Data10:""}';
				let url = "https://ice.icephone.id:8013/ApiTeleport/Service1.svc/send_Roshan?value="+values;

				$.ajax({
					type: "GET",
					dataType: "json",
					url: url,
					success: function (json) {
						console.log("sukses kirim DMTwitter");
					},
					error: function (jqXhr, textStatus, errorThrown) {
						console.log("gagal kirim DMTwitter");
					},
				}); 
			}
			else{}

			let fortmatSent = '<li class="media sent">'+
				'<div class="media-body">'+
					'<div class="msg-box">'+
						'<div>'+
							'<p>' + contain + '</p>'+
							'<span class="chat-time">'+h+':'+m+'</span>'+
							'<div class="arrow-triangle-wrap">'+
								'<div class="arrow-triangle left"></div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</li>';
               
            chat.server.sendMessageDataAgent($('#ChatID').val(),$('#CustID').val(),$('#CustID').val(), $('#CustName').text(), pesan, $("#AgentID").val(), $("#AgentName").val(), $("#NameResultbase64").val(),$("#Resultbase64").val(), $("#Email").val(), typeFile, d);
			
            $('#discussion').append(fortmatSent);
            $('#message').val('').focus();
			$(".nicescroll-bar").animate({
				scrollTop: contain_message.scrollHeight
			}, "fast");
			
			//hapus file telah dikirim
			clearFile();
        }
		

        $('#btn_send').click(function () {
            if($('#message').val() != ""){
                sendMessage();
            }else{
                $('#message').focus();
            }
        });

        $("#message").keypress(function(e) {
            if(e.which == 13) {
                if($('#message').val() != ""){
                    sendMessage();
                }else{
                    $('#message').focus();
                }
            }
        });
		
		
    });
});


async function ListCustomer(AgentName) {
	try {
		const url = `https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"ListCustomer",Data2:"${AgentName}",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}`;
		const res = await fetch(url);
		const obj = await res.json();
		// console.log(obj);

		let text = "";
		let label = "";
		let icon = ""; // AssignTo: "FBMessenger"
		if (obj.Result == "True") {
			for (i = 0; i < obj.Raw.length; i++) {
				
				let aktif = "";
				if($("#ChatID").val() == obj.Raw[i].ChatID ){
					aktif = "aktif";
					$("#CustID").val(obj.Raw[i].UserID); //set id ketika customer relogin
				}
				
				let channel = obj.Raw[i].AssignTo;
				if (channel == "FBMessenger"){
					icon = "messenger.png";
					label = obj.Raw[i].PageName;
				}
				else if (channel == "DMTwitter"){
					icon = "twitter_dm.png";
					label = obj.Raw[i].PageName;
				}
				else{
					icon = "chat.png";
					label = "Chating App";
				}
				
				text += "<a href='javascript:void(0)' class='media read-chat "+aktif+"' onclick='selectCust(\"" + obj.Raw[i].UserID + "\",\"" + obj.Raw[i].Nama +
					"\",\"" + obj.Raw[i].ChatID +"\",\"" + obj.Raw[i].Email +"\",\"" + obj.Raw[i].AssignTo +"\",\"" + obj.Raw[i].RoomID +"\")'>"+
					'<div class="media-img-wrap">'+
						'<div class="avatar"><img src="dist/img/icon/'+icon+'" class="avatar-img rounded-circle"></div>'+
						'<span class="badge badge-success badge-indicator"></span>'+
					'</div>'+
					'<div class="media-body">'+
						'<div>'+
							'<div class="user-name">' + obj.Raw[i].Nama + '</div>'+
							'<div class="user-last-chat">' + obj.Raw[i].Email + '</div>'+
						'</div>'+
						'<div><div class="last-chat-time block '+ obj.Raw[i].UserID +'">'+label+'<span class="badge"><img src="dist/img/icon/'+icon+'" class="avatar-img rounded-circle" height="12" width="12"></span></div></div>'+
					'</div>'+
				'</a>'+
				'<div class="chat-hr-wrap"><hr></div>';
				
			}
			$('#JmlLive').text(obj.Raw.length);
		
		}
		$("#list_customer").html(""); //clear the tbody
		$('#list_customer').append(text); 

		// CARI CUSTOMER
		const txtCari = document.getElementById('CariCustomer');
		const divList = document.getElementById('list_customer');
		const listCust = divList.getElementsByTagName("a");

		txtCari.addEventListener("keyup",(e)=>{
			e.preventDefault();
			// console.log(listCust.length);

			for (let i = 0; i < listCust.length; i++) {
				let mediaBody = listCust[i].getElementsByClassName("media-body")[0];
				let txtValue = mediaBody.textContent || mediaBody.innerText;
				// console.log(txtValue);

				if (txtValue.toLowerCase().indexOf(txtCari.value) > -1) {
					listCust[i].style.display = '';
				}
				else{
					listCust[i].style.display = 'none';
				}
			}
		});
	} 
	catch (error) {
		console.log(error);
	}
}


function selectCust(CustID, custName,chatID,Email,AssignTo,RoomID) {
    $("#CustID").val(CustID);
    $("#CustName").text(custName);
    $("#ChatID").val(chatID);
    $("#Email").val(Email);
    $("#AssignTo").val(AssignTo);
    $("#PageID").val(RoomID);
    $('#message').val('').focus();
	
    $("#Email2").text(Email);
    $(".chat_aktif").removeClass("hide").show();
    $(".chat_option").removeClass("hide").show();
    $("#form_send").removeClass("hide").show();
	
	//que chat
	chat.server.queueChat($("#AgentID").val());
	
	//load list customer
	ListCustomer($("#AgentName").val());

    //load data conversation
	loadChatConversation(chatID);
	
	//read notif from notif.js
	ReadNotif(chatID);
	
	//icon chat aktif
	$("#icon").html("");
	if(AssignTo == "FBMessenger"){
		$("#icon").html("<img src='dist/img/icon/messenger.png' alt='user' class='avatar-img rounded-circle'>");
	}
	else if(AssignTo == "DMTwitter"){
		$("#icon").html("<img src='dist/img/icon/twitter_dm.png' alt='user' class='avatar-img rounded-circle'>");
	}
	else{
		$("#icon").html("<img src='dist/img/icon/chat.png' alt='user' class='avatar-img rounded-circle'>");
	}
}

function loadChatConversation(chatID){
	chat.server.listChat($("#AgentID").val(), chatID);
}


async function endChat(){
	const data = JSON.stringify({CustID:$("#CustID").val(),CustName:$("#CustName").text(),ChatID:$("#ChatID").val(),Email:$("#Email").val(),AssignTo:$("#AssignTo").val()});
	const ticket = await import('./module.ticket.sosmed.js');

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

				chat.server.endChat_User($('#CustID').val(), $("#AgentID").val(), $('#ChatID').val());
				$('#discussion').html("");
				$(".chat_aktif").addClass("hide").hide();
				$(".chat_option").addClass("hide").hide();
				$("#form_send").addClass("hide").hide();
			});
		}
	});
}

async function InformationCustomer(){
	const data = JSON.stringify({CustID:$("#CustID").val(),CustName:$("#CustName").text(),ChatID:$("#ChatID").val(),Email:$("#Email").val(),AssignTo:$("#AssignTo").val()});
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

	window.open("https://ice.icephone.id:7021/HTML/tr_utama.aspx?ket=chat&id="+$("#ChatID").val()+"&cid="+$("#ChatID").val()+"&agentid="+userid+"&email="+$("#Email").val(),'width=1000px,Height=700px,toolbar=0,menubar=0,location=0,top='+top+',left='+left);
}

function encodeImageFileAsURL(element) {
	let file = element.files[0];
	let reader = new FileReader();
	let size = file.size;
	
	//console.log(size);
	if(size >= 2000000){
				
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
		
		$('#discussion').append(message);
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

