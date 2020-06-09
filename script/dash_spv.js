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
			},
			colors: ["#f7a35c","#7cb5ec","#90ed7d","#8085e9","#2b908f","#e4d354","#f15c80"],
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


var chart_pie = Highcharts.chart('grafik_pie', {
	chart: {
		type: 'pie',
		margin: 0,
		options3d: {
			enabled: true,
			alpha: 45,
			beta: 0
		}
	},
	title: {
		text: ''
	},
	tooltip: {
		headerFormat: '<b>{series.name} : {point.percentage:.1f} % </b><br>',
		pointFormat: '{point.name} : {point.y}',
		useHTML: true,
		crosshairs: true,
	},
	plotOptions: {
		pie: {
			allowPointSelect: true,
			cursor: 'pointer',
			innerSize: 80,
			depth: 35,
			colors: ["#f7a35c","#7cb5ec","#90ed7d","#8085e9","#2b908f","#e4d354","#f15c80"],
			dataLabels: {
				enabled: false,
				format: '<b>{point.name}</b><br> ({point.y}) {point.percentage:.1f} %',
				distance: -50,
				filter: {
					property: 'percentage',
					operator: '>',
					value: 4
				}
			},
			showInLegend: true,
		}
	},
	legend: {
		enabled: true,
		layout: 'vertical',
		align: 'right',
		verticalAlign: 'top',
		x: -10,
		y: 10,
		floating: false,
		borderWidth: 0,
		backgroundColor: 'transparent',
		shadow: false
	},
	credits: {
		enabled:false
	},
	series: []
	// series: [{
		// name: 'Total',
		// data : isi
	// }]
});
	
	
function LoadData() {
	
	var UserParam = gup('id', location.search);
	var UserLevel = gup('lvlUser', location.search);
	var UserOrg = gup('org', location.search);

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
	
	
	if (chart_pie) {
		var x_axis2 = chart_pie.xAxis[0];
        var series2 = chart_pie.series[0];
				
        // $.getJSON("http://122.50.5.154:8015/tlt_GetBalanar/Service1.svc/Get_Balanar?value={Raw:'',Data1:'BarToday',Data2:'"+UserParam+"',Data3:'"+UserLevel+"',Data4:'',Data5:'',Data6:'',Data7:'',Data8:'',Data9:'',Data10:''}", function( json ) {
        $.getJSON("../script/json_bar.json", function( json ) {
			var data = json.Raw;
			var isi = [];
			var kategori = [];
			var total_summary = 0;
						
			// console.log(chart_pie.series.length);
			for(var i = chart_pie.series.length -1; i > -1; i--) {
				chart_pie.series[i].remove();
			}
			
			for(var i=0; i < data.length; i++){
				// var dayNya = data[i].dayNya;
				var ticket = data[i].Ticket;
				var jumlah = parseInt( data[i].Jumlah );
				// total_summary+=Jumlah;
				isi.push( [ticket , jumlah] );
				
			}
			
			chart_pie.addSeries({
					name: 'Persentase',
					data: isi
				});	
			chart_pie.redraw();	
			// $("#total_summary").html(total_summary);
		});
    }
	
}

// INTERVAL LOAD DATA CHART
$('#btn-refresh').click(function () {
	LoadData();	
});
// setInterval(function () {
	LoadData();	
// }, 5000); //End Interval



