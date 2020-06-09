
const agent_name = getCookie("userid");

function NotifSosmed(){
	const url = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"NotifSosmed",Data2:"'+agent_name+'",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}';
	
	fetch(url)
	.then((response) => response.json())
	.then((responseJson) => {
		let str = JSON.stringify(responseJson);
		let obj = JSON.parse(str);
		// console.table(obj.Raw);
		
		let url = "";
		let text = "";
		let icon = ""; // AssignTo
		
		if (obj.Result == "True"){
			let row = obj.Raw;
			$("#jml_notif").html(""); //clear 
			$('#jml_notif').append(row.length); 
			
			if(row.length != 0){
				document.title = '(' + row.length + ') Invision Helpdesk';
				// $("#btnIconNotif").trigger("click");
			}
			else{
				document.title = 'Invision Helpdesk';
			}
			
			for (i = 0; i < row.length; i++) {
				if(row[i]._from == "fbMessenger"){
					icon = "dist/img/icon/messenger.png";
					url = "chat.html";
				}
				else if(row[i]._from == "fbFeed"){
					icon = "dist/img/icon/facebook.png";
					url = "feed.html";
				}
				else if(row[i]._from == "fbMention"){
					icon = "dist/img/icon/facebook.png";
					url = "mention.html";
				}
				else if(row[i]._from == "TWMention"){
					icon = "dist/img/icon/twitter.png";
					url = "mention.html";
				}
				else if(row[i]._from == "DMTwitter"){
					icon = "dist/img/icon/twitter_dm.png";
					url = "chat.html";
				}
				else if(row[i]._from == "IGFeed"){
					icon = "dist/img/icon/instagram.png";
					url = "feed.html";
				}
				else{
					icon = "dist/img/icon/chat.png";
					url = "chat.html";
				}
				
				text += '<a href="'+url+'" class="dropdown-item" onclick="ReadNotif('+row[i].chatID+');">'+
					'<div class="media">'+
						'<div class="media-img-wrap">'+
							'<div class="avatar avatar-sm">'+
								'<img src="'+icon+'" class="avatar-img rounded-circle">'+
							'</div>'+
						'</div>'+
						'<div class="media-body">'+
							'<div>'+
								'<div class="notifications-text">'+
									'<span class="text-dark text-capitalize">'+row[i].nama+'</span><br/>'+
									'<p>'+row[i].message+'</p>'+
									'<span class="text-dark">'+row[i].tanggal+'</span>'+
								'</div>'+
								'<div class="notifications-time">'+row[i].jam+'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</a>'+
				'<div class="dropdown-divider"></div>';
			}
		}
		else{}
		
		$("#list_notif").html(""); //clear the tbody
		$('#list_notif').append(text); 
	

	});
}
NotifSosmed();

function ReadNotif(chatid){
	const url = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"ReadNotif",Data2:"'+chatid+'",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}';
	
	fetch(url)
	.then((response) => response.json())
	.then((responseJson) => {
		let str = JSON.stringify(responseJson);
		let obj = JSON.parse(str);
		// console.table(obj.Raw);
		NotifSosmed();
	});
}

function ReadAllNotif(){
	const url = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"ReadAllNotif",Data2:"'+agent_name+'",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}';
	
	fetch(url)
	.then((response) => response.json())
	.then((responseJson) => {
		let str = JSON.stringify(responseJson);
		let obj = JSON.parse(str);
		// console.table(obj.Raw);
		$("#jml_notif").html(0); 
		document.title = 'Invision Helpdesk';
		NotifSosmed();
		
	});
	
}

$.connection.hub.url = "https://ice.icephone.id:8013/signalR_ty1/signalr";
const signalr = $.connection.serverHub;
// console.log(chat);
$(function () {
	
    // blending chat 
    signalr.client.ReturnPusher_Que = function (Type, ChatID, CustID, CustName, AgentID, AgentName, Message) {
        if (Type == "True") {
			console.log("notif pusher que");
			NotifSosmed();
			// SoundControl.getInstance().playSound("MESSAGE");
			$("#btnIconNotif").trigger("click");
        }
    }

    //chat
    signalr.client.ReturnSendMessageDataCust = function (clientId, client_name, text, AgentId, Agent_name, typeFile, AttachImage, DateCreate) {
		console.log("notif chat");
		NotifSosmed();
		SoundControl.getInstance().playSound("MESSAGE");
		$("#btnIconNotif").trigger("click");
		// notify('chating', client_name, text);
		PushNotification(client_name,text,'','chat.png');
    }

    //messenger
    signalr.client.ReturnPusher_Que_sosmed = function (Type,ChatID,CustID,CustName,AgentID,AgentName,Message,PageID,imgBase) {
		console.log("notif fb messenger");
		NotifSosmed();
		SoundControl.getInstance().playSound("MESSAGE");
		$("#btnIconNotif").trigger("click");
		// notify('facebook-messenger', CustName, Message);
		PushNotification(CustName,Message,ChatID,'messenger.png');
    }

    // dm twitter
    signalr.client.ReturnPusher_Que_sosmed_DMTwitter = function (Type,ChatID,CustID,CustName,AgentID,AgentName,Message,PageID,imgBase) {
		console.log("notif dm twitter");
		NotifSosmed();
		SoundControl.getInstance().playSound("MESSAGE");
		$("#btnIconNotif").trigger("click");
		// notify('twitter', CustName, Message);
		PushNotification(CustName,Message,ChatID,'twitter_dm.png');
    }

    //fb mention
    signalr.client.ReturnPusher_Que_sosmed_FBMention = function (Type, ChatID, CustID, CustName, AgentID, AgentName, Message, RoomID, imgBase, AlamatIP, AssignTo) {
		console.log("notif fb mention");
		NotifSosmed();
		SoundControl.getInstance().playSound("MESSAGE");
		$("#btnIconNotif").trigger("click");
		// notify('facebook', CustName, Message);
		PushNotification(CustName,Message,ChatID,'facebook.png');
    }

    //tw mention
    signalr.client.ReturnPusher_Que_sosmed_TWMention = function (Type, ChatID, CustID, CustName, AgentID, AgentName, Message, RoomID, imgBase, AlamatIP, AssignTo) {
		console.log("notif tw mention");
		NotifSosmed();
		SoundControl.getInstance().playSound("MESSAGE");
		$("#btnIconNotif").trigger("click");
		// notify('twitter', CustName, Message);
		PushNotification(CustName,Message,ChatID,'twitter.png');
    }

    //fb feed
	signalr.client.ReturnPusher_Que_sosmed_FBfeed = function (Type, ChatID, CustID, CustName, AgentID, AgentName, Message, PostID, imgBase, AlamatIP, AssignTo) {
		console.log("notif fb feed");
		NotifSosmed();
		SoundControl.getInstance().playSound("MESSAGE");
		$("#btnIconNotif").trigger("click");
		// notify('facebook', CustName, Message);
		PushNotification(CustName,Message,ChatID,'facebook.png');
	}

	//IG Feed
	signalr.client.ReturnPusher_Que_sosmed_IGFeed = function (Type, ChatID, CustID, CustName, AgentID, AgentName, Message, PostID, imgBase, AlamatIP, AssignTo) {
		console.log("notif ig feed");
		NotifSosmed();
		SoundControl.getInstance().playSound("MESSAGE");
		$("#btnIconNotif").trigger("click");
		// notify('instagram', CustName, Message);
		PushNotification(CustName,Message,ChatID,'instagram.png');
	}

	//login notif
	signalr.client.ReturnLoginAgent = function (AgentID, Agent_name, message) {
		console.log({AgentID, Agent_name, message});
	}

	signalr.client.ReturnLoginNotification = function (Notif_id, Notif_Name) {
		console.log(Notif_id,Notif_Name);
	}

	function LoginSignalRNotif(){
		$.connection.hub.start().done(function () {
			let AgentID = $.connection.hub.id;
			let AgentName = getCookie("userid");
			// $("#AgentID").val($.connection.hub.id);
			// $('#AgentName').val(userid);
			// console.log(AgentID, AgentName)
			signalr.server.loginAgent(AgentID, AgentName);
			signalr.server.loginNotification(AgentID, AgentName);
		});
		
	}

	setTimeout( function() {
		LoginSignalRNotif();
	}, 2000);
	
        

});

