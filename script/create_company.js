function createCompany() {
	alert("adad");
	var valUntuk = "Create";
    var validTable = 0;
    var valpicName = $('#picName').val();
	var valpicEmail = $('#picEmail').text();
    var valpicPhone = $('#picPhone').val();
	var valpicPassword = $('#picPassword').text();
    var valcompanyName = $('#companyName').val();
    
    var jsonText = JSON.stringify({untuk:valUntuk,idTable:validTable,picName:valpicName,picEmail:valpicEmail,picPhone:valpicPhone,picPassword:valpicPassword,companyName:valcompanyName});
    var tblTickets = "";
    // console.log(jsonText)
    $.ajax({
        type: "POST",
        url: "https://ice.icephone.id:8013/WsMendawai/Mendawai_Service.asmx/postCreateCompany",
        contentType: "application/json; charset=utf-8",
        data: jsonText,
        dataType: "json",
        success: function (data) {
          $.toast({
                heading: 'Sukses',
                text: '<p>You have successfully registered.</p>',
                position: 'top-right',
                loaderBg: '#00acf0',
                class: 'jq-toast-primary',
                hideAfter: 3500,
                stack: 6,
                showHideTransition: 'fade'
            });

           $('#picName').val(valpicName);
		   $('#picEmail').val(valpicEmail);
		   $('#picPhone').val(valpicPhone);
		   $('#picPassword').val(valpicPassword);
		   $('#companyName').val(valcompanyName);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.responseText);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    //getListRecentTicket();
}