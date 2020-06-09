
export async function FBMessenger(params){
    // console.log(params);
    try {
        let values = `{Raw:"",Data1:"${params.chatid}",Data2:"'+$('#message').val()+'",Data3:"'+$('#CustID').val()+'",Data4:"",Data5:"",Data6:"",Data7:"",Data8:"",Data9:"",Data10:""}`;
        const url = "https://ice.icephone.id:8013/ApiTeleport/Service1.svc/send_Teleport?value="+values;

        const res = await fetch(url);
        const json = await res.json();
        console.log(json);

        return true;
    } 
    catch (error) {
       console.log(error); 
    }
    
}