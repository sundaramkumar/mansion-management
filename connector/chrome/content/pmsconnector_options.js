function pmsconnector_activateOptionsContext(event)
{
    var pmsconnectorStatusbarPanel = document.getElementById("pmsconnector");
    var optionsContextMenu = document.getElementById("pmsconnector_options-contextmenu");
    var xCoord = event.clientX;
    var yCoord = event.clientY;
    document.popupNode = pmsconnectorStatusbarPanel;
    optionsContextMenu.showPopup(pmsconnectorStatusbarPanel, xCoord, yCoord, "bottomleft", "topleft");
}

function pmsconnector_activateAbout()
{
       window.openDialog('chrome://pmsconnector/content/pmsconnector_about.xul', null,'chrome,centerscreen,dependent,modal');
}
