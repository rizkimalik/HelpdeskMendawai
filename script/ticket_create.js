$(document).ready(function(){
	getTicketNumber("21164849");
    getDataProfile("21164849");
});
//191018091628
//0313105115

/***** Function Mendawai ****/
$("#btnPopupTicket").click(function () {
    windowCreateTicket();
    setTimeout(() => {
        getListPenyebab();
        getListKategori();
        getListRecentTicket();
    }, 1000);
    
    
});

// $("#simpanTicket").click(function () {
function simpanTicket() {
    $(".hiddenX").show();
   
    var validTable = $('#idTable').val();
    var valNIK = $('#spanNIK').text();
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

    var url = "";
    var jsonText = "";
    if(validTable == "" || validTable == null){
        // alert("Add Ticket");
        url         = "https://ice.icephone.id:8013/WsMendawai/Mendawai_Service.asmx/postDataTicket";
        jsonText    = JSON.stringify({nik:valNIK,namapelapor:valTxtNamaPengadu,emailpelapor:"",phonepelapor:"",alamatpelapor:"",emcid:"",account:"",nomorrekening:"",ticketnumber:"",channelcode:"",sourcename:"",categoryid:valSelectKategori[0],categoryname:valSelectKategori[1],subcategory1id:valSelectSub1[0],subcategory1name:valSelectSub1Name,subcategory2id:valSelectSub2[0],subcategory2name:valSelectSub2Name,subcategory3id:valSelectSub3[0],subcategory3name:valSelectSub3Name,detailcomplaint:valTxtDeskripsi,responsecomplaint:valTxtResponse,sla:"",status:valSelectStatus,usercreate:"",divisi:"",enginer:"",position:"",tglkejadian:valTglKejadian,idpenyebab:"",strpenyebab:valSelectPenyebab,strpenerima:"",idstatuspelapor:"",strstatuspelapor:"",lokasiPengaduan:""});
    }
    else{
        // alert("Update Ticket");
        url         = "https://ice.icephone.id:8013/WsMendawai/Mendawai_Service.asmx/postUpdateDataTicket";
        jsonText    = JSON.stringify({idTable:validTable,nik:valNIK,namapelapor:valTxtNamaPengadu,emailpelapor:"",phonepelapor:"",alamatpelapor:"",emcid:"",account:"",nomorrekening:"",ticketnumber:"",channelcode:"",sourcename:"",categoryid:valSelectKategori[0],categoryname:valSelectKategori[1],subcategory1id:valSelectSub1[0],subcategory1name:valSelectSub1Name,subcategory2id:valSelectSub2[0],subcategory2name:valSelectSub2Name,subcategory3id:valSelectSub3[0],subcategory3name:valSelectSub3Name,detailcomplaint:valTxtDeskripsi,responsecomplaint:valTxtResponse,sla:"",status:valSelectStatus,usercreate:"",divisi:"",enginer:"",position:"",tglkejadian:valTglKejadian,idpenyebab:"",strpenyebab:valSelectPenyebab,strpenerima:"",idstatuspelapor:"",strstatuspelapor:"",lokasiPengaduan:""});
    }

    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";

            swal({
                title: "Success Simpan.",
                text: "Simpan Data Berhasil!",
                icon: "success",
                button: "Ok",
                timer: 1000,
            });
            $("#btnReset").trigger("click");
        }, 
        complete: function () {
            //back to normal!
            $(".hiddenX").hide();
            getListRecentTicket();
            getTicketNumber(valNIK);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            swal({
                title: "Gagal Simpan.",
                text: "Simpan Data Gagal!",
                icon: "error",
                button: "Ok",
                timer: 1000,
            });
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    }); 
}
// });

$("#btnReset").click(function () {
    $("#form_createticket")[0].reset();
    getListPenyebab();
    getListKategori();
    getListRecentTicket();
});

function viewRecent(valIDTable) {
    var jsonText = JSON.stringify({idTable:valIDTable});
    var tblTickets = "";
    // console.log(jsonText)
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
            // console.table(json)

            $("#idTable").val(valIDTable);
            $("#tglKejadian").val(moment(tgl, 'DD/MM/YYYY').format('YYYY-MM-DD'));
            $("#selectPenyebab").val(json[0].IDPenyebab.split("|")[0]);
            $('#selectPenyebab').html("<option value='"+json[0].IDPenyebab + "' selected>" + json[0].IDPenyebab.split("|")[1]+"</option>");
            $("#selectKategori").val(json[0].IDCategoryName + "|" + json[0].CategoryName);
            $('#selectSub1').html("<option value='"+json[0].IDGroupCategoryProduct + "|" + json[0].GroupCategoryProduct+"' selected>" + json[0].GroupCategoryProduct+"</option>");
            $('#selectSub2').html("<option value='"+json[0].IDCategoryProduct + "|" + json[0].CategoryProduct+"' selected>" + json[0].CategoryProduct+"</option>");
            $('#selectSub3').html("<option value='"+json[0].IDCategoryCase + "|" + json[0].CategoryCase+"' selected>" + json[0].CategoryCase+"</option>");
            $("#txtNamaPengadu").val(json[0].NamaPelapor);
            $("#txtDeskripsi").val(json[0].DetailComplaint);
            $("#txtResponse").val(json[0].ResponComplaint);
            $('#selectStatusTicket').html("<option value='"+json[0].IDTicketStatus + "' selected>" + json[0].TicketStatus+"</option>");
            $("#txtTujuanEskalasi").val(json[0].DeptName);
            $("#txtSLA").val(json[0].SLA);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    getListRecentTicket();
}

function getTicketNumber(custid) {
 
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
            
            for (i = 0; i < json.length; i++) {
                //alert(json[i].CustID)
                tblTickets += '<tr>' +
                    '<td>'  + json[i].TicketNumber + '</td>' +
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
            } 
            $('#tbl_ticketTrx').html("");
            $('#tbl_ticketTrx').append(tblTickets);

            if ( $.fn.dataTable.isDataTable( '.datatable' ) ) {
                $('.datatable').DataTable().destroy();
            }

            $('.datatable').DataTable({
                responsive: true,
                autoWidth: false,
                language: { search: "",
                    searchPlaceholder: "Search",
                    sLengthMenu: "_MENU_items"
                }
            }); 
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
            // console.log(xmlHttpRequest.responseText);
            // console.log(textStatus);
            console.log(xmlHttpRequest.responseText, textStatus, errorThrown);
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
            
            $('#selectSub1').html("");
            $('#selectSub1').append('<option value="">Select</option>');
            for (i = 0; i < json.length; i++) {
                // console.log(json[i].ID_Table)
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
            $('#selectSub2').html("");
            $('#selectSub2').append('<option value="">Select</option>');
            for (i = 0; i < json.length; i++) {
                // console.log(json[i].ID_Table)
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

            $('#selectSub3').html("");
            $('#selectSub3').append('<option value="">Select</option>');
            for (i = 0; i < json.length; i++) {
                // console.log(json[i].ID_Table)
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

            $('#selectStatusTicket').html("");
            $('#selectStatusTicket').append('<option value="">Select</option>');
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
            
            $('#selectPenyebab').html("");
            $('#selectPenyebab').append('<option value="">Select</option>');
            for (i = 0; i < json.length; i++) {
                // console.log(json[i].ID_Table)
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
    var valNIK = $('#spanNIK').text();
    var jsonText = JSON.stringify({CustID:valNIK});
    // console.log(valNIK);
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Service.asmx/getDataRecentTicket",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            var tblTickets = "";
            // console.log(json)

            x = 1;
            for (i = 0; i < json.length; i++) {
                var aktif = "";
				if($("#idTable").val() == json[i].idTable){
					aktif = "aktif";
                }
                
                tblTickets += '<a onclick="viewRecent(' + json[i].idTable + ')" class="media '+aktif+'" style="cursor:pointer;padding:10px;border-bottom:1px solid #dddddd;"> ' +
                    '<div class="media-img-wrap" style="margin:20px 10px 0 0;"> ' +
                        '<div class="avatar avatar-sm"> ' +
                            '<span class="avatar-text avatar-text-warning rounded-circle"> ' +
                                '<span class="initial-wrap"><span>C</span></span> ' +
                            '</span> ' +
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
                '</a>';
                x++;
            }
            $('#listRecentTicket').html(""); //clear html
            $('#listRecentTicket').append(tblTickets);

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });


    // CARI Ticket
    const txtCari = document.getElementById('txtCariTiket');
    const divList = document.getElementById('listRecentTicket');
    const listTicket = divList.getElementsByTagName("a");

    txtCari.addEventListener("keyup",(e)=>{
        e.preventDefault();
        // console.log(listTicket.length);

        for (let i = 0; i < listTicket.length; i++) {
            let mediaBody = listTicket[i].getElementsByClassName("media-body")[0];
            let txtValue = mediaBody.textContent || mediaBody.innerText;
            // console.log(txtValue);

            if (txtValue.toLowerCase().indexOf(txtCari.value) > -1) {
                listTicket[i].style.display = '';
            }
            else{
                listTicket[i].style.display = 'none';
            }
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

            $('#selectKategori').html("");
            $('#selectKategori').append('<option value="">Select</option>');
            for (i = 0; i < json.length; i++) {
                // console.log(json[i].ID_Table)
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

function setPublishTicket() {
    var valNIK = $('#spanNIK').text();
    var jsonText = JSON.stringify({nik:valNIK});
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Service.asmx/postUpdatePublishTicket",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
            var json = JSON.parse(data.d);
            var i, x = "";
            var tblTickets = "";
            // console.log(json)

            swal({
                title: "Publish Ticket.",
                text: "Publish Ticket Berhasil!",
                icon: "success",
                button: "Ok",
                timer: 1000,
            });
            getTicketNumber(valNIK);
            $("#btnReset").trigger("click");
            
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            swal({
                title: "Gagal.",
                text: "Publish Ticket Gagal!",
                icon: "error",
                button: "Ok",
                timer: 1000,
            });

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
        width: 1200, 
        height: 670
    });
    dhxWindow.show();
    // dhxWindow.setFullScreen();

    var layout = new dhx.Layout("layout", {
        css: "dhx_layout-cell--bordered",
        fitToContainer: true,
        margin: 0,
        cols: [
            {
                header: "Recent Tiket",
                css: "layout-list dhx_layout-cell--border_right",
                width: "25%",
                height: "100%",
                resizable: true,
                collapsable: false,
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
                header: "Form Tiket",
                width: "75%",
                height: "100%",
                padding: 10,
            }
        ]
    });
    dhxWindow.attach(layout); 

    layout.getCell("list_ticket").attachHTML(ListTicketHTML);
    layout.getCell("form_ticket").attachHTML(FormTicketHTML);

    
    
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
        value: "Publish Ticket",
        icon: "dxi dxi-vault",
		id: "btnPublish",
		circle : true
	});
    dhxWindow.footer.data.add({
		type: "spacer",
	});
	dhxWindow.footer.data.add({
		type: "button",
		size: "medium",
		color: "success",
        value: "Simpan Ticket",
        icon: "dxi dxi-checkbox-marked-circle",
		id: "simpanTicket",
		circle : true
    });
    dhxWindow.footer.data.add({
		type: "button",
		size: "medium",
		color: "secondary",
        value: "Reset Form",
        icon : "dxi dxi-close",
		id: "btnReset",
		circle : true
    });
    dhxWindow.footer.events.on("click", function(id) {
        if (id == "btnPublish") {
            setPublishTicket();
            dhxWindow.hide();
        }
        else if (id == "simpanTicket") {
            simpanTicket();
            dhxWindow.hide();
        }
        else if (id == "btnReset") {
            $("#form_createticket")[0].reset();
            getListPenyebab();
            getListKategori();
            getListRecentTicket();
        }
    });

}


const ListTicketHTML = `<div class="emailapp-emails-list">
<div class="nicescroll-bar">
    <div id="listRecentTicket"></div>
</div>
</div>`;

const FormTicketHTML = `<form id="form_createticket">
<input class="form-control" type="hidden" name="idTable" id="idTable">
<div class="row">
    <div class="col-md-3 form-group">
        <label for="firstName">Tanggal Kejadian</label>
        <input class="form-control" type="date" name="tglKejadian" id="tglKejadian">
    </div>
    <div class="col-md-3 form-group">
        <label for="lastName">Penyebab</label>
        <select id="selectPenyebab" class="form-control select2">
            <option>Select</option>
        </select>
    </div>
    <div class="col-md-3 form-group">
        <label for="lastName">Penerima
            Pengaduan</label>
        <input class="form-control"
            id="txtNamaPengadu"
            placeholder="Nama Lengkap" value=""
            type="text">
    </div>
    <div class="col-md-3 form-group">
        <label for="lastName">Status Lapor</label>
        <select id="selectStatusLapor" class="form-control select2">
            <option>Select</option>
            <option value="Nasabah">Nasabah</option>
            <option value="Non Nasabah">Non Nasabah</option>
        </select>
    </div>
</div>
<div class="row">
    <div class="col-md-3 form-group">
        <label for="firstName">Kategori</label>
        <select id="selectKategori" onchange="getShowData(this);" class="form-control select2">
            <option>Select</option>
        </select>
    </div>
    <div class="col-md-3 form-group">
        <label for="firstName">Sub 1</label>
        <select id="selectSub1" onchange="getShowData1(this);" class="form-control select2">
            <option>Select</option>
        </select>
    </div>
    <div class="col-md-3 form-group">
        <label for="firstName">Sub 2</label>
        <select id="selectSub2" onchange="getShowData2(this);" class="form-control select2">
            <option>Select</option>
        </select>
    </div>
    <div class="col-md-3 form-group">
        <label for="firstName">Sub 3</label>
        <select id="selectSub3" onchange="getShowData3(this);" class="form-control select2">
            <option>Select</option>
        </select>
    </div>
</div>
<div class="row">
    <div class="col-md-6 form-group">

        <label for="firstName">Deskripsi</label>
        <textarea class="form-control mt-15"
            rows="5" placeholder="Description" id="txtDeskripsi"
            style="margin-top: 15px; margin-bottom: 0px; height: 100px;"></textarea>
    </div>
    <div class="col-md-6 form-group">
        <label for="firstName">Response</label>
        <textarea class="form-control mt-15"
            rows="5" placeholder="Response" id="txtResponse"
            style="margin-top: 15px; margin-bottom: 0px; height: 100px;"></textarea>
    </div>
</div>
<div class="row">
        <div class="col-md-3 form-group">
        <label for="firstName">Status</label>
        <select id="selectStatusTicket" class="form-control select2">
            <option>Select</option>
        </select>
    </div>
    <div class="col-md-3 form-group">
        <label for="lastName">Tujuan Eskalasi</label>
        <input class="form-control" id="txtTujuanEskalasi" readonly="" placeholder="Tujuan Eskalasi" type="text">
    </div>
    <div class="col-md-3 form-group">
        <label for="lastName">SLA</label>
        <input class="form-control" id="txtSLA" readonly="" placeholder="SLA" type="text">
    </div>
</div>
</form>`;
/***** End Mendawai ****/