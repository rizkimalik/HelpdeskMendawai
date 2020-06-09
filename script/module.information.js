
export function windowInformation(data){
    const obj = JSON.parse(data);
    // console.log(obj);
    
    const dhxWindow = new dhx.Window({
        title: "Information.",
        modal: true,
        header: true,
        footer: false,
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
            id: "data_profile",
            header: "Data Profile",
            css: "dhx_layout-cell--border_right",
            width: "30%",
            height: "100%",
            resizable: true,
            collapsable: false,
            padding: 0
        },{
            id: "data_journey",
            header: 'Data Journey',
            width: "70%",
            height: "100%",
            padding: 0
        }]
    });
    dhxWindow.attach(layout); 

    layout.getCell("data_profile").attachHTML(DataProfileHTML);
    layout.getCell("data_journey").attachHTML(DataJourneyHTML);


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
    
    //load data
    setTimeout(() => {
        let channel = obj.AssignTo == 'null' ? 'Chating' : obj.AssignTo;

        document.querySelector('span[name=CustName]').innerHTML = obj.CustName;
        document.querySelector('span[name=CustID]').innerHTML = obj.CustID;
        document.querySelector('span[name=Email]').innerHTML = obj.Email;
        document.querySelector('span[name=Channel]').innerHTML = channel;
    }, 1000);
}


const DataProfileHTML = `<div>
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

const DataJourneyHTML = `<div class="container">
    <ul class="timeline">
        <li>
            <div class="timeline-badge"><i class="glyphicon glyphicon-check"></i></div>
            <div class="timeline-panel">
                <div class="timeline-heading">
                    <span class="badge badge-success">On track</span>
                    <h5 class="timeline-title">#12898398343</h5>

                </div>
                <ul style="padding-top:40px;" class="list-unstyled">
                    <li >Agent : Agent 1</li>
                    <li>Case : Desc Emailone</li>
                    <li>Response : one respon</li>
                    <li>Status/SLA : Open 48</li>
                </ul>
            </div>
        </li>
        <li class="timeline-inverted">
            <div class="timeline-badge success"><i class="glyphicon glyphicon-credit-card"></i></div>
            <div class="timeline-panel">
                <div class="timeline-heading">
                    <span class="badge badge-success">On track</span>
                    <h5 class="timeline-title">#12898398343</h5>

                </div>
                <ul style="padding-top:40px;" class="list-unstyled">
                    <li >Agent : Agent 1</li>
                    <li>Case : Desc Emailone</li>
                    <li>Response : one respon</li>
                    <li>Status/SLA : Open 48</li>
                </ul>
            </div>
        </li>
        
    </ul>
</div>`;
