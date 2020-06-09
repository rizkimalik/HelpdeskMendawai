$(document).ready(function(){
	getTicketNumber("21164849");
	getDataProfile("21164849");
});

function viewRecent(valIDTable) {
    var jsonText = JSON.stringify({ idTable: valIDTable });
    var tblTickets = "";
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Service.asmx/getEditRecentTicket",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            var tgl = new Date(json[0].DateNya);
            var tanggal = (("0" + tgl.getDate()).slice(-2))+'/'+(("0" + (tgl.getMonth() + 1)).slice(-2))+'/'+tgl.getFullYear();
            console.log(json)

            $("#tglKejadian").val(moment(tgl, 'DD/MM/YYYY').format('YYYY-MM-DD'));
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
/***** Function Mendawai ****/
$("#btnPopupTicket").click(function () {
    getListPenyebab();
    getListKategori();
    windowCreateTicket();
    // getListRecentTicket();
   
});

$("#simpanTicket").click(function () {
    $(".hiddenX").show();
   
    var valTglKejadian = $('#tglKejadian').val();
    var valSelectPenyebab = $('#selectPenyebab').val();
    var valTxtNamaPengadu = $('#txtNamaPengadu').val();
    var valSelectStatus = $('#selectStatusTicket').val();
    var valSelectKategori = $('#selectKategori').val().split("|");
    var valSelectKategoriName = $('#selectKategori option:selected').val();
    var valSelectSub1 = $('#selectSub1').val().split("|");
    var valSelectSub1Name = $("#selectSub1 option:selected").text();
    var valSelectSub2 = $('#selectSub2').val().split("|");
    var valSelectSub2Name = $("#selectSub2 option:selected").text();
    var valSelectSub3 = $('#selectSub3').val().split("|");
    var valSelectSub3Name = $("#selectSub3 option:selected").text();

    var valTxtDeskripsi = $('#txtDeskripsi').val();
    var valTxtResponse = $('#txtResponse').val();

    //alert(valSelectPenyebab);
    //alert("Handler for .click() called.");
    var jsonText = JSON.stringify({nik:"",namapelapor:valTxtNamaPengadu,emailpelapor:"",phonepelapor:"",alamatpelapor:"",emcid:"",account:"",nomorrekening:"",ticketnumber:"",channelcode:"",sourcename:"",categoryid:valSelectKategori[0],categoryname:valSelectKategori[1],subcategory1id:valSelectSub1[0],subcategory1name:valSelectSub1Name,subcategory2id:valSelectSub2[0],subcategory2name:valSelectSub2Name,subcategory3id:valSelectSub3[0],subcategory3name:valSelectSub3Name,detailcomplaint:valTxtDeskripsi,responsecomplaint:valTxtResponse,sla:"",status:valSelectStatus,usercreate:"",divisi:"",enginer:"",position:"",tglkejadian:valTglKejadian,idpenyebab:"",strpenyebab:valSelectPenyebab,strpenerima:"",idstatuspelapor:"",strstatuspelapor:"",lokasiPengaduan:""});

    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Service.asmx/postDataTicket",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";

            $.toast({
                heading: 'Sukses',
                text: '<p>You have successfully completed level 1.</p>',
                position: 'top-right',
                loaderBg: '#00acf0',
                class: 'jq-toast-primary',
                hideAfter: 3500,
                stack: 6,
                showHideTransition: 'fade'
            });
            $("#form_createticket")[0].reset();
        }, complete: function () {
            //back to normal!
            $(".hiddenX").hide();
            getListRecentTicket();
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
});


function getTicketNumber(custid) {
    var grid = new dhx.Grid("tblListTicket", {		
		resizable: true,
		selection: true,
		dragMode: "both",
        fitToContainer: true,
        // width: "100%",
		// columnsAutoWidth: true,

		columns: [
			/* { 
				width: 50, 
				id: "rownum", 
				header: [{ text: "No" }]
			}, */
			{ 
				width: 150, 
				id: "TicketNumber", 
				header: [{ text: "No Ticket" }, { content: "inputFilter"}]
			},
			{ 
				width: 150, 
				id: "CustomerName", 
				header: [{ text: "Nama" }, { content: "comboFilter" }] 
			},
			{ 
				width: 150, 
				id: "DateCreate", 
				header: [{ text: "Date Create" }, { content: "comboFilter" }] 
			},
			{ 
				width: 150, 
				id: "Status", 
				header: [{ text: "Status" }, { content: "comboFilter" }] 
			}
		]
    });

    var jsonText = JSON.stringify({CustID:custid});
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Service.asmx/getDataTicket",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            var tblTickets = "";
            // console.log(json)
            grid.data.parse(json);
            
            for (i = 0; i < json.length; i++) {
                //alert(json[i].CustID)
                tblTickets = '<tr>' +
                            '<td>' +
                                '<div class="custom-control custom-checkbox checkbox-primary">' +
                                    '<input type="checkbox" class="custom-control-input" id="customCheck41">' +
                                    '<label class="custom-control-label" for="customCheck41">' +
                                    '<span class="w-130p d-block text-truncate">' + json[i].TicketNumber + '</span>' +
                                    '</label>' +
                                '</div>' +
                            '</td>' +
                            '<td>' +
                                '<div class="media align-items-center">' +
                                        '<div class="media-img-wrap d-flex mr-10">' +
                                        '<div class="avatar avatar-xs">' +
                                        '<span class="avatar-text avatar-text-primary rounded-circle">' +
                                            '<span class="initial-wrap"><span>' + json[i].CustomerName.substring(0, 1) + '</span>' +
                                        '</span>' +
                                        '</span>' +
                                        '</div>' +
                                 '</div>' +
                                 '<div class="media-body">' +
                                        '<span class="d-block">' + json[i].CustomerName + '</span>' +
                                 '</div>' +
                                '</div>' +
                            '</td>' +
                            '<td>' +
                                        json[i].DateCreate.substring(0, json[i].DateCreate.length - 4) +
                            '</td>' +
                            '<td>' +
                                '<span class="badge badge-primary">Ticket ' + json[i].Status +'</span>' +
                            '</td>' +
                         '</tr>';
                // $('#tbl_ticketTrx').append(tblTickets);
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function getDataProfile(valCustID) {
    var jsonText = JSON.stringify({ CustID: valCustID });
    
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Service.asmx/getDataProfile",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            // console.log(json)

            for (i = 0; i < json.length; i++) {
                //alert(json[i].CountPending);
                $('#spanCustName span').html(json[i].CustName);
                $('#spanNIK span').html(json[i].CustNIK);
                $('#ticketPending').html(json[i].CountPending);
                $('#ticketProgress').html(json[i].CountProgress);
                $('#ticketClosed').html(json[i].CountClosed);
                $('#divCustEmail').html(json[i].CustEmail);
                $('#divCustAlamat').html(json[i].CustAddress);
                $('#divCustCall').html(json[i].CustCall);
                
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function getShowData(sel) {
    var idNya = sel.value.split("|");
    
    $('#selectSub1').find('option').remove();
    var jsonText = JSON.stringify({ valJenis: "sub1", valID: idNya[0] });
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Master.asmx/getDataMaster",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            var tblTickets = "";
            $('#selectSub1').append('<option value="">Select</option>');
            for (i = 0; i < json.length; i++) {
                //alert(json[i].CustID)
                $('#selectSub1').append('<option value="' + json[i].ID_Table + '">' + json[i].Name_Table + '</option>');
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function getShowData1(sel) {
    var idNya;
    idNya = sel.value.split("|");
   
    $('#selectSub2').find('option').remove();
    var jsonText = JSON.stringify({ valJenis: "sub2", valID: idNya[0] });
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Master.asmx/getDataMaster",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            var tblTickets = "";
            $('#selectSub2').append('<option value="">Select</option>');
            for (i = 0; i < json.length; i++) {
                //alert(json[i].CustID)
                $('#selectSub2').append('<option value="' + json[i].ID_Table + '">' + json[i].Name_Table + '</option>');
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
function getShowData2(sel) {
    var idNya;
    idNya = sel.value.split("|");
    $('#selectSub3').find('option').remove();
    //alert(sel.value);
    var jsonText = JSON.stringify({ valJenis: "sub3", valID: idNya[0] });
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Master.asmx/getDataMaster",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            var tblTickets = "";
            $('#selectSub3').append('<option value="">Select</option>');
            for (i = 0; i < json.length; i++) {
                //alert(json[i].CustID)
                $('#selectSub3').append('<option value="' + json[i].ID_Table + '">' + json[i].Name_Table + '</option>');
            }
            
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function getShowData3(sel) {
    var idNya;
    idNya = sel.value.split("|");
    getListStatus();
    $('#txtTujuanEskalasi').val("");
    $('#txtSLA').val("");
    //alert(sel.value);
    var jsonText = JSON.stringify({ valJenis: "sub3detil", valID: idNya[0] });
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Master.asmx/getDataMaster",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            var tblTickets = "";
            $('#selectSub3').append('<option value="">Select</option>');
            for (i = 0; i < json.length; i++) {
                //alert(json[i].namaTujuanEskalasi)
                $('#txtTujuanEskalasi').val(json[i].namaTujuanEskalasi);
                $('#txtSLA').val(json[i].jumlahSLA);
            }
           
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function getListStatus() {
    var jsonText = JSON.stringify({ valJenis: "status", valID: "0" });
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Master.asmx/getDataMaster",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            var tblTickets = "";

            for (i = 0; i < json.length; i++) {
                //alert(json[i].CustID)
                $('#selectStatusTicket').append('<option value="' + json[i].ID_Table + '">' + json[i].Name_Table + '</option>');
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
function getListPenyebab() {
    var jsonText = JSON.stringify({ valJenis: "penyebab", valID: "0" });
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Master.asmx/getDataMaster",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            var tblTickets = "";

            for (i = 0; i < json.length; i++) {
                //alert(json[i].CustID)
                $('#selectPenyebab').append('<option value="' + json[i].ID_Table + '">' + json[i].Name_Table + '</option>');
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
function getListRecentTicket() {
    // $('#listRecentTicket').find('div').remove();
    var jsonText = JSON.stringify({ CustID: "190705094728" });
    var tblTickets = "";
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Service.asmx/getDataRecentTicket",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            // console.log(json)

            x = 1;
            for (i = 0; i < json.length; i++) {
                tblTickets += '<a onclick="viewRecent(' + json[i].idTable + ')" class="media"> ' +
                    '<div class="media-img-wrap"> ' +
                        '<div class="avatar avatar-sm"> ' +
                            '<img src="dist/img/291207.svg" alt="user" class="avatar-img rounded-circle"> ' +
                        '</div> ' +
                    '</div> ' +
                    '<div class="media-body"> ' +
                        '<div> ' +
                            '<div class="email-head">'+ x +'. Pengaduan Tiket</div> ' +
                            '<div style="font-weight:700; color:black;" class="email-subject">' + json[i].CategoryName + '</div> ' +
                            '<div class="email-text"> ' +
                                '<p>Created ' + json[i].DateNya + '</p> ' +
                            '</div> ' +
                            '<span class="badge badge-warning mt-5 mr-10">' + json[i].ChannelID + '</span> ' +
                        '</div> ' +
                    '</div> ' +
                '</a> ' +
                '<div class="email-hr-wrap"><hr></div>';
                x++;
                $('#listRecentTicket').html(""); //clear html
                $('#listRecentTicket').append(tblTickets);
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    
}
function getListKategori() {
    $('#selectKategori').find('option').remove();
    var jsonText = JSON.stringify({ valJenis: "kategori", valID : "0" });
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Master.asmx/getDataMaster",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            var tblTickets = "";

            for (i = 0; i < json.length; i++) {
                //alert(json[i].CustID)
                $('#selectKategori').append('<option value="' + json[i].ID_Table + '">' + json[i].Name_Table + '</option>');
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function windowCreateTicket(){
            
    const dhxWindow = new dhx.Window({
        title: "Pembuatan Tiket",
        modal: false,
        header: true,
        footer: true,
        closable: true,
        movable: true,
        resizable: true,
        width: 1280, 
        height: 800
    });
    dhxWindow.show();

    var layout = new dhx.Layout("layout", {
        css: "dhx_layout-cell--bordered",
        fitToContainer: true,
        cols: [
            {
                header: "Recent Tiket",
                css: "layout-list dhx_layout-cell--border_right",
                width: "30%",
                height: "100%",
                resizable: true,
                collapsable: true,
                padding: 0,
                rows: [{
                    css: "layout-list dhx_layout-cell--border_bottom",
                    gravity: false,
                    padding: 5,
                    html: '<input type="text" class="form-control" placeholder="Search" id="txtCariTiket">'
                },{
                    id: "list_ticket",
                }]
            },
            {
                id: "form_ticket",
                header: "Buat Tiket",
                width: "70%",
                height: "100%",
                padding: 0,
            }
        ]
    });
    dhxWindow.attach(layout); 

    let list = new dhx.List(null, {
        template: template, 
        itemHeight: 100,
        height: "100%",
    });


    let jsonText = JSON.stringify({ CustID: "190705094728" });
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Service.asmx/getDataRecentTicket",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            // console.log(json)
            list.data.parse(json);

            document.querySelector("#txtCariTiket").addEventListener("keyup", function (event) {
                var value = event.target.value;
                if (value) {
                    list.data.filter(function(item) {
                        if(item.CategoryName.toLowerCase().indexOf(value) > -1){
                            return item;
                        }
                    });
                } else {
                    list.data.filter();
                }
            });
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest, textStatus, errorThrown);
        }
    });
    layout.getCell("list_ticket").attach(list);

    var form_ticket = new dhx.Form(null, {  
        fitToContainer: true,
        padding: "20",
        // cols: [{
        //     width: "50%",
        //     gravity: false,
        cols: [{
            padding: "20",
                type: "input",
                label: "Name",
                icon: "dxi dxi-magnify",
                required: true,
                placeholder: "John Doe",
                id:"input",
                name: "name"
            },
            {
                padding: "20",
                type: "combo",
                label: "count",
                required: true,
                help: "Help information",
                id: "combo",
                name: "combo",
                data: [
                    {value: "1", id: "1"},
                    {value: "2", id: "2"},
                    {value: "3", id: "3"},
                    {value: "4", id: "4"},
                    {value: "5", id: "5"},
                ]
            }]
        // }]
    });
    layout.getCell("form_ticket").attach(form_ticket);
    // layout.getCell("form_ticket").attachHTML($("#data_createticket").html());

    
    
    let isFullScreen = false, oldSize = null, oldPos = null;
    dhxWindow.header.data.add({icon: "dxi dxi-arrow-expand", id: "fullscreen"}, 2);
    dhxWindow.header.events.on("click", function(id) {
        if (id === "fullscreen") {
            if (isFullScreen) {
                dhxWindow.setSize(oldSize.width, oldSize.height);
                dhxWindow.setPosition(oldPos.left, oldPos.top);
            } else {
                oldSize = dhxWindow.getSize();
                oldPos = dhxWindow.getPosition();
                dhxWindow.setFullScreen();
            }
            isFullScreen = !isFullScreen;
        }
    });
    dhxWindow.footer.data.add({
		type: "button",
		size: "medium",
		color: "primary",
        value: "publish ticket",
        icon: "dxi dxi-vault",
		id: "publish",
		circle : true
	});
    dhxWindow.footer.data.add({
		type: "spacer",
	});
	dhxWindow.footer.data.add({
		type: "button",
		size: "medium",
		color: "success",
        value: "Simpan ticket",
        icon: "dxi dxi-checkbox-marked-circle",
		id: "assign",
		circle : true
    });
    dhxWindow.footer.data.add({
		type: "button",
		size: "medium",
		color: "secondary",
        value: "reset form",
        icon : "dxi dxi-close",
		id: "reset",
		circle : true
    });
    

}

function template(item) {
    let template = "";

    template += '<a onclick="#" class="media"> ' +
        '<div class="media-img-wrap" style="margin:20px 15px 0 0;"> ' +
            '<div class="avatar avatar-sm"> ' +
                '<span class="avatar-text avatar-text-warning rounded-circle"> ' +
                    '<span class="initial-wrap"><span>C</span></span> ' +
                '</span> ' +
            '</div> ' +
        '</div> ' +
        '<div class="media-body"> ' +
            '<div> ' +
                '<div class="email-head">Pengaduan Tiket</div> ' +
                '<div style="font-weight:700; color:black;" class="email-subject">' + item.CategoryName + '</div> ' +
                '<div class="email-text"> ' +
                    '<p>Created ' + item.DateNya + '</p> ' +
                '</div> ' +
                '<span class="badge badge-warning mt-5 mr-10">' + item.ChannelID + '</span> ' +
            '</div> ' +
        '</div> ' +
    '</a> ' +
    '<div class="email-hr-wrap"><hr></div>'; 

    return template;
}
/***** End Mendawai ****/