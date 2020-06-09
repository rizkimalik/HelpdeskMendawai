var DashLine = Highcharts.chart('grafik_detail_channel', {
	chart: {
		type: 'spline',
		zoomType: 'x'
	},
	title: {
		text: ''
	},
	subtitle: {
		text: ''
	},
	xAxis: {
		title: {
			text: ''
		},
		labels: {
			overflow: 'justify'
		}
	},
	yAxis: {
		title: {
			text: ''
		},
	},
	legend: {
		enabled: true,
		layout: 'vertical',
		align: 'right',
		verticalAlign: 'top',
		x: -10,
		y: 10,
		floating: true,
		borderWidth: 0,
		backgroundColor: 'transparent',
		shadow: false
	},
	tooltip: {
		headerFormat: '<span style="font-size:12px;margin-left:10px;"><b> {point.key}</b></span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0;font-size:10px;" align="right">{series.name}: </td>' +
            '<td style="padding:0;font-size:10px;"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
	},
	plotOptions: {
		spline: {
			marker: {
				enable: false
			}
		},
	},
	credits:{
		enabled : false
	},
	series: []
	
});



async function DashLineChannel(){		
	if (DashLine) {
		const x_axis1 = DashLine.xAxis[0];
		const url = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"DashLineChannel",Data2:"",Data3:"",Data4:"",Data5:"",Data6:"",Data7:"",Data8:"",Data9:"",Data10:""}';

		try {
			const res = await fetch(url);
			const obj = await res.json();
			const data = obj.Raw;

			if (res.ok) {
				let JamNya = [],
				Chating = [],
				Facebook = [],
				Twitter = [],
				Instagram = [],
				Whatsapp = [],
				Email = [];
				
				let colors = ["#00a0dc","#8d6cab","#dd5143","#e68523","#57bfc1","#edb220","#dc4b89","#69a62a","#046293","#66418c"];
				
				// console.log(DashLine.series.length);
				for(var i = DashLine.series.length -1; i > -1; i--) {
					DashLine.series[i].remove();
				}
				
				for(let i=0; i < data.length; i++){
					JamNya.push(data[i].JamNya);
					Chating.push(data[i].Chating);
					Facebook.push(data[i].Facebook);
					Twitter.push(data[i].Twitter);
					Instagram.push(data[i].Instagram);
					Whatsapp.push(data[i].Whatsapp);
					Email.push(data[i].Email);
				}

				x_axis1.setCategories(JamNya);
				DashLine.addSeries({
					name: 'Chating',
					color : colors[0],
					data: Chating
				});
				DashLine.addSeries({
					name: 'Facebook',
					color : colors[1],
					data: Facebook
				}); 
				DashLine.addSeries({
					name: 'Twitter',
					color : colors[2],
					data: Twitter
				}); 
				DashLine.addSeries({
					name: 'Instagram',
					color : colors[3],
					data: Instagram
				}); 
				DashLine.addSeries({
					name: 'Whatsapp',
					color : colors[4],
					data: Whatsapp
				}); 
				DashLine.addSeries({
					name: 'Email',
					color : colors[5],
					data: Email
				}); 
				
				DashLine.redraw();
				return res;
			}
		} 
		catch (error) {
			console.log(error);	
		}
	}
}
DashLineChannel();


async function DashTotalChannel(){
	const userid = getCookie("sip");
	let url = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"DashTotalChannel",Data2:"'+userid+'",Data3:"",Data4:"",Data5:"",Data6:"",Data7:"",Data8:"",Data9:"",Data10:""}';
	
	try {
		const res = await fetch(url);
		const obj = await res.json();
		const array = obj.Raw;

		if(res.ok){
			let allchannel = [];
			// console.log(obj)
			
			if(obj.Result == "True"){
				for (let i = 0; i < array.length; i++) {
					allchannel.push(array[i].Total);
					
					if (array[i].AssignTo == "Chat") {
						$("#txtChat").text(array[i].Total);
 					}
					else if (array[i].AssignTo == "FBMessenger") {
						$("#txtFBMessenger").text(array[i].Total);
					} 
					else if (array[i].AssignTo == "FBFeed_Comment" || array[i].AssignTo == "FBFeed_Reply") {
						$("#txtFBFeed").text(array[i].Total);
					} 
					else if (array[i].AssignTo == "FBMention") {
						$("#txtFBMention").text(array[i].Total);
					} 
					else if (array[i].AssignTo == "TWMention") {
						$("#txtTWMention").text(array[i].Total);
					} 
					else if (array[i].AssignTo == "DMTwitter") {
						$("#txtDMTwitter").text(array[i].Total);
					} 
					else if (array[i].AssignTo == "IGFeed") {
						$("#txtIGFeed").text(array[i].Total);
					} 
					else if (array[i].AssignTo == "Email") {
						$("#txtEmail").text(array[i].Total);
					} 
					else if (array[i].AssignTo == "Whatsapp") {
						$("#txtWhatsapp").text(array[i].Total);
					} 
					else {}
				}
				
				
				function getSum(total, num) {
					return total + Math.round(num);
				}
				$("#txtAllChannel").text(allchannel.reduce(getSum, 0));
			}
			return res;
		}
	} 
	catch (error) {
		console.log(error);	
	}

}
DashTotalChannel();

async function DashAgentOnline(){
	let url = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"DashAgentOnline",Data2:"",Data3:"",Data4:"",Data5:"",Data6:"",Data7:"",Data8:"",Data9:"",Data10:""}';

	try {
		const res = await fetch(url);
		const obj = await res.json();
		// const array = obj.Raw;

		if(res.ok){
			let html = "";
			// console.log(obj)
			
			$("#jml_agent").html(obj.Raw.length);
			for (let i = 0; i < obj.Raw.length; i++) {
				html += '<div class="media">'+
					'<div class="media-img-wrap">'+
						'<div class="avatar avatar-xs">'+
							'<img src="dist/img/agent.png" alt="user" class="avatar-img rounded-circle">'+
						'</div>'+
					'</div>'+
					'<div class="media-body">'+
						'<div>'+
							'<span class="d-block mb-5">'+
								'<span class="font-weight-500 text-dark text-capitalize">'+obj.Raw[i].USER_NAME+'</span>'+
								'<small class="pull-right">Max ('+obj.Raw[i].MAX_CHAT+')</small>'+
							'</span>'+
							'<span class="font-13">Today Handled : '+obj.Raw[i].jmlday+'</span><br>'+
							'<span class="d-block font-13">Total Handled : '+obj.Raw[i].jml+'</span>'+
						'</div>'+
					'</div>'+
				'</div>';
			}
			$("#list_agent").html("");
			$("#list_agent").append(html);
			return res;
		}
	} 
	catch (error) {
		console.log({error});	
	}
}
DashAgentOnline();

async function DashTableChannel(){
	const userid = getCookie("sip");
	let url = 'https://ice.icephone.id:8013/tlt_GetBalanar2/Service1.svc/Get_Balanar?value={Raw:"",Data1:"DashTableChannel",Data2:"'+userid+'",Data3:"",Data4:"",Data5:"",Data6:"",Data7:"",Data8:"",Data9:"",Data10:""}';
	
	try {
		const res = await fetch(url);
		const obj = await res.json();
		const array = obj.Raw;

		if(res.ok){
			let html = "";
			let icon = "";
			let label = "";
			// console.log(obj)

			for (let i = 0; i < obj.Raw.length; i++) {

				if(obj.Raw[i].AssignTo == 'FBMessenger'){
					icon = "dist/img/icon/messenger.png";
					label = "Messenger <br> <small>( " + obj.Raw[i].Page_Name + " )</small>";
				}
				else if(obj.Raw[i].AssignTo == 'FBFeed_Comment'){
					icon = "dist/img/icon/facebook.png";
					label = "Facebook Feeds <br> <small>( " + obj.Raw[i].Page_Name + " )</small>";
				}
				else if(obj.Raw[i].AssignTo == 'FBFeed_Reply'){
					icon = "dist/img/icon/facebook.png";
					label = "Facebook Feeds <br> <small>( " + obj.Raw[i].Page_Name + " )</small>";
				}
				else if(obj.Raw[i].AssignTo == 'FBMention'){
					icon = "dist/img/icon/facebook.png";
					label = "Facebook Mention <br> <small>( " + obj.Raw[i].Page_Name + " )</small>";
				}
				else if(obj.Raw[i].AssignTo == 'TWMention'){
					icon = "dist/img/icon/twitter.png";
					label = "Twitter Mention <br> <small>( " + obj.Raw[i].Page_Name + " )</small>";
				}
				else if(obj.Raw[i].AssignTo == 'DMTwitter'){
					icon = "dist/img/icon/twitter_dm.png";
					label = "Twitter DM <br> <small>( " + obj.Raw[i].Page_Name + " )</small>";
				}
				else if(obj.Raw[i].AssignTo == 'IGFeed'){
					icon = "dist/img/icon/instagram.png";
					label = "Instagram Feeds <br> <small>( " + obj.Raw[i].Page_Name + " )</small>";
				}
				else {
					icon = "dist/img/icon/chat.png";
					label = "Chat";
				}

				html += '<tr>'+
					'<td>'+
						'<div class="media align-items-center">'+
							'<div class="media-img-wrap d-flex mr-10">'+
								'<div class="avatar avatar-xs"><img src="'+icon+'" alt="user" class="avatar-img rounded-circle"></div>'+
							'</div>'+
							'<div class="media-body">'+
								'<span class="d-block">'+label+'</span>'+
							'</div>'+
						'</div>'+
					'</td>'+
					'<td><span class="w-130p d-block text-truncate">'+obj.Raw[i].UserID+'</span></td>'+
					'<td>'+obj.Raw[i].Nama+'</td>'+
					'<td><span class="w-130p d-block text-truncate">'+obj.Raw[i].Pesan+'</span></td>'+
					'<td>'+obj.Raw[i].DateCreate+'</td>'+
					'<td>'+obj.Raw[i].agent_handle+'</td>'+
				'</tr>';
			}
			$("#tbl_dashchannel").html("");
			$("#tbl_dashchannel").append(html);
			return res;
		}
	} 
	catch (error) {
		console.log(error);	
	}

}
DashTableChannel();

$("#btn_refresh").click(function () { 
	// DashBarChannel();
	DashLineChannel();
	DashTotalChannel();
	DashAgentOnline();
	DashTableChannel();
});

setInterval(function(){ 
	// $("#btn_refresh").trigger("click"); 
	DashLineChannel();
	DashTotalChannel();
	DashAgentOnline();
	DashTableChannel();
}, 5000);
