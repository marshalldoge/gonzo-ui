import moment from "moment";
//--------------------------------COOKIES---------------------------------------
export function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    //console.log("Actual time: ", d.toUTCString());
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    //console.log("Cookie expires in: ", expires);
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function parseJwt (token) {
    var array = token.split('.')[1];
    var base64 = array.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            //console.log("Cookie Returned: ",sol);
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}
export function deleteCookie(cname) {
    //console.log("Cookie a borrar: ",cname);
    let d = new Date(); //Create an date object
    d.setTime(d.getTime() - (1000*60*60*24)); //Set the time to the past. 1000 milliseonds = 1 second
    let expires = "expires=" + d.toGMTString(); //Compose the expirartion date
    //console.log("Expires now in: ",expires);
    window.document.cookie = cname+"=; "+expires;//Set the cookie with name and the expiration date
}
//--------------------------------END COOKIES---------------------------------------

export function getJWtProperty(propertyName) {
    let cookie=getCookie("JWT");
    let jwt=parseJwt(cookie);
    let property=jwt[propertyName];
    return property;
}

//--------------------------------URL PARAMTETERS------------------------------------------
export function withParams(url,params) {
    url+="?";
    //console.log(params);
    let i=0;
    for (let k in params) {
       // console.log(k,"= ",params[k]);
        if(i>0)url+="&";
        url+=(k+"="+params[k]);
        i++;
    }
    return url;
}
export function getUrlParams(key) {
    //console.log("my url: ",window.location.hash);
    const urlParams = window.location.hash.split('?')[1];
    const Params = urlParams.split('&');
    let desiredValue;
    for(let i=0;i<Params.length;i++){
        const keyUrl = Params[i].split('=')[0];
        const value = Params[i].split('=')[1];
        if(keyUrl === key){
            desiredValue = value;
        }
    }
    return desiredValue;
}
//--------------------------------END URL PARAMETERS---------------------------------------
//--------------------------------PATH------------------------------------------
export function changePath(newView){
    //this.setState({activeSubmenu:newActiveSubmenu});
    console.log("GOING TO SUBMENU; ",newView.replace( /\s/g, ''));
    this.props.history.push(newView.replace( /\s/g, '') );
};
//--------------------------------END PATH---------------------------------------
//--------------------------------TIME PARSER-------------------------------------------
export function parseTime(localDateTime) {
    let timestamp = moment(localDateTime);
    return timestamp.format("DD/MM/YY HH:mm");
}
//--------------------------------END TIME PARSER---------------------------------------
//--------------------------------STRING-------------------------------------------
export function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
//--------------------------------END STRING---------------------------------------
