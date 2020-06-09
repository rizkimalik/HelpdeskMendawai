function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

//CHART AGENT CREATE	
var chart_agent_create = Highcharts.chart('grafik_line', {
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
		type: 'datetime',
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
		headerFormat: '<b>{series.name}</b><br/>',
		pointFormat: '{point.name} : {point.y}',
		useHTML: true,
		crosshairs: false,
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
	// series: [{
		// name: '',
		// data: []
	// }]
	/* series: [{
        name: 'John',
        data: [5, 3, 4, 7, 2]
    }, {
        name: 'Jane',
        data: [2, 2, 3, 2, 1]
    }, {
        name: 'Joe',
        data: [3, 4, 4, 2, 5]
    }] */
	
});

//CHART SUMMARY CREATE
var chart_summary_create = Highcharts.chart('grafik_bar', {
	chart: {
		type: 'column'
	},
	title: {
		text: ''
	},
	xAxis: {
		type: 'category',
		labels: {
            style: {
                fontSize: '9px',
            }
        }
	},
	yAxis: {
		min: 0,
		title: {
			text: ''
		}
	},
	tooltip: {
		headerFormat: '<center><b>{series.name}</b></center>',
		pointFormat: 'Total : {point.y}',
		useHTML: true,
		crosshairs: false,
	
	},
	plotOptions: {
		column: {
            dataLabels: {
                enabled: false
            },
        },
		series: {
            stacking: 'normal'
        }
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
	credits:{
		enabled : false
	},
	series: []
	// series: [{
		// name: '',
		// data: []
	// }] 
});

function LoadData() {
	
	var UserParam = gup('id', location.search);
	var UserLevel = gup('lvlUser', location.search);
	var UserOrg = gup('org', location.search);
	
	/* fetch("http://122.50.5.154:8015/tlt_GetBalanar/Service1.svc/Get_Balanar?value={Raw:'',Data1:'TotalTicket',Data2:'"+UserParam+"',Data3:'"+UserLevel+"',Data4:'d',Data5:'',Data6:'',Data7:'',Data8:'',Data9:'',Data10:''}")
			   .then((response) => response.json())
			   .then((responseJson) => {

			let str = JSON.stringify(responseJson);
			let obj = JSON.parse(str);
			var totalOpen,totalProgress,totalPending,totalClosed;
			if (obj.Result == "True") {
				
				for (i = 0; i < obj.Raw.length; i++) {
					//alert(obj.Raw[i].status);
					if(obj.Raw[i].status == "Open"){
					totalOpen= obj.Raw[i].Total;
					}else if(obj.Raw[i].status == "Progress"){
					totalProgress= obj.Raw[i].Total;
					}else if(obj.Raw[i].status == "Pending"){
					totalPending= obj.Raw[i].Total;
					}else{
					totalClosed= obj.Raw[i].Total;
					}
				}
				$("#progress").html(totalProgress);
				$("#open").html(totalOpen);
				$("#pending").html(totalPending);
				$("#close").html(totalClosed);
			}
		})
	.catch((error) => {
		console.error(error);
	}); */

		
	//LOAD DATA CHART LINE JSON2
	if (chart_agent_create) {
		var x_axis1 = chart_agent_create.xAxis[0];
        var series1 = chart_agent_create.series[0];
		
        // $.getJSON( "http://122.50.5.154:8015/WsLine/Service1.svc/getDataYou/" + UserParam +"/"+ UserLevel +"/"+UserOrg, function( json ) {
        $.getJSON( "../script/json_line.json", function( json ) {
			var data = json.Raw;
			var total_agent = 0;
			var colors = ["#00a0dc","#8d6cab","#dd5143","#e68523","#57bfc1","#edb220","#dc4b89","#69a62a","#046293","#66418c"];
			
			// console.log(chart_agent_create.series.length);
			for(var i = chart_agent_create.series.length -1; i > -1; i--) {
				chart_agent_create.series[i].remove();
			}
			
			for(var i=0; i < data.length; i++){
				var Ticket = data[i].Ticket;
				var isi = [];
				var kategori = [];
				
				for(var x=0; x < data[i].Data.length; x++){
				    var JamNya = data[i].Data[x].JamNya;
				    var Jumlah = parseInt( data[i].Data[x].Jumlah );
					total_agent+=Jumlah;
					
					kategori.push(JamNya);
					isi.push({ name:JamNya, y:Jumlah });
					// isi.push({ name: data[i].Data[x].JamNya, x: data[i].Data[x].JamNya, y: data[i].Data[x].Jumlah});
				}
				
				chart_agent_create.addSeries({
					name: Ticket,
					color : colors[i],
					data: isi
				}); 
				x_axis1.setCategories(kategori);
			}
			
			chart_agent_create.redraw();	
			$("#total_agent").html(total_agent);
		}); 
    } 
	
	//LOAD DATA CHART BAR	
	if (chart_summary_create) {
		var x_axis2 = chart_summary_create.xAxis[0];
        var series2 = chart_summary_create.series[0];
				
        // $.getJSON("http://122.50.5.154:8015/tlt_GetBalanar/Service1.svc/Get_Balanar?value={Raw:'',Data1:'BarToday',Data2:'"+UserParam+"',Data3:'"+UserLevel+"',Data4:'',Data5:'',Data6:'',Data7:'',Data8:'',Data9:'',Data10:''}", function( json ) {
        $.getJSON("../script/json_bar.json", function( json ) {
			var data = json.Raw;
			var isi = [];
			var kategori = [];
			var total_summary = 0;
			var colors = ["#00a0dc","#8d6cab","#dd5143","#e68523","#57bfc1","#edb220","#dc4b89","#69a62a","#046293","#66418c"];
						
			// console.log(chart_summary_create.series.length);
			for(var i = chart_summary_create.series.length -1; i > -1; i--) {
				chart_summary_create.series[i].remove();
			}
			
			for(var i=0; i < data.length; i++){
				var dayNya = data[i].dayNya;
				var Ticket = data[i].Ticket;
				var Jumlah = parseInt( data[i].Jumlah );
				total_summary+=Jumlah;
				
				chart_summary_create.addSeries({
					name: Ticket,
					color : colors[i],
					data: [{
						name: Ticket, 
						y: Jumlah
					}]
				});	
			}
			chart_summary_create.redraw();	
			$("#total_summary").html(total_summary);
		});
    }
	
	
	//LOAD DATA Table AGENT
	/* $.getJSON( "http://122.50.5.154:8015/tlt_GetBalanar/Service1.svc/Get_Balanar?value={Raw:'',Data1:'DataTable',Data2:'"+UserParam+"',Data3:'"+UserLevel+"',Data4:'',Data5:'',Data6:'',Data7:'',Data8:'',Data9:'',Data10:''}", function( json ) {
		var data = json.Raw;
		var text = "";
		// console.log(data);
		for(var i=0; i < data.length; i++){
		    text += "<tr>"+
				"<td>"+data[i].ID+"</td>"+ 
				"<td>"+data[i].TicketNumber+"</td>"+ 
				// "<td>"+data[i].GroupTicketNumber+"</td>"+ 
				// "<td>"+data[i].Channel_Code+"</td>"+ 
				//"<td>"+data[i].UnitID+"</td>"+ 
				//"<td>"+data[i].CategoryID+"</td>"+ 
				"<td>"+data[i].CategoryName+"</td>"+ 
				//"<td>"+data[i].SubCategory1ID+"</td>"+ 
				"<td>"+data[i].SubCategory1Name+"</td>"+ 
				//"<td>"+data[i].SubCategory2ID+"</td>"+ 
				"<td>"+data[i].SubCategory2Name+"</td>"+ 
				//"<td>"+data[i].SubCategory3ID+"</td>"+ 
				"<td>"+data[i].SubCategory3Name+"</td>"+ 
				"<td>"+data[i].DetailComplaint+"</td>"+ 
				"<td>"+data[i].ResponComplaint+"</td>"+ 
				"<td>"+data[i].SLA+"</td>"+ 
				"<td>"+data[i].Status+"</td>"+ 
				"<td>"+data[i].UserCreate+"</td>"+ 
				"<td>"+moment(data[i].DateCreate , 'DD/MM/YYYY').format('DD/MM/YYYY')+"</td>"+ 
				"<td>"+data[i].TicketPosition+"</td>"+ 
				"<td>"+data[i].TicketSourceName+"</td>"+
			"</tr>";
			
		} 
		// document.getElementById("table_agent_create").innerHTML = text;
		
	}); */
}

// INTERVAL LOAD DATA CHART
$('#btn-refresh').click(function () {
	LoadData();	
});
// setInterval(function () {
	LoadData();	
// }, 5000); //End Interval



