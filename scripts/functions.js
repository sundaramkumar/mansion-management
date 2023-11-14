function setFloat(v){		
	if(v!="")
		return parseFloat(v).toFixed(2);
	else
		return v;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
function getusername(){
	var x = getCookie("cook").split("%2C");
	return x[0];
}
function getpwd(){
	var x = getCookie("cook").split("%2C");
	return x[1];
}

Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
};

function viewphoto(id,name){
    console.log(id);
    console.log(name);
    window.open('viewphoto.php?id='+id+'&name='+name,'viewPhotoWindow','height=520,width=660');

}