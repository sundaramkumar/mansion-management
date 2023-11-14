function showRooms(){
    var lrtMap, lrtRen, lrtSer;
    if(Ext.getCmp("roomsGrid")){
        Ext.getCmp("SAdminPanelRooms").setActiveTab("roomsGrid");
        return false;
    }
    
    Ext.define('roomsdata', {
        extend: 'Ext.data.Model',
            fields: [
                {name: 'roomId',mapping: 'roomId',type:'int'},
                {name: 'roomNo',mapping: 'roomNo',type:'int'},
                {name: 'roomCapacity',mapping: 'roomCapacity', type: 'string'},
                {name: 'roomStatus',mapping: 'roomStatus', type: 'string'},
                {name: 'noOfGuests',mapping: 'noOfGuests', type: 'string'}
            ],
        idvehicle: 'roomId'
    });

    var roomsStore = Ext.create('Ext.data.JsonStore', {
        id: 'roomsStore',
        model: 'roomsdata',
        remoteSort: false,
        proxy: {
            type: 'ajax',
            actionMethods: {
                read: 'POST'
            },
            url: './includes/rooms_ajx.php',
            extraParams: {
                todo : 'Get_Rooms_List',
                //devtype:'VTS'
            },
            reader: {
                type: 'json',
                root: 'ROOMS',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'roomNo',
            direction: 'ASC'
        }]
    });

    var Roomscol    = [ Ext.create('Ext.grid.RowNumberer'),
        {text: "Room Id", dataIndex: 'roomId', width:40, sortable: false,hidden:true},
        {text: "Room No", dataIndex: 'roomNo', width:120, sortable: true,},
        {text: "Room Capacity", dataIndex: 'roomCapacity', width:120, sortable: true,align:'center'},
        {text: "Room Status", dataIndex: 'roomStatus', width:100, sortable: true,align:'center'},
        {text: "No Of Guests", dataIndex: 'noOfGuests',  width:100, sortable: false,align:'center'}
    ];  
    
    
    var loadTabPanel = Ext.getCmp('SAdminPanelRooms');
    loadTabPanel.add({
        id:'roomsGrid',
        xtype: 'grid',
        enableColumnHide:false,
        enableColumnMove:false,
        layout: 'fit',
        autoScroll:true,
        loadMask: true,
        store:roomsStore,
        selModel: {
            selType: 'rowmodel',
            mode : 'SINGLE',
            listeners:{
                'selectionchange':function(selmod, record, opt){
                    if(selmod.hasSelection()){

                    }
                }
            }
        },
        viewConfig: {
            forceFit:true,
            stripeRows: true,
            emptyText:"<span class='tableTextM'>No Records Found</span>"
        },
        columns: Roomscol,
        border:false,
        collapsible: false,
        animCollapse: false,
        stripeRows: true,
        tbar:[{
            xtype:'buttongroup',
            items: [
            {
                text:'Add Room',                
                icon: './images/add.png',
                cls: 'x-btn-bigicon',
                scale: 'small',             
                handler:function(){
                    var roomsArray          = new Array();
                    roomsArray["todo"]      = "Add_Room";
                    roomsArray["titleStr"]  = "Add New Room";
                    roomsArray['roomid'] = 0;

                    for(var i=0;i<=3;i++){
                        roomsArray[i]="";
                    }
                    add_edit_room(roomsArray);
                }               
            },
            {
                text:'Edit Room',
                disabled:true,              
                icon: './images/editroom.png',
                cls: 'x-btn-bigicon',
                scale:'small',
                id:'roomEditButton',
                handler:function(){
                    var gridRec = Ext.getCmp("roomsGrid").getSelectionModel().getSelection();
                    if(gridRec.length>0){
                        //alert(customerArray);
                        //var tmpStrArray = gridRec[0].get("contactperson").split(" ");
                        var roomsArray          = new Array();
                        roomsArray["todo"]      = "Edit_Room";
                        roomsArray["titleStr"]  = "Edit Room Details";
                        roomsArray['roomId']    = gridRec[0].get("roomId");
                        roomsArray[0]   = gridRec[0].get("roomNo");
                        roomsArray[1]   = gridRec[0].get("roomCapacity");
                        roomsArray[2]   = gridRec[0].get("roomStatus");
                        roomsArray[3]   = gridRec[0].get("noOfGuests");

                        add_edit_room(roomsArray);
                    }                   
                }
            },{
                text: 'Delete Room',
                scale: 'small',             
                icon: './images/delete.png',
                cls: 'x-btn-bigicon',
                disabled:true,
                id:'roomDeleteButton',
                handler:function(){
                    var gridRec = Ext.getCmp("roomsGrid").getSelectionModel().getSelection();
                    if(gridRec.length>0){
                        delete_room(gridRec);
                    }
                }
            },          
            {
                text:'View Guests',
                disabled:true,              
                icon: './images/guests.png',
                cls: 'x-btn-bigicon',
                scale:'small',
                id:'viewGuestsButton',
                handler:function(){
                    var gridRec = Ext.getCmp("roomsGrid").getSelectionModel().getSelection();
                    if(gridRec.length>0){
                        viewGuests(gridRec[0].get("roomId"),gridRec[0].get("roomNo"));
                    }                   
                }
            }
            ]
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            id:'roomsGridPbar',
            store: roomsStore,
            dock: 'bottom',
            pageSize: 100,
            displayInfo: true
        }],
        listeners:{
            'selectionchange':function(selmod, record, opt){
                try{
                    if(record[0].get("roomId")!=0){
                        Ext.getCmp("roomEditButton").enable();
                        Ext.getCmp("roomDeleteButton").enable();
                        Ext.getCmp("viewGuestsButton").enable();                        
                    }
                }
                catch (e){
                }
            },
            afterrender:function(){
                Ext.getCmp("roomsGrid").getEl().mask("Loading Rooms Status...");
                roomsStore.load({
                    callback: function() {
                        Ext.getCmp("roomsGrid").getEl().unmask();
                    }
                });
            }

        }
    }).show();
    loadTabPanel.doLayout();
}



function add_edit_room(roomsArray){
    var roomform = {
        xtype:'form',
        id:'roomform',
        name:'roomform',
        frame:true,
        border:false,
        bodyPadding:10,
        fieldDefaults: {
            labelAlign: 'right',
            msgTarget: 'side',
            labelSeparator:''//,
            //labelWidth: 120
        },
        defaultType: 'textfield',
        items: [
            {
                xtype: 'numberfield',
                fieldLabel:'Room No',
                name:'roomNo',
                id:'roomNo',                
                minValue: 1,
                allowBlank:false,
                blankText:'Please enter the Room Number',
                listeners:{
                    afterrender:function(){
                        if(roomsArray[0]!="")
                            this.setValue(roomsArray[0]);
                    }
                }
            },
            {
                xtype: 'numberfield',
                fieldLabel:'Room Capacity',
                name:'roomCapacity',
                id:'roomCapacity',
                allowBlank:false,
                blankText:'Please enter the Room Capacity',
                value: 4,
                minValue: 1,
                maxValue: 10,               
                listeners:{
                    afterrender:function(){
                        if(roomsArray[1]!="")
                            this.setValue(roomsArray[1]);
                    }
                }
            }                           
        ]
    }


    var roomsWin = Ext.create('Ext.Window', {
        title: roomsArray['todo']=="Add_Room"?"Add Room":"Edit Room",
        width:400,
        height:200,
        plain: true,
        modal:true,
        closable:true,
        border: false,
        layout: {
    //        align: 'stretch',
            type: 'fit'
        },
        items: [roomform],
        buttons: [{
            text: roomsArray['todo']=="Add_Room"?'Add':'Update',
            icon: roomsArray['todo']=="Add_Room"?'./images/add.png':'./images/editroom.png',
            handler:function(){
                var formPanel = Ext.getCmp('roomform').getForm();
                if(formPanel.isValid()){
                    formPanel.submit({
                        clientValidation: true,
                        url: 'includes/rooms_ajx.php',
                        params: {
                            todo: roomsArray['todo'], roomId:roomsArray['roomId']
                        },
                        success: function(form, action) {
                           Ext.Msg.alert('Success', action.result.msg);
                           roomsWin.destroy();
                           Ext.getCmp("roomsGrid").getStore().loadPage(1);
                            Ext.getCmp("roomEditButton").disable();
                            Ext.getCmp("roomDeleteButton").disable();
                            Ext.getCmp("viewGuestsButton").disable();                              
                           //CustomersStore.load({params:{start:0, limit:30}});
                        },
                        failure: function(form, action) {
                            switch (action.failureType) {
                                case Ext.form.action.Action.CLIENT_INVALID:
                                    Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                                    break;
                                case Ext.form.action.Action.CONNECT_FAILURE:
                                    Ext.Msg.alert('Failure', 'Ajax communication failed');
                                    break;
                                case Ext.form.action.Action.SERVER_INVALID:
                                   Ext.Msg.alert('Failure', action.result.msg);
                           }
                        }
                    });
                }
            }
        },{
            text: 'Reset',
            hidden:roomsArray['todo']=="Add_Room"?false:true,
            icon:'./images/refresh.png',
            handler: function() {
                Ext.getCmp('roomform').getForm().reset();
            }
        },{
            text: 'Close',
            icon:'./images/close.png',
            handler: function() {
                roomsWin.destroy();
            }
        }]
        }).show();
        Ext.getCmp('roomNo').focus(true,1000);


}

function delete_room(gridRec){
    var roomId          = gridRec[0].get("roomId");
    var roomNo          = gridRec[0].get("roomNo");
    var roomCapacity    = gridRec[0].get("roomCapacity");
    var noOfGuests      = gridRec[0].get("noOfGuests");
    if(noOfGuests>0){
        Ext.MessageBox.show({
            title:'Error',
            msg: 'You cannot delete the Room <b>[ '+roomNo+' ]</b> !<br><br><span class="tableTextM">There are some guests already in the room</span>',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }else{

        Ext.MessageBox.show({
            title:'Confirm Delete?',
            msg: 'Are you sure to delete the Room <b>[ '+roomNo+' ]</b> ?<br><br><span class="tableTextM">Note:- All related information will be deleted permanently. This action cannot be undone</span>',
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn, text){
                if(btn=="yes"){
                    Ext.Ajax.request({
                        url: 'includes/rooms_ajx.php',
                        timeout: 1200000,
                        params: {
                            todo:'Delete_Room',
                            roomId : roomId,
                            roomNo :roomNo
                        },
                        success: function(response){
                            response = Ext.decode(response.responseText);
                            if(response.success){
                                Ext.MessageBox.show({
                                    title:'SUCCESS',
                                    msg: response.msg
                                });
                                Ext.getCmp("roomsGrid").getStore().loadPage(1);
                            }else{
                                Ext.MessageBox.show({
                                    title:'ERROR',
                                    msg: response.msg
                                });
                            }
                            setTimeout(function(){
                                Ext.MessageBox.hide();
                            }, 2000);
                        }
                    });
                }
            },
           icon: Ext.MessageBox.CONFIRM
        });
    }
}
/****
 * View Guests in a particular room
 * This lists only the guests who are straying right now. 
 * Vacated guests lists can be seen in reports only
 *
 ***/
function viewGuests(roomId,roomNo){

    Ext.define('roomguestsData', {
        extend: 'Ext.data.Model',
            fields: [
                {name: 'guestId',mapping: 'guestId',type:'int'},
                {name: 'guestName',mapping: 'guestName',type:'string'},
                {name: 'fatherName',mapping: 'fatherName',type:'string'},
                {name: 'nativePlace',mapping: 'nativePlace', type: 'string'},
                {name: 'address',mapping: 'address', type: 'string'},
                {name: 'nativePhone',mapping: 'nativePhone', type: 'string'},
                {name: 'permanentAddress',mapping: 'permanentAddress', type: 'string'},
                {name: 'permanentPhone',mapping: 'permanentPhone', type: 'string'},
                {name: 'localAddress',mapping: 'localAddress', type: 'string'},
                {name: 'localPhone',mapping: 'localPhone', type: 'string'},
                {name: 'occupation',mapping: 'occupation', type: 'string'},
                {name: 'occupationPhone',mapping: 'occupationPhone', type: 'string'},
                {name: 'mobile',mapping: 'mobile', type: 'string'},
                {name: 'lastResidenceAddress',mapping: 'lastResidenceAddress', type: 'string'},
                {name: 'lastResidencePhone',mapping: 'lastResidencePhone', type: 'string'},
                {name: 'reasonOfStay',mapping: 'reasonOfStay', type: 'string'},
                {name: 'joiningDate',mapping: 'joiningDate', type: 'string'},
                {name: 'vacatingDate',mapping: 'vacatingDate', type: 'string'},
                {name: 'advanceAmount',mapping: 'advanceAmount', type: 'string'},
                {name: 'advanceDate',mapping: 'advanceDate', type: 'string'},
                {name: 'roomNo',mapping: 'roomNo', type: 'string'},
                {name: 'vehicleNo',mapping: 'vehicleNo', type: 'string'},
                {name: 'status',mapping: 'status', type: 'string'},
                {name: 'comments',mapping: 'comments', type: 'string'},
                {name: 'viewphoto',mapping: 'viewphoto', type: 'string'}
            ],
        idvehicle: 'guestId'
    });

    var roomguestsStore = Ext.create('Ext.data.JsonStore', {
        id: 'roomguestsStore',
        model: 'roomguestsData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
            actionMethods: {
                read: 'POST'
            },
            url: './includes/guests_ajx.php',
            extraParams: {
                todo : 'Get_Guests_List',
                filterRoom:roomId
            },
            reader: {
                type: 'json',
                root: 'GUESTS',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'guestName',
            direction: 'ASC'
        }]
    });

    var roomGuestscol   = [ Ext.create('Ext.grid.RowNumberer'),
        {text: "guest Id", dataIndex: 'guestId', width:40, sortable: false,hidden:true},
        {text: "Guest Name", dataIndex: 'guestName', width:120, sortable: true,},
        {text: "roomNo", dataIndex: 'roomNo',  width:60, sortable: true,align:'center'},
        {text: "mobile", dataIndex: 'mobile',  width:100, sortable: false,align:'left'},
        {text: "Occupation", dataIndex: 'occupation',  width:100, sortable: false,align:'center'},
        {text: "Occupation Phone", dataIndex: 'occupationPhone',  width:100, sortable: false,align:'center'},
        {text: "Joining Date", dataIndex: 'joiningDate',  width:100, sortable: true,align:'center'},
        {text: "Reason Of Stay", dataIndex: 'reasonOfStay',  width:100, sortable: true,align:'center'},
        {text: "Vehicle No", dataIndex: 'vehicleNo',  width:100, sortable: false,align:'left'},
        {text: "Status", dataIndex: 'status',  width:80, sortable: true,align:'center'},
        {text: "Photo", dataIndex: 'viewphoto',  width:60, sortable: true,align:'center'}
    ];  

    var photoPanel = new Ext.panel.Panel({
        title:'Guest Photo',
        width:320,
        height:240,
        id:'guestphotoPanel',
        items:[
        {
            xtype:'image',
            width:320,
            height:240,
            id:'guestPhotoImage',
            src:'./images/nophoto.png'
        }]
    });
    var signPanel = new Ext.panel.Panel({
        title:'Guest Sign',
        width:320,
        height:240,
        id:'guestsignPanel',
        items:[
        {
            xtype:'image',
            width:320,
            height:240,
            id:'guestSignImage',
            src:'./images/nophoto.png'
        }]
    });

    var roomguestsGrid = new Ext.grid.GridPanel({
        id:'roomguestsGrid',
        xtype: 'grid',
        enableColumnHide:false,
        enableColumnMove:false,
        layout: 'fit',
        height:480,
        autoScroll:true,
        loadMask: true,
        border:true,
        bodyBorder:true,
        store:roomguestsStore,
        tools:[{
            itemId: 'dashrefresh',
            type: 'refresh',
            tooltip:'Refresh Guests List',
            handler: function(){
                Ext.getCmp("roomguestsGrid").getEl().mask("Loading Guests in Room "+roomNo);
                roomguestsStore.load({
                    callback: function() {
                        Ext.getCmp("roomguestsGrid").getEl().unmask();
                        var noPhoto = './images/nophoto.png';
                        Ext.getCmp('guestPhotoImage').getEl().dom.src=noPhoto;
                    }
                });
            }
        }],
        plugins: [{
            ptype: 'rowexpander',
            rowBodyTpl : [
                "<p><b>Father's Name:</b> {fatherName}</p>",
                "<p><b>Native Place:</b> {nativePlace} <b>Ph:</b> {nativePhone}</p>",
                "<p><b>Address:</b> {address}</p>",
                "<p><b>Last Residence:</b> {lastResidenceAddress} <b>Ph:</b> {lastResidencePhone}</p>",
                "<p><b>Local Address:</b> {localAddress} <b>Ph:</b> {localPhone}</p>"
            ]
        }],
        selModel: {
            selType: 'rowmodel',
            mode : 'SINGLE',
            listeners:{
                'selectionchange':function(selmod, record, opt){
                    if(selmod.hasSelection()){
                        Ext.getCmp("guestphotoPanel").getEl().mask("Loading Photo of "+record[0].get("guestName"));
                        guestId = record[0].get("guestId");
                        guestName = record[0].get("guestName");

                        var guestPhoto = './guestsPhotos/'+guestId+'_'+guestName.replace(/ /g, "")+'_photo.png';
                        var noPhoto = './images/nophoto.png';
                        //load the photo saved earlier
                        var randomNum = Math.round(Math.random() * 10000);
                        var oImg=new Image;
                        oImg.src=guestPhoto; //+"?rand="+randomNum;
                        oImg.onload=function(){
                            Ext.getCmp('guestPhotoImage').getEl().dom.src=oImg.src;
                        }
                        oImg.onerror=function(){
                            Ext.getCmp('guestPhotoImage').getEl().dom.src=noPhoto;
                        }

                        var guestSign = './guestsSign/'+guestId+'_'+guestName.replace(/ /g, "")+'_sign.png';
                        var soImg=new Image;
                        soImg.src=guestSign; //+"?rand="+randomNum;
                        soImg.onload=function(){
                            Ext.getCmp('guestSignImage').getEl().dom.src=soImg.src;
                        }
                        soImg.onerror=function(){
                            Ext.getCmp('guestSignImage').getEl().dom.src=noPhoto;
                        }                        

                        Ext.getCmp("guestphotoPanel").getEl().unmask();
                    }
                }
            }
        },
        viewConfig: {
            forceFit:true,
            stripeRows: true,
            emptyText:"<span class='tableTextM'>No Records Found</span>"
        },
        columns: roomGuestscol,
        border:false,
        collapsible: false,
        animCollapse: false,
        stripeRows: true,
        listeners:{
            afterrender:function(){
                Ext.getCmp("roomguestsGrid").getEl().mask("Loading Guests...");
                roomguestsStore.load({
                    callback: function() {
                        Ext.getCmp("roomguestsGrid").getEl().unmask();
                    }
                });
            }

        },
        dockedItems: [{
            xtype: 'pagingtoolbar',
            id:'roomguestsGridPbar',
            store: roomguestsStore,
            dock: 'bottom',
            pageSize: 100,
            displayInfo: true,
            listeners: {
                afterrender : function() {
                    //hide the refresh button in the bbar
                    this.child('#refresh').hide();
                }
            }
        }]              
    });

    var roomGuestsWin = Ext.create('Ext.Window', {
        title: "View Guests in Room "+roomNo,
        width:1300,
        height:540,
        plain: true,
        modal:true,
        closable:true,
        // border: false,
        layout: {
    //        align: 'stretch',
            type: 'fit',
            // align:'left'
        },
        items: [
            {
                        layout:'column',
                        border:false,
                        items:[
                            {
                                columnWidth:.76,
                                //layout: 'fit',
                                bodyStyle:'background-color:#f7f7f7;padding-right:1px',
                                border:false,
                                items: [roomguestsGrid]
                            },
                            {
                                columnWidth:.24,
                                //layout: 'fit',
                                bodyStyle:'background-color:#f7f7f7;padding-right:1px',
                                border:false,
                                items: [photoPanel,signPanel] 
                            }
                        ]
            }
        ],
        //roomguestsGrid
        buttons: [
            {
                text: 'View Proofs',                
                icon:'./images/view.png',
                handler:function(){
                    // var gridRec = Ext.getCmp("roomsGrid").getSelectionModel().getSelection();
                    if (roomguestsGrid.getSelectionModel().hasSelection()) {
                        var record = roomguestsGrid.getSelectionModel().getSelection();
                        guestId = record[0].get("guestId");
                    
                        var winHandle = window.open("./viewimages.php?guestId="+guestId,"ViewProofs","width=670,height=480");
                        if(winHandle==null){
                            Ext.Msg.alert("Error","Error: While Launching New Window...\nYour browser maybe blocking up Popup windows. \n\n  Please check your Popup Blocker Settings");
                        }
                    }else{
                        Ext.Msg.alert("Info","Please select a guest in the list, to view the uploaded proofs");
                    }
                }
            },
            {
                text: 'Close',
                icon:'./images/close.png',
                handler: function() {
                    roomGuestsWin.destroy();
                    Ext.getCmp("roomsGrid").getSelectionModel().deselectAll();
                }
            }
        ]
    }).show();

    // var roomGuestsPhotoWin = Ext.create('Ext.Window', {
    //  title: "View Guests in Room "+roomNo,
    //  width:300,
    //  height:400,
    //  plain: true,
    //  modal:true,
    //  closable:true,
    //  border: false,
    //  layout: {
    // //        align: 'stretch',
    //      type: 'hbox',
    //      align:'left'
    //  },
    //  items: [photoPanel],
    //  buttons: [{
    //      text: 'Close',
    //      handler: function() {
    //          roomGuestsPhotoWin.destroy();
    //      }
    //  }]
    //     }).show();   
}

