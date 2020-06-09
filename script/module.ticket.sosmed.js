
export function windowCreateTicket(data){
    const obj = JSON.parse(data);

    const dhxWindow = new dhx.Window({
        title: "Create Ticket",
        modal: true,
        header: true,
        footer: true,
        closable: true,
        movable: true,
        resizable: true,
        width: 1200, 
        height: 670
    });
    dhxWindow.show();

    const layout = new dhx.Layout("layout", {
        css: "dhx_layout-cell--bordered",
        fitToContainer: true,
        margin: 0,
        cols: [{
            header: false,
            css: "layout-list dhx_layout-cell--border_right",
            width: "30%",
            height: "100%",
            resizable: true,
            collapsable: false,
            padding: 0,
            id: "data_customer"
        },{
            id: "form_ticket",
            header: false,
            width: "70%",
            height: "100%",
            padding: 0,
        }]
    });
    dhxWindow.attach(layout); 

    const tabbar = new dhx.Tabbar(null, {
        mode: "top",
        css: "text-dark",
        views:[{ 
            tab: "Form Ticket", 
            padding: 10, 
            html: FormTicketHTML
        },{ 
            tab: "Data Chat", 
            padding: 10, 
            html: DataChatHTML
        }]
    });

    layout.getCell("data_customer").attachHTML(DataCustomerHTML);
    layout.getCell("form_ticket").attach(tabbar);


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
		type: "spacer",
	});
	dhxWindow.footer.data.add({
		type: "button",
		size: "medium",
		color: "success",
        value: "Create Ticket",
        icon: "dxi dxi-checkbox-marked-circle",
		id: "BtnCreateTicket",
		circle : true
    });
    dhxWindow.footer.data.add({
		type: "button",
		size: "medium",
		color: "secondary",
        value: "Reset Form",
        icon : "dxi dxi-close",
		id: "BtnReset",
		circle : true
    });
    dhxWindow.footer.events.on("click", function(id) {
        if (id == "BtnCreateTicket") {
            simpanTicket();
            dhxWindow.hide();
        }
        else if (id == "BtnReset") {
            $("#form_createticket")[0].reset();
            getListPenyebab();
            getListKategori();
            getListRecentTicket();
        }
    });

     //load data profile
     setTimeout(() => {
        let channel = obj.AssignTo == 'null' ? 'Chating' : obj.AssignTo;

        document.querySelector('span[name=CustName]').innerHTML = obj.CustName;
        document.querySelector('span[name=CustID]').innerHTML = obj.CustID;
        document.querySelector('span[name=Email]').innerHTML = obj.Email;
        document.querySelector('span[name=Channel]').innerHTML = channel;
    }, 1000);
}


const DataCustomerHTML = `<div>
<ul class="list-group list-group-flush">
    <li class="list-group-item">
        <a class="dropdown-toggle no-caret float-right" data-toggle="dropdown" href="#" aria-expanded="false" role="button"><i class="fa fa-gear"></i></a>
        <div class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position: absolute; transform: translate3d(17px, 24px, 0px); top: 0px; left: 0px; will-change: transform;">
            <a class="dropdown-item" href="#">Something else here</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Separated link</a>
        </div>
        <div class="text-capitalize font-weight-500 text-dark"><span name="CustName">Customer Name</span></div>
        <div class="font-13"><span name="CustID">Customer ID</span></div>
    </li>
</ul>
<ul class="list-group list-group-flush">
    <li class="list-group-item">
        <span><i class="ion ion-md-apps font-18 text-light-20 mr-10"></i><span>Channel :</span></span><br>
        <span name="Channel" class="ml-5 text-dark"></span>
    </li>
    <li class="list-group-item">
        <span><i class="ion ion-md-mail font-18 text-light-20 mr-10"></i><span>Email :</span></span><br>
        <span name="Email" class="ml-5 text-dark">-</span>
    </li>
    <li class="list-group-item">
        <span><i class="ion ion-md-call font-18 text-light-20 mr-10"></i><span>Call ID :</span></span><br>
        <span name="CallID" class="ml-5 text-dark">-</span>
    </li>
    <li class="list-group-item">
        <span><i class="ion ion-md-pin font-18 text-light-20 mr-10"></i><span>Alamat :</span></span><br>
        <span name="Alamat" class="ml-5 text-dark">-</span>
    </li>
</ul>
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

const DataChatHTML = `<div class="table-responsive">
<table class="table table-hover mb-0">
    <thead>
        <tr>
            <th>
                <div
                    class="custom-control custom-checkbox checkbox-primary">
                    <input type="checkbox"
                        class="custom-control-input"
                        id="customCheck4">
                    <label class="custom-control-label"
                        for="customCheck4">Customer ID</label>
                </div>
            </th>
            <th>Nama</th>
            <th>Date Created</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody id="table_agent_create">
        <tr>
            <td>
                <div
                    class="custom-control custom-checkbox checkbox-primary">
                    <input type="checkbox"
                        class="custom-control-input"
                        id="customCheck41" checked="">
                    <label class="custom-control-label"
                        for="customCheck41"><span
                            class="w-130p d-block text-truncate">341281829</span></label>
                </div>
            </td>
            <td>
                <div class="media align-items-center">
                    <div class="media-img-wrap d-flex mr-10">
                        <div class="avatar avatar-xs">
                            <span
                                class="avatar-text avatar-text-primary rounded-circle"><span
                                    class="initial-wrap"><span>A</span></span></span>
                        </div>
                    </div>
                    <div class="media-body">
                        <span class="d-block">Amank Chunk</span>
                    </div>
                </div>
            </td>
            <td>
                22/10/2018
            </td>
            <td><span class="badge badge-primary">Ticket Open</span>
            </td>
        </tr>
        <tr>
            <td>
                <div
                    class="custom-control custom-checkbox checkbox-primary">
                    <input type="checkbox"
                        class="custom-control-input"
                        id="customCheck42">
                    <label class="custom-control-label"
                        for="customCheck42"><span
                            class="w-130p d-block text-truncate">341281828</span></label>
                </div>
            </td>

            <td>
                <div class="media align-items-center">
                    <div class="media-img-wrap d-flex mr-10">
                        <div class="avatar avatar-xs">
                            <span
                                class="avatar-text avatar-text-danger rounded-circle"><span
                                    class="initial-wrap"><span>M</span></span></span>
                        </div>
                    </div>
                    <div class="media-body">
                        <span class="d-block">Exxon Mobil</span>
                    </div>
                </div>
            </td>
            <td>
                15/09/2018
            </td>
            <td><span class="badge badge-primary">Ticket Open</span>
            </td>
        </tr>
    </tbody>
</table>`;
