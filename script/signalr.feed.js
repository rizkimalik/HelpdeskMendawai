function gup(name, url) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	let regexS = "[\\?&]" + name + "=([^&#]*)";
	let regex = new RegExp(regexS);
	let results = regex.exec(url);
	return results == null ? null : results[1];
}

let contain_message = document.getElementById('feed_conversation');
let img_feed = "https://ice.icephone.id:8013/ApiBounty/ImageSaveFeed";
let img_profile = "https://ice.icephone.id:8013/ApiBounty/ImageSaveProfile";


let input = document.createElement("input");
	input.setAttribute("type", "hidden");
	input.setAttribute("id", "tes");
	document.body.appendChild(input);
	// console.log($('#helo').val());

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
	
	//FB Feed
	chat.client.ReturnPusher_Que_sosmed_FBfeed = function (Type, ChatID, CustID, CustName, AgentID, AgentName, Message, PostID, imgBase, AlamatIP, AssignTo) {
		//list post
		ListFeed();
		// notify('facebook', CustName, Message);
		PushNotification(CustName,Message,ChatID,'facebook.png');	
		
		let d = new Date();
		let h = addZero(d.getHours());
		let m = addZero(d.getMinutes());
		let comment = "";
		let reply = "";
		
		SoundControl.getInstance().playSound("MESSAGE");
		
		if(PostID == $("#RoomID").val()){
			if(AssignTo == "FBFeed_Comment"){
				comment += '<div class="media">'+
					'<div class="media-img-wrap d-flex mr-10" style="margin-top:5px;">'+
						'<div class="avatar avatar-xs">'+
							'<img src="'+img_profile+'/'+CustID+'.jpg" alt="user" class="avatar-img rounded-circle">'+
						'</div>'+
					'</div>'+
					'<div class="media-body">'+
						'<div class="text-capitalize font-14 font-weight-500 text-dark">'+CustName+'</div>'+
						'<div class="font-14"><p>'+Message+'</p></div>'+
						'<span class="font-12 text-light mr-15">'+h+':'+m+'</span>'+
						'<a href="#" class="font-12 text-light text-capitalize font-weight-500" onclick="clickFormReply(\'' + AlamatIP + '\');"> reply</a>'+
						'<footer class="form_'+AlamatIP+' hide">'+
							'<div class="input-group">'+
								'<input type="text" id="msg_'+AlamatIP+'" class="input-msg-send form-control" placeholder=" Tulis balasan...">'+
								'<button type="button" class="btn btn-wth-icon btn-rounded" onclick="replyComment(\'' + CustID + '\', \'' + AlamatIP + '\');">'+
									'<span class="icon-label"><i class="fa fa-send"></i></span>'+
								'</button>'+
							'</div>'+
						'</footer>'+
						'<div id="list_'+AlamatIP+'"></div>'+
					'</div>'+
				'</div><hr/>';
				$(comment).insertBefore('#comment'); 
			}
			else if(AssignTo == "FBFeed_Reply"){
				reply += '<hr/><div class="media">'+
					'<div class="media-img-wrap d-flex mr-10" style="margin-top:5px;">'+
						'<div class="avatar avatar-xs">'+
							'<img src="'+img_profile+'/'+CustID+'.jpg" alt="user" class="avatar-img rounded-circle">'+
						'</div>'+
					'</div>'+
					'<div class="media-body">'+
						'<div class="text-capitalize font-14 font-weight-500 text-dark">'+CustName+'</div>'+
						'<div class="font-14"><p>'+Message+'</p></div>'+
						'<span class="font-12 text-light mr-15">'+h+':'+m+'</span>'+
					'</div>'+
				'</div>';
				// $("#list_"+ComentID).append(reply);
				$(reply).insertBefore($("#list_"+AlamatIP));
			}
			else{}
		}
	}

	//IG Feed
	chat.client.ReturnPusher_Que_sosmed_IGFeed = function (Type, ChatID, CustID, CustName, AgentID, AgentName, Message, PostID, imgBase, AlamatIP, AssignTo) {
		// console.log(Type, ChatID, CustID, CustName, AgentID, AgentName, Message, PostID, imgBase, AlamatIP, AssignTo)
		//list post
		ListFeed();
		// notify('instagram', CustName, Message);
		PushNotification(CustName,Message,ChatID,'instagram.png');	
		
		let d = new Date();
		let h = addZero(d.getHours());
		let m = addZero(d.getMinutes());
		let comment = "";
		let reply = "";
		
		SoundControl.getInstance().playSound("MESSAGE");

		if(CustID == $('#RoomID').val()){
			let text = '<li class="media received">'+
				'<div class="avatar">'+
					'<img src="dist/img/icon/instagram.png" alt="user" class="avatar-img rounded-circle">'+
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
			
			$('#feed_conversation').append(text);
			$(".nicescroll-bar").animate({
				scrollTop: contain_message.scrollHeight
			}, "fast");
		}else{}
	}

	
    $.connection.hub.start().done(function () {
        $("#AgentID").val($.connection.hub.id);
		
		function LoginSignalR(){
			chat.server.loginAgent($('#AgentID').val(), $('#AgentName').val());
			chat.server.loginNotification($("#AgentID").val(),$("#AgentName").val()); //login notif
            $('#message').val('').focus();
			
		}

        setTimeout( function() {
			LoginSignalR();
			ListFeed();
        }, 2000);
    });
});

 
function ListFeed(){
	// let url = 'https://ice.icephone.id:8013/ApiTeleport/Service1.svc/get_Tower_One?value={Raw:"",Data1:"'+$('#AgentName').val()+'",Data2:"",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}';
	let url = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"ListFeed",Data2:"'+$('#AgentName').val()+'",Data3:"",Data4:"",Data5:"",Data6:"",Data7:"",Data8:"",Data9:"",Data10:""}';
	
	return fetch(url)
		.then((response) => response.json())
		.then((responseJson) => {
			let str = JSON.stringify(responseJson);
			let obj = JSON.parse(str);
			let text = "";  
			let images = ""; // AssignTo: "FBMessenger"
			// console.log(obj.Raw);
			
			if (obj.Result == "True"){
				for (i = 0; i < obj.Raw.length; i++) {	
					let aktif = "";
					let message = "";
					let selectParams = JSON.stringify(obj.Raw[i]);

					const options = {
						facebook: {
							icon: "dist/img/icon/facebook.png",
							label: "Facebook Feed"
						},
						instagram: {
							icon: "dist/img/icon/instagram.png",
							label: "Instagram Feed"
						}
					}
					
					if(obj.Raw[i].AssignTo == "IGFeed"){
						if($("#RoomID").val() == obj.Raw[i].UserID ){
							aktif = "aktif";
						}

						text += "<a href='javascript:void(0)' class='media read-chat "+aktif+"' onclick='SelectFeed("+selectParams+")'>"+
							'<div class="media-img-wrap">'+
								'<div class="avatar"><img src="'+options.instagram.icon+'" class="avatar-img rounded-circle"></div>'+
							'</div>'+
							'<div class="media-body">'+
								'<div>'+
									'<div class="user-name">' + obj.Raw[i].Nama + '</div>'+
									'<div class="user-last-chat">' + obj.Raw[i].UserID + '</div>'+
								'</div>'+
								'<div><div class="last-chat-time block">'+options.instagram.label+' <img src="'+options.instagram.icon+'" class="avatar-img rounded-circle" height="12" width="12"></div></div>'+
							'</div>'+
						'</a>'+
						'<div class="chat-hr-wrap"><hr></div>';
					}
					else{
						if($("#RoomID").val() == obj.Raw[i].P_ID_Post ){
							aktif = "aktif";
							$("#PageID").val(obj.Raw[i].P_ID_Page); //set id ketika customer relogin
						}

						//image post
						if(obj.Raw[i].P_Message == ""){
							message = "Facebook Image Post";
							images = img_feed+'/'+obj.Raw[i].P_ID_Post+".jpg";
						}
						else{
							message = obj.Raw[i].P_Message;
							images = options.facebook.icon;
						}

						text += "<a href='javascript:void(0)' class='media read-chat "+aktif+"' onclick='SelectFeed("+selectParams+")'>"+
							'<div class="media-img-wrap">'+
								'<div class="avatar"><img src="'+images+'" class="avatar-img rounded-circle"></div>'+
							'</div>'+
							'<div class="media-body">'+
								'<div>'+
									'<div class="user-name">' + message + '</div>'+
									'<div class="user-last-chat">' + obj.Raw[i].P_User_Name + '</div>'+
								'</div>'+
								'<div><div class="last-chat-time block">'+options.facebook.label+' <img src="'+options.facebook.icon+'" class="avatar-img rounded-circle" height="12" width="12"></div></div>'+
							'</div>'+
						'</a>'+
						'<div class="chat-hr-wrap"><hr></div>';
					}
					
					
				}
				$('#JmlLive').text(obj.Raw.length);
			}
			else{}
			
			$("#list_posting").html(""); //clear the tbody
			$('#list_posting').append(text); 
		

		})
		.catch((error) => {
			console.log(error);
		});
} 


let data_reply = [];
function FeedConversation(post_id, user_name,message,page_id){
	$("#feed_conversation").html("");
	$("#comment").html(""); 
	let text = "";
	let reply = "";
	let jml_reply = "";
	
	//Feed Detail
	text += '<div class="card-columns card-column-1">'+
		'<div class="card card-profile-feed mb-0 rounded-bottom-0">'+
			'<div class="card-body">'+
				'<p class="card-text mb-30">'+message+'</p>'+
				'<div class="feed-img-layout">'+
					'<center><img src="'+img_feed+'/'+post_id+'.jpg" alt="Feed Post" style="max-height:300px;"></center>'+
				'</div>'+
			'</div>'+
			'<div class="card-footer justify-content-between">'+
				'<div><a href="#"><i class="ion ion-md-chatboxes"></i> <span id="jml_comment">0</span> &nbsp; Comment</a></div>'+
			'</div>'+
		'</div>'+
		'<div class="card card-profile-feed border-top-0 rounded-top-0">'+
			'<div class="card-body" style="overflow:auto;">'+
				'<div id="comment"></div>'+
			'</div>'+
		'</div>'+
	'</div>';
	$("#feed_conversation").html(""); //clear the tbody
	$('#feed_conversation').append(text); 
		
	
	let url_feed = 'https://ice.icephone.id:8013/ApiTeleport/Service1.svc/get_Tower_Two?value={Raw:"",Data1:"'+post_id+'",Data2:"'+$('#AgentName').val()+'",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}';
	
	return fetch(url_feed)
	.then((response) => response.json())
	.then((responseJson) => {
		let str = JSON.stringify(responseJson);
		let obj = JSON.parse(str);
		// console.log(obj);
		
		
		if (obj.Result == "True"){
			
			let comment = "";
			$("#ChatID").val(obj.Raw[0].ChatID); //set last chat_id

			for (i = 0; i < obj.Raw.length; i++) {
				// console.log(obj.Raw)
				
				if(obj.Raw[i].Reply_from_Tower !== undefined){
					jml_reply = obj.Raw[i].Reply_from_Tower.length;
					var data = obj.Raw[i].Reply_from_Tower;
					
					for (x = 0; x < data.length; x++) {
						//Reply Comment
						reply += '<hr/><div class="media">'+
							'<div class="media-img-wrap d-flex mr-10" style="margin-top:5px;">'+
								'<div class="avatar avatar-xs">'+
									'<img src="'+img_profile+'/'+data[x].UserID+'.jpg" alt="user" class="avatar-img rounded-circle">'+
								'</div>'+
							'</div>'+
							'<div class="media-body">'+
								'<div class="text-capitalize font-14 font-weight-500 text-dark">'+data[x].Nama+'</div>'+
								'<div class="font-14"><p>'+data[x].Pesan+'</p></div>'+
								'<span class="font-12 text-light mr-15">'+data[x].DateCreate+'</span>'+
							'</div>'+
						'</div>';
						
					}
				}
				else{
					jml_reply = "";
					reply = "";
				}
				
				
				//Comment Feed
				comment += '<div class="media">'+
					'<div class="media-img-wrap d-flex mr-10" style="margin-top:5px;">'+
						'<div class="avatar avatar-xs">'+
							'<img src="'+img_profile+'/'+obj.Raw[i].UserID+'.jpg" alt="user" class="avatar-img rounded-circle">'+
						'</div>'+
					'</div>'+
					'<div class="media-body">'+
						'<div class="text-capitalize font-14 font-weight-500 text-dark">'+obj.Raw[i].Nama+'</div>'+
						'<div class="font-14"><p>'+obj.Raw[i].Pesan+'</p></div>'+
						'<span class="font-12 text-light mr-15">'+obj.Raw[i].DateCreate+'</span>'+
						'<a href="#" class="font-12 text-light text-capitalize font-weight-500" onclick="clickFormReply(\'' + obj.Raw[i].AlamatIP + '\');">'+jml_reply+' reply</a>'+
						'<footer class="form_'+obj.Raw[i].AlamatIP+' hide">'+
							'<div class="input-group">'+
								'<input type="text" id="msg_'+obj.Raw[i].AlamatIP+'" class="input-msg-send form-control" placeholder=" Tulis balasan...">'+
								'<button type="button" class="btn btn-wth-icon btn-rounded" onclick="replyComment(\'' + obj.Raw[i].ChatID + '\',\'' + obj.Raw[i].UserID + '\',\'' + obj.Raw[i].AlamatIP + '\');">'+
									'<span class="icon-label"><i class="fa fa-send"></i></span>'+
								'</button>'+
							'</div>'+
						'</footer>'+
						'<div id="list_'+obj.Raw[i].AlamatIP+'"></div>'+
						reply+
						
					'</div>'+
				'</div><hr/>';
				
				
			}
			$("#jml_comment").text(obj.Raw.length+jml_reply);
			$("#comment").html(""); //clear the tbody
			$('#comment').append(comment); 
					
		}
		else{}
	
	})
	.catch((error) => {
		console.log(error);
	});
}

function FeedConversationIG(UserID){
	$("#feed_conversation").html("");

	$.ajax({
		type: "GET",
		url: 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"LastData",Data2:"'+UserID+'",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}',
		success: function (res) {
			// console.log(res)
			let text = "";
			if(res.Result == "True"){
				let url = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"FeedConversationIG",Data2:"'+res.Raw[0].ChatID+'",Data3:"'+res.Raw[0].agent_handle+'",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}';

				$.ajax({
					type: 'GET',
					async: false,
					url: url,
					cache: false,
					success: function (obj) {
						// console.log(obj)
						if (obj.Result == "True") {
							for (i = 0; i < obj.Raw.length; i++) {
							   
								if(obj.Raw[i].FlagTo == "Cust"){
									text += '<li class="media received">'+
										'<div class="avatar">'+
											'<img src="dist/img/icon/instagram.png" alt="user" class="avatar-img rounded-circle">'+
										'</div>'+
										'<div class="media-body">'+
											'<div class="msg-box">'+
												'<div>'+
													'<p>' + obj.Raw[i].Pesan + '</p>'+
													'<span class="chat-time">'+obj.Raw[i].DateCreate+'</span>'+
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
													'<p>' + obj.Raw[i].Pesan + '</p>'+
													'<span class="chat-time">'+obj.Raw[i].DateCreate+'</span>'+
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
						// $("#feed_conversation").html(""); //clear the tbody
						$('#feed_conversation').append(text);
						$(".nicescroll-bar").animate({
							scrollTop: contain_message.scrollHeight
						}, "fast");
					},
					error: function (xhr, ajaxOptions, thrownError) {
						console.log(thrownError);
					}
				});
			}
		}
	});

	
}

//btn reply comment
function clickFormReply(formid){
	$(".form_"+formid).toggleClass("hide");
}

function replyComment(ChatID,CustID,ComentID){
	// console.log(commentid);
	let d = new Date();
	let h = addZero(d.getHours());
	let m = addZero(d.getMinutes());
	let reply = "";
	
	if($("#msg_"+ComentID).val() != ""){
		reply += '<hr/><div class="media">'+
			'<div class="media-img-wrap d-flex mr-10" style="margin-top:5px;">'+
				'<div class="avatar avatar-xs">'+
					'<img src="'+img_profile+'/'+$("#PageID").val()+'.jpg" alt="user" class="avatar-img rounded-circle">'+
				'</div>'+
			'</div>'+
			'<div class="media-body">'+
				'<div class="text-capitalize font-14 font-weight-500 text-dark">'+$("#AgentName").val()+'</div>'+
				'<div class="font-14"><p>'+$("#msg_"+ComentID).val()+'</p></div>'+
				'<span class="font-12 text-light mr-15">'+h+':'+m+'</span>'+
			'</div>'+
		'</div>';
		// $("#list_"+ComentID).append(reply);
		$(reply).insertBefore($("#list_"+ComentID));

		let url = "https://ice.icephone.id:8013/ApiTeleport/Service1.svc/send_to_Tower?value={Raw:'',Data1:'"+ $("#PageID").val() +"',Data2:'"+ComentID+"',Data3:'"+$("#msg_"+ComentID).val()+"',Data4:'"+ ChatID +"',Data5:'"+ $("#PageID").val() +"',Data6:'"+ CustID +"',Data7:'"+ $("#AgentName").val() +"',Data8:'"+ $("#RoomID").val() +"',Data9:'"+ ComentID +"',Data10:'FBFeed_Reply'}";
		// console.log(url)

		$.ajax({
			type: 'GET',
			async: false,
			url: url,
			cache: false,
			success: function (result) {
				console.log(result);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(thrownError);
			}
		}); 
	}
	else{
		$("#msg_"+ComentID).focus();
	}
	$("#msg_"+ComentID).val("");
}

function commentFeed(){
	let d = new Date();
	let h = addZero(d.getHours());
	let m = addZero(d.getMinutes());
	let pesan = $("#message").val();
	let comment = "";

	
	if($('#message').val() != ""){
		if($("#AssignTo").val() == "IGFeed"){
			

			$.ajax({
				type: "GET",
				url: 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"LastData",Data2:"'+$("#RoomID").val()+'",Data3:"",Data4:"",Data5:"",Data6: "",Data7:"",Data8:"",Data9:"",Data10:""}',
				success: function (res) {
					let url = "https://ice.icephone.id:8013/ApiTeleport/Service1.svc/send_EG_Notif?value={Raw:'',Data1:'"+res.Raw[0].RoomID+"',Data2:'"+pesan+"',Data3:'"+res.Raw[0].AlamatIP+"',Data4:'"+res.Raw[0].ChatID+"',Data5:'"+res.Raw[0].RoomID+"',Data6:'"+res.Raw[0].UserID+"',Data7:'"+res.Raw[0].agent_handle+"',Data8:'"+res.Raw[0].RoomID+"',Data9:'',Data10:''}";
					// console.log(url)
					$.ajax({
						type: 'GET',
						async: false,
						url: url,
						cache: false,
						success: function (obj) {
							console.log(obj)
						}
					});

					let html = '<li class="media sent">'+
						'<div class="media-body">'+
							'<div class="msg-box">'+
								'<div>'+
									'<p>' + pesan + '</p>'+
									'<span class="chat-time">'+h+':'+m+'</span>'+
									'<div class="arrow-triangle-wrap">'+
										'<div class="arrow-triangle left"></div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</li>';
					
					$('#feed_conversation').append(html);
					$('#message').val('').focus();
					$(".nicescroll-bar").animate({
						scrollTop: contain_message.scrollHeight
					}, "fast");
				}
			});

		}
		else{
			let url = "https://ice.icephone.id:8013/ApiTeleport/Service1.svc/send_to_Tower?value={Raw:'',Data1:'"+ $("#PageID").val() +"',Data2:'"+ $("#RoomID").val() +"',Data3:'"+$("#message").val()+"',Data4:'"+ $("#ChatID").val() +"',Data5:'"+ $("#PageID").val() +"',Data6:'"+ $("#CustID").val() +"',Data7:'"+ $("#AgentName").val() +"',Data8:'"+ $("#RoomID").val() +"',Data9:'"+ $("#AlamatIP").val() +"',Data10:'FBFeed_Comment'}";
			// console.log(url)

			$.ajax({
				type: 'GET',
				async: false,
				url: url,
				cache: false,
				success: function (obj) {
					// console.log(obj);
					if (obj.Result == "True"){
						comment += '<div class="media">'+
							'<div class="media-img-wrap d-flex mr-10" style="margin-top:5px;">'+
								'<div class="avatar avatar-xs">'+
									'<img src="'+img_profile+'/'+$("#PageID").val()+'.jpg" alt="user" class="avatar-img rounded-circle">'+
								'</div>'+
							'</div>'+
							'<div class="media-body">'+
								'<div class="text-capitalize font-14 font-weight-500 text-dark">'+$("#AgentName").val()+'</div>'+
								'<div class="font-14"><p>'+$("#message").val()+'</p></div>'+
								'<span class="font-12 text-light mr-15">'+h+':'+m+'</span>'+
								'<a href="#" class="font-12 text-light text-capitalize font-weight-500"> reply</a>'+
								'<footer class="form_ hide">'+
									'<div class="input-group">'+
										'<input type="text" id="msg_" class="input-msg-send form-control" placeholder=" Tulis balasan...">'+
										'<button type="button" class="btn btn-wth-icon btn-rounded" onclick="replyComment();">'+
											'<span class="icon-label"><i class="fa fa-send"></i></span>'+
										'</button>'+
									'</div>'+
								'</footer>'+
								// '<div id="list_'+obj.Raw[i].AlamatIP+'"></div>'+
							'</div>'+
						'</div><hr/>';
						// $('#comment').append(comment); 
						$(comment).insertBefore($('#comment'));
					}
					else{}
				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(thrownError);
					// alert("Gagal Simpan Data");
				}
			});
		}
		
	}else{
		$('#message').focus();
	}
	$("#message").val("");
}



// function SelectFeed(post_id, user_name,message,date,url,page_id) {
function SelectFeed(obj) {
	// console.log(obj);
	ListFeed();
	$("#AssignTo").val(obj.AssignTo);

	if(obj.AssignTo == "IGFeed"){
		$("#RoomID").val(obj.UserID);
		// $("#PageID").val(obj.RoomID);
		
		$("#img_feed").attr('src', 'dist/img/icon/instagram.png');
		$("#PostTitle").html(obj.Nama);
		$("#DateCreate").text(obj.UserID);
	
		$(".chat_aktif").removeClass("hide").show();
		$(".chat_option").removeClass("hide").show();
		$("#form_send").removeClass("hide").show();

		//Load Feed Conversation
		FeedConversationIG(obj.UserID);
	}
	else{
		$("#RoomID").val(obj.P_ID_Post);
		$("#PageID").val(obj.P_ID_Page);
		
		//image post
		let msg, img ="";
		if(message == ""){
			msg = "Facebook Image Post";
			img = img_feed+'/'+obj.P_ID_Post+'.jpg';
		}
		else{
			msg = obj.P_Message;
			img = 'dist/img/icon/facebook.png';
		}
		
		$("#img_feed").attr('src', img);
		$("#PostTitle").html(msg);
		$("#DateCreate").text(obj.P_ddate);
	
		$(".chat_aktif").removeClass("hide").show();
		$(".chat_option").removeClass("hide").show();
		$("#form_send").removeClass("hide").show();

		//Load Feed Conversation
		FeedConversation(obj.P_ID_Post, obj.P_User_Name, obj.P_Message,obj.P_ID_Page);
	}
    
	
	//Load Feed Conversation
	// FeedConversation(post_id, user_name,message,page_id);
	
}


function createTicket(){
    // alert($("#ChatID").val());
	let w = "200";
    let h = "400";
    let left = (screen.width/2)-(w/2);
    let top = (screen.height/2)-(h/2);
	let userid = gup('id', location.search);
    
    // $("#btn_create_ticket").addClass("hide");
	//newwindow=window.open("../addticketchat.aspx?chatid="+$("#ChatID").val()+"&agentid="+userid+"&email="+$("#Email").val(),'width=1000px,Height=700px,toolbar=0,menubar=0,location=0,top='+top+',left='+left);  
	//Ini fungsiny buat create icket restu yg edit
	// newwindow=window.open("../addticketchat.aspx?ket=chat&id="+$("#ChatID").val()+"&cid="+$("#ChatID").val()+"&agentid="+userid+"&email="+$("#Email").val(),'width=1000px,Height=700px,toolbar=0,menubar=0,location=0,top='+top+',left='+left);
	newwindow=window.open("https://ice.icephone.id:7021/HTML/tr_utama.aspx?ket=chat&id="+$("#ChatID").val()+"&cid="+$("#ChatID").val()+"&agentid="+userid+"&email="+$("#Email").val(),'width=1000px,Height=700px,toolbar=0,menubar=0,location=0,top='+top+',left='+left);
	
}


function base64(file, callback) {
	var coolFile = {};
	function readerOnload(e) {
		var base64 = btoa(e.target.result);
		coolFile.base64 = base64;
		callback(coolFile)
	};

	var reader = new FileReader();
	reader.onload = readerOnload;

	var file = file[0].files[0];
	coolFile.filetype = file.type;
	coolFile.size = file.size;
	coolFile.filename = file.name;
	reader.readAsBinaryString(file);
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
		
		$('#feed_conversation').append(message);
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
