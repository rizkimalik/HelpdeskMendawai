$(document).ready(function () {
    //  init_page();
     Login();
	 // $("#callee").val()
	// $("#sip").val()
 });
 
 var SESSION_STATUS = Flashphoner.constants.SESSION_STATUS; 
 var CALL_STATUS = Flashphoner.constants.CALL_STATUS;
 var MEDIA_DEVICE_KIND = Flashphoner.constants.MEDIA_DEVICE_KIND;
 var localVideo = document.getElementById("localVideo");
 var remoteVideo = document.getElementById("remoteVideo");
 var currentCall;
 var statIntervalId;
 var seconds = 0, minutes = 0, time= null;
 
 var url = 'wss://wss.icephone.id:8443';
 var login = 'invision.reza';
 var auth = 'invision.reza';
 var pass = 'invision123';
 var domain = 'icephonevision.com';
 var proxy = 'icephonevision.com';
 var port = '5060';
 var required = 'true';
 // var callee = 'invision.malik';
 var callee = $("#callee").val();
                          
 function thick() {
     seconds++;
     if (seconds >= 60) {
         seconds = 0;
         minutes++;
         if (minutes >= 60) {
             minutes = 0;
         }
     }
     $("#timer").text( (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));   
 }
 
 function startTimer() {
     time = setInterval(thick, 1000);
 }
 
 function stopTimer() {
     seconds = 0; minutes = 0;
     clearInterval(time);
 }
 
 function refreshParent(sipuser) {
     //alert("ad");
     // window.opener.location.assign("../../tr_utama.aspx?id=779&ivcid=251306&name=nurmansyahcs22@gmail.com&ket=EMAIL&idref=779&email="+sipuser);
	 // window.open("https://ice.icephone.id:7021/HTML/tr_utama.aspx?id=779&ivcid=251306&name=nurmansyahcs22@gmail.com&ket=EMAIL&idref=779&email="+sipuser);
     
 }
 
 function init_page(){
     //init api
     try {
         Flashphoner.init({flashMediaProviderSwfLocation: 'media-provider.swf',
             mediaProvidersReadyCallback: function(mediaProviders) {
                 //hide remote video if current media provider is Flash
                 if (mediaProviders[0] == "Flash") {
                     $("#remoteVideoWrapper").hide();
                     $("#localVideoWrapper").attr('class', 'fp-remoteVideo');
                 }
             }});
     } catch(e) {
         console.log("Your browser doesn't support Flash or WebRTC!");
         return;
     }
 
     if(!Browser.isChrome()) {
         $('#speakerForm').remove();
     }
 
     Flashphoner.getMediaDevices(null, true, MEDIA_DEVICE_KIND.ALL).then(function (list) {
         for (var type in list) {
             if (list.hasOwnProperty(type)) {
                 list[type].forEach(function(device) {
                     if (device.type == "mic") {
                         var list = document.getElementById("micList");
                         if ($("#micList option[value='" + device.id + "']").length == 0) {
                             var option = document.createElement("option");
                             option.text = device.label || device.id;
                             option.value = device.id;
                             list.appendChild(option);
                         }
                     } else if (device.type == "speaker") {
                         var list = document.getElementById("speakerList");
                         if (list && $("#speakerList option[value='" + device.id + "']").length == 0) {
                             var option = document.createElement("option");
                             option.text = device.label || device.id;
                             option.value = device.id;
                             list.appendChild(option);
                         }
                     } else if (device.type == "camera") {
                         var list = document.getElementById("cameraList");
                         if ($("#cameraList option[value='" + device.id + "']").length == 0) {
                             var option = document.createElement("option");
                             option.text = device.label || device.id;
                             option.value = device.id;
                             list.appendChild(option);
                         }
                     }
                 });
             }
         
         }
         $( "#speakerList" ).change(function() {
             if (currentCall) {
                 currentCall.setAudioOutputId($(this).val());
             }
         });
     }).catch(function (error) {
         console.log("Failed to get media devices "+error);
     });
 
     //local and remote displays
     // localVideo = document.getElementById("localVideo");
     // remoteVideo = document.getElementById("remoteVideo");
	 
     // Display outgoing call controls
     showOutgoing();
     onHangupOutgoing();
     onDisconnected();

     $("#btn_hold").click(function () {
        var state = $(this).val();

        if (state == "Hold") {
            $(this).val('Unhold');
            $(this).html('<span class="btn-icon-wrap"><i class="fa fa-play"></i></span>');
            currentCall.hold();
        } else {
            $(this).val('Hold');
            $(this).html('<span class="btn-icon-wrap"><i class="fa fa-pause"></i></span>');
            currentCall.unhold();
        }
    });
 }
 
 
 function connect() {
     if (Browser.isSafariWebRTC() && Flashphoner.getMediaProviders()[0] === "WebRTC") {
         Flashphoner.playFirstVideo(localVideo, true);
         Flashphoner.playFirstVideo(remoteVideo, false);
     }

     var sipOptions = {
         login: login,
         authenticationName: auth,
         password: pass,
         domain: domain,
         outboundProxy: proxy,
         port: port,
         registerRequired: required
     };
     
     var connectionOptions = {
         urlServer: url,
         sipOptions: sipOptions
     };
     
     
     //create session
     console.log("Create new session : " + url);
     console.log(sipOptions);
     Flashphoner.createSession(connectionOptions).on(SESSION_STATUS.ESTABLISHED, function(session){
         onConnected(session);
         console.log(SESSION_STATUS.ESTABLISHED + " - " + sipOptions.login);
         $('#callStatus').text(SESSION_STATUS.ESTABLISHED);
		 		
         if (!required) {
             disableOutgoing(false);
         }
         
     }).on(SESSION_STATUS.REGISTERED, function(session){
         onConnected(session);
         console.log(SESSION_STATUS.REGISTERED + " - " + sipOptions.login);
         $('#callStatus').text(SESSION_STATUS.REGISTERED);
		//  SoundControl.getInstance().playSound("REGISTER");
		
         if (required) {
             disableOutgoing(false);
         }
         
     }).on(SESSION_STATUS.DISCONNECTED, function(){
         onDisconnected();
         console.log(SESSION_STATUS.DISCONNECTED);
         $('#callStatus').text(SESSION_STATUS.DISCONNECTED);
        //  notify('error', SESSION_STATUS.DISCONNECTED, 'Koneksi Terputus.');
		
     }).on(SESSION_STATUS.FAILED, function(){
         onDisconnected();
         console.log(SESSION_STATUS.FAILED);
         notify('error', SESSION_STATUS.DISCONNECTED, 'Koneksi Gagal.');
         $('#callStatus').text(SESSION_STATUS.FAILED);
         
     }).on(SESSION_STATUS.INCOMING_CALL, function(call){
         call.on(CALL_STATUS.RING, function(){
             // setStatus("#callStatus", CALL_STATUS.RING);
         }).on(CALL_STATUS.HOLD, function() {
             // $("#holdBtn").prop('disabled',false);
         }).on(CALL_STATUS.ESTABLISHED, function(){
             // setStatus("#callStatus", CALL_STATUS.ESTABLISHED);
             enableMuteToggles(true);
             // $("#holdBtn").prop('disabled',false);
             // $('[id^=switch]').prop('disabled', false);
         }).on(CALL_STATUS.FINISH, function(){
             // setStatus("#callStatus", CALL_STATUS.FINISH);
             onHangupIncoming();
             currentCall = null;
         }).on(CALL_STATUS.FAILED, function(){
             // setStatus("#callStatus", CALL_STATUS.FAILED);
             onHangupIncoming();
             currentCall = null;
         });
         onIncomingCall(call);
     });
 }
 
 function callVoice() {
     var session = Flashphoner.getSessions()[0];
     
     var constraints = {
         audio: true,
         video: false
     };
     
     //prepare outgoing call 
     var outCall = session.createCall({
         callee: callee,
         visibleName: login,
         localVideoDisplay: localVideo,
         remoteVideoDisplay: remoteVideo,
         constraints: constraints,
         receiveAudio: true,
         receiveVideo: false,
         stripCodecs:"SILK"
     }).on(CALL_STATUS.RING, function(){
         // setStatus("#callStatus", CALL_STATUS.RING);
     }).on(CALL_STATUS.ESTABLISHED, function(){
         // setStatus("#callStatus", CALL_STATUS.ESTABLISHED);
         // $("#holdBtn").prop('disabled',false);
         onAnswerOutgoing("voice");
         
     }).on(CALL_STATUS.HOLD, function() {
         // $("#holdBtn").prop('disabled',false);
     }).on(CALL_STATUS.FINISH, function(){
         // setStatus("#callStatus", CALL_STATUS.FINISH);
         onHangupOutgoing();
         currentCall = null;
     }).on(CALL_STATUS.FAILED, function(){
         // setStatus("#callStatus", CALL_STATUS.FAILED);
         onHangupIncoming();
         currentCall = null;
     });
     
     outCall.call();
     currentCall = outCall;
     
     SoundControl.getInstance().playSound("RING");
     
     //hangup Button
     $("#btn_hangup").unbind('click').click(function(){
         outCall.hangup();	
     });
	 
	 jenisCall("voice");
	 disableOutgoing(true);
	 $("#timer").addClass("hide").hide();
	 $("#voice_call_screen").removeClass("hide").show();	
	 $("#callee").addClass("hide").hide();
	 $("#btn_answer").addClass("hide").hide();
	 $("#btn_hangup").removeClass("hide").show();
	 $("#btn_hold").removeClass("hide").show();
	 $("#voice_call").addClass("hide").hide();
	 $("#video_call").addClass("hide").hide();
 }
 
 function callVideo() {
     var session = Flashphoner.getSessions()[0];
     var constraints = getConstraints();
     var outCall = session.createCall({
         callee: callee,
         visibleName: login,
         remoteVideoDisplay: remoteVideo,
         localVideoDisplay: localVideo,
         constraints: constraints,
         sdpHook: rewriteSdp,
         stripCodecs:"SILK"
     }).on(CALL_STATUS.RING, function(){
         // setStatus("#callStatus", CALL_STATUS.RING);
     }).on(CALL_STATUS.ESTABLISHED, function(){
         // setStatus("#callStatus", CALL_STATUS.ESTABLISHED);
         onAnswerOutgoing("video");
         // $("#holdBtn").prop('disabled',false);
     }).on(CALL_STATUS.HOLD, function() {
         // $("#holdBtn").prop('disabled',false);
     }).on(CALL_STATUS.FINISH, function(){
         // setStatus("#callStatus", CALL_STATUS.FINISH);
         onHangupOutgoing();
         currentCall = null;
     }).on(CALL_STATUS.FAILED, function(){
         // setStatus("#callStatus", CALL_STATUS.FAILED);
         onHangupIncoming();
         currentCall = null;
     });
     outCall.setAudioOutputId($('#speakerList').find(":selected").val());
     outCall.call();
     currentCall = outCall;
     statIntervalId = setInterval(loadStats, 2000);
     
     SoundControl.getInstance().playSound("RING");
     
     //hangup Button
     $("#btn_hangup").unbind('click').click(function(){
         outCall.hangup();	
     });
	 
	 disableOutgoing(true);
	 jenisCall("video");
	 $("#timer").addClass("hide").hide();
	 $("#callee").addClass("hide").hide();
	 $("#video_call_screen").removeClass("hide").show();
	 $("#btn_answer").addClass("hide").hide();
     $("#btn_hangup").removeClass("hide").show();
     $("#btn_hold").addClass("hide").hide();
	 $("#voice_call").addClass("hide").hide();
	 $("#video_call").addClass("hide").hide();
 }
 
 function onConnected(session) {
     $("#disconnectBtn").unbind('click').click(function(){
         $(this).prop('disabled', true);
         if (currentCall) {
             showOutgoing();
             disableOutgoing(true);
             currentCall.hangup();
         }
         session.disconnect();
         location.reload();
     });
 }
 
 
 function onDisconnected() {
	 disableOutgoing(true);
     showOutgoing();
 }
 
 function Login(){
	init_page();
	$(this).prop('disabled', true);
	connect();
	return false;
 }
 
 
 //call keluar diterima
 function onAnswerOutgoing(jenis) {
     startTimer();
     enableMuteToggles(true);
     
    jenisCall(jenis);
	$("#timer").removeClass("hide").show();
	SoundControl.getInstance().stopSound("RING");
 }
 
 //call keluar tidak diterima
 function onHangupOutgoing() {
     stopTimer();
     disableOutgoing(false);
     enableMuteToggles(false);
	 SoundControl.getInstance().stopSound("RING");
	//  SoundControl.getInstance().playSound("FINISH");
     $("#timer").addClass("hide").hide();
     $("#callee").removeClass("hide").show();
     $("#video_call_screen").addClass("hide").hide();
     $("#voice_call_screen").addClass("hide").hide();
     $("#btn_answer").addClass("hide").hide();
	 $("#btn_hangup").addClass("hide").hide();
	 $("#btn_hold").addClass("hide").hide();
	 $("#voice_call").removeClass("hide").show();
	 $("#video_call").removeClass("hide").show();
 }
 
 //panggilan masuk
 function onIncomingCall(inCall) {
     var constraints = getConstraints();
     SoundControl.getInstance().playSound("RING");
     currentCall = inCall;
     showIncoming(inCall.visibleName());
     statIntervalId = setInterval(loadStats, 2000);
     refreshParent(inCall.visibleName());
     // alert("call masuk");
     $("#btn_answer").unbind('click').click(function(){
         inCall.setAudioOutputId($('#speakerList').find(":selected").val());
         inCall.answer({
                 localVideoDisplay: localVideo,
                 remoteVideoDisplay: remoteVideo,
                 constraints: constraints,
                 sdpHook: rewriteSdp,
                 stripCodecs:"SILK"
             });
         showAnswered();
         SoundControl.getInstance().stopSound("RING");
         
     });
     
     $("#btn_hangup").off('click').click(function(){
         inCall.hangup();
     });
	 // console.log(inCall);
 }
 
 //panggilan gagal/ditolak
 function onHangupIncoming() {
     clearInterval(statIntervalId);
     showOutgoing();
     enableMuteToggles(false);
     stopTimer();
	 SoundControl.getInstance().stopSound("RING");
	//  SoundControl.getInstance().playSound("FINISH");
     $("#timer").addClass("hide").hide();
     $("#callee").removeClass("hide").show();
     $("#incoming_call_screen").addClass("hide").hide();
     $("#video_call_screen").addClass("hide").hide();
     $("#btn_call_screen").addClass("hide").hide();
     $("#incoming_call_alert").addClass("hide").hide();
	 $("#btn_answer").addClass("hide").hide();
	 $("#btn_hangup").addClass("hide").hide();
	 $("#btn_hold").addClass("hide").hide();
	 $("#voice_call").removeClass("hide").show();
	 $("#video_call").removeClass("hide").show();
 }
 
 
 // Display view for incoming call
 function showIncoming(callerName){
     stopTimer();
    //  maximize(); //popup window call
     var WindowCall = document.getElementById("WindowCall");
     WindowCall.style.display = "block";

	 SoundControl.getInstance().playSound("RING");
	 $("#callee").addClass("hide").hide();
     $("#timer").addClass("hide").hide();
     $("#incoming_call_screen").removeClass("hide").show();
     $("#video_call_screen").addClass("hide").hide();	
     $("#voice_call_screen").addClass("hide").hide();	
	 $("#btn_answer").removeClass("hide").show();
	 $("#btn_hangup").removeClass("hide").show();
	 $("#btn_hold").addClass("hide").hide();
	 $("#voice_call").addClass("hide").hide();
	 $("#video_call").addClass("hide").hide();
	 $("#incoming_call_alert").removeClass("hide").show().html("Kamu sedang dalam panggilan dari <b>" + callerName + "</b>");
	 HistoryCall(callerName);
 }
 
 // Display view for outgoing call
 function showOutgoing(){
     stopTimer();
     SoundControl.getInstance().playSound("RING");
     $("#timer").addClass("hide").hide();
     $("#incoming_call_screen").addClass("hide").hide();
     $("#video_call_screen").removeClass("hide").show();	
     $("#btn_call_screen").removeClass("hide").show();
     onHangupOutgoing();
 }
 
 
 // Display view for answered call
 function showAnswered(){
     startTimer();
	 SoundControl.getInstance().stopSound("RING");
     $("#timer").removeClass("hide").show();
     $("#incoming_call_screen").addClass("hide").hide();
     $("#video_call_screen").removeClass("hide").show();	
     $("#btn_answer").addClass("hide").hide();
     $("#btn_hold").removeClass("hide").show();
     $("#incoming_call_alert").hide();
 }
 
 
 //BUTTON CALL VIDEO
 $("#video_call").click(function() {
     if( callee != ""){
         callVideo();
     }else{
         $("#callee").focus();
     }
     
 });
 
 $("#voice_call").click(function() {
	 // alert(callee);
     if( callee != ""){
         callVoice();
     }else{
         $("#callee").focus();
     }
 });
 
 
function HistoryCall(callerName){
	let html = "";
	 
	html += '<tr>'+
		'<td>'+
			'<div class="media align-items-center">'+
				'<div class="media-img-wrap d-flex mr-10">'+
					'<div class="avatar avatar-xs">'+
						'<span class="avatar-text avatar-text-primary rounded-circle"><span class="initial-wrap"><span><i class="fa fa-user"></i></span></span>'+
						'</span>'+
					'</div>'+
				'</div>'+
				'<div class="media-body">'+
					'<span class="d-block">' +callerName+ '</span>'+
				'</div>'+
			'</div>'+
		'</td>'+
	'</tr>';
	
	$('#call_history').append(html);
}
 
 /************************************************************/
 function jenisCall(jenis) {
     if(jenis == "voice"){
         $("#voice_call_screen").removeClass("hide").show();	
         $("#video_call_screen").addClass("hide").hide();
     }
     else{
         $("#voice_call_screen").addClass("hide").hide();	
         $("#video_call_screen").removeClass("hide").show();	
     }
 }

 
 function loadStats() {
     if (currentCall) {
         currentCall.getStats(function (stats) {
             if (stats && stats.outboundStream) {
                 if (stats.outboundStream.videoStats) {
                     $('#videoStatBytesSent').text(stats.outboundStream.videoStats.bytesSent);
                     $('#videoStatPacketsSent').text(stats.outboundStream.videoStats.packetsSent);
                     $('#videoStatFramesEncoded').text(stats.outboundStream.videoStats.framesEncoded);
                 } else {
                     $('#videoStatBytesSent').text(0);
                     $('#videoStatPacketsSent').text(0);
                     $('#videoStatFramesEncoded').text(0);
                 }
 
                 if (stats.outboundStream.audioStats) {
                     $('#audioStatBytesSent').text(stats.outboundStream.audioStats.bytesSent);
                     $('#audioStatPacketsSent').text(stats.outboundStream.audioStats.packetsSent);
                 } else {
                     $('#audioStatBytesSent').text(0);
                     $('#audioStatPacketsSent').text(0);
                 }
             }
         });
     }
 }
 
 // Set connection and call status
 function setStatus(selector, status) {
     var statusField = $(selector);
     statusField.text(status).removeClass();
     if (status == "REGISTERED" || status == "ESTABLISHED") {
         statusField.attr("class","text-success");
     } else if (status == "DISCONNECTED" || status == "FINISH") {
         statusField.attr("class","text-muted");
     } else if (status == "FAILED") {
         statusField.attr("class","text-danger");
     } else if (status == "TRYING" || status == "RING") {
         statusField.attr("class","text-primary");
     }
 }
 
 function disableOutgoing(disable) {
     $('#callee').prop('disabled', disable);
     $("#video_call").prop('disabled', disable);
 }
 
 function disableConnectionFields(formId, disable) {
     $('#' + formId + ' :text').each(function(){
        $(this).prop('disabled', disable);
     });
     $('#' + formId + ' :password').prop('disabled', disable);
     $('#' + formId + ' :checkbox').prop('disabled', disable);
 }
 
 function validateForm(formId) {
     var valid = true;
     
     $('#' + formId + ' :text').each(function(){
         if(!filledInput($(this)) && valid) {
             valid = false;
         }
     });
     
     if(!filledInput($('#' + formId + ' :password')) && valid) {
         valid = false;
     }
     
     return valid;
 }
 
 function filledInput(input) {
     var valid = true;
     if (!input.val()) {
         valid = false;
         input.closest('.input-group').addClass("has-error");
     } else {
         input.closest('.input-group').removeClass("has-error");
     }
     
     return valid;
 }
 
 // Mute audio in the call
 function mute() {
     if (currentCall) {
         currentCall.muteAudio();
     }
 }
 
 // Unmute audio in the call
 function unmute() {
     if (currentCall) {
         currentCall.unmuteAudio();
     }
 }
 
 // Mute video in the call
 function muteVideo() {
     if (currentCall) {
         currentCall.muteVideo();
     }
 }
 
 // Unmute video in the call
 function unmuteVideo() {
     if (currentCall) {
         currentCall.unmuteVideo();
     }
 }
 
 function getConstraints() {
     var constraints = {
         audio: {deviceId: {exact: $('#micList').find(":selected").val()}},
         video: {
             deviceId: {exact: $('#cameraList').find(":selected").val()},
             width: parseInt($('#sendWidth').val()),
             height: parseInt($('#sendHeight').val())
         }
     };
     if (Browser.isSafariWebRTC() && Browser.isiOS() && Flashphoner.getMediaProviders()[0] === "WebRTC") {
         constraints.video.width = {min: parseInt($('#sendWidth').val()), max: 640};
         constraints.video.height = {min: parseInt($('#sendHeight').val()), max: 480};
     }
     return constraints;
 }
 
 function enableMuteToggles(enable) {
     var $muteAudioToggle = $("#muteAudioToggle");
     var $muteVideoToggle = $("#muteVideoToggle");
     
     if (enable) {
         $muteAudioToggle.removeAttr("disabled");
         $muteAudioToggle.trigger('change');
         $muteVideoToggle.removeAttr("disabled");
         $muteVideoToggle.trigger('change');
     }
     else {
         $muteAudioToggle.prop('checked',false).attr('disabled','disabled').trigger('change');
         $muteVideoToggle.prop('checked',false).attr('disabled','disabled').trigger('change');
     }
 }
 
 function rewriteSdp(sdp) {
     var sdpStringFind = $("#sdpStringFind").val();
     var sdpStringReplace = $("#sdpStringReplace").val();
     if (sdpStringFind != 0 && sdpStringReplace != 0) {
         var newSDP = sdp.sdpString.toString();
         newSDP = newSDP.replace(sdpStringFind, sdpStringReplace);
         return newSDP;
     }
     return sdp.sdpString;
 }