/**
 * roomreports.js
 *
 * Reports on 
 * 		1. Room Status - Full, partial, Empty
 * 		2. View Guest option with photo, photo download, printing, etc 
 * 		
 * 	@author Kumar S
 * 	@copyright amofly.com	
 * 	
 **/
Ext.QuickTips.init();


function showRoomReports(){

	if(Ext.getCmp("RoomReportsGrid")){
		Ext.getCmp("SAdminPanelRoomReports").setActiveTab("RoomReportsGrid");
		return false;
	}
	
	Ext.define('RoomReportsdata', {
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

	var RoomReportsStore = Ext.create('Ext.data.JsonStore', {
        id: 'RoomReportsStore',
        model: 'RoomReportsdata',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/rooms_ajx.php',
            extraParams: {
				todo : 'Get_Rooms_List'
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

	var RoomReportscol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Room Id", dataIndex: 'roomId', width:40, sortable: false,hidden:true},
		{text: "Room No", dataIndex: 'roomNo', width:120, sortable: true,},
		{text: "Room Capacity", dataIndex: 'roomCapacity', width:120, sortable: true,align:'center'},
		{text: "Room Status", dataIndex: 'roomStatus', width:100, sortable: true,align:'center'},
		{text: "No Of Guests", dataIndex: 'noOfGuests',  width:100, sortable: false,align:'center'}
	];	
	
	var gRoomStatusStore = Ext.create('Ext.data.ArrayStore', {
	    fields: ['val','status'],
	    data : [
				["A","All"],
				["E","Empty"],
				["F","Full"],
				["P","Partial"]
			]
	});
	
	function onItemClick(item){
		var menu_id = item.id;
		if(menu_id=="view"){
			var searchFor	= Ext.getCmp("roomStatus").getValue();
			RoomReportsStore.baseParams = {roomStatus:searchFor, start:0, limit:30};
			RoomReportsStore.load({params:{roomStatus:searchFor, start:0, limit:30}});
		}
		if(menu_id=="excel"){
			var searchFor	= Ext.getCmp("roomStatus").getValue();
			Ext.DomHelper.append(document.body, {
				   tag: 'iframe',
				   frameBorder: 0,
				   width: 0,
				   height: 0,
				   css: 'display:none;visibility:hidden;height:1px;',
				   src: 'includes/rooms_ajx.php?todo=GenXL_RoomsList&roomStatus='+searchFor
		   });			
		}
	}

	var loadTabPanel = Ext.getCmp('SAdminPanelRoomReports');
	loadTabPanel.add({
		id:'RoomReportsGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:RoomReportsStore,
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
		columns: RoomReportscol,
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		tbar:[
            {
				xtype: 'combo',
				fieldLabel: 'Room Status',
				labelSeparator:'',
				grow:false,
				id:'roomStatus',
				name:'roomStatus',
				triggerAction:'all',
				forceSelection:true,
				editable:false,
				store: gRoomStatusStore,
				queryMode: 'local',
				displayField: 'status',
				valueField: 'val',
				value:'A',
            },
            {
            	xtype:'button',
            	text:'View Room Status',            	
            	icon: './images/view.png',
				cls: 'x-btn-bigicon',
            	qtip:"Generate Reports based on Room Status",
            	handler:function(){
					var searchFor	= Ext.getCmp("roomStatus").getValue();
					RoomReportsStore.baseParams = {roomStatus:searchFor, start:0, limit:30};
					RoomReportsStore.load({params:{roomStatus:searchFor, start:0, limit:30}});            		
            	}            	
            },
            '-',
            {
            	xtype:'button',
            	text:'Generate as Excel',            	
            	icon: './images/excel.png',
				cls: 'x-btn-bigicon',
            	qtip:"Generate Reports based on Room Status",
            	handler:function(){
					var searchFor	= Ext.getCmp("roomStatus").getValue();
					Ext.DomHelper.append(document.body, {
						   tag: 'iframe',
						   frameBorder: 0,
						   width: 0,
						   height: 0,
						   css: 'display:none;visibility:hidden;height:1px;',
						   src: 'includes/rooms_ajx.php?todo=GenXL_RoomsList&roomStatus='+searchFor
				   });       		
            	}             	
            }
    //         {
    //         	xtype:'button',
    //         	text:'View Room Status',            	
    //         	icon: './images/view.png',
				// cls: 'x-btn-bigicon',
    //         	qtip:"Generate Reports based on Room Status",
				// menuAlign:'bl',
				// menu: [
				// 	{text: 'View', icon:'./images/view.png', floating: false, handler: onItemClick, id:'view'},
				// 	{text: 'Generate Excel',icon:'./images/excel.png', floating: false, handler: onItemClick, id:'excel'}
				// ]	
				// 		// listeners:{activate:function(item){
				// 		// 							console.log(item.id);
				// 		// 							if(version =='B') {
				// 		// 								Ext.getCmp(item.id).disable();
				// 		// 							}
				// 		// 						}}					
    //         },		
    //         {
    //         	xtype:'button',
    //         	text:'View Guests',
    //         	icon: './images/guests.png',
				// cls: 'x-btn-bigicon',
    //         	qtip:"Generate Reports based on Room Status",
				// menuAlign:'bl',
				// menu: [
				// 	{text: 'View', icon:'./images/view.png', floating: false, handler: onItemClick, id:'view'},
				// 	{text: 'Download as Excel',icon:'./images/excel.png', floating: false, handler: onItemClick, id:'gexcel'}
				// ]	            	
    //         }
		],
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'RoomReportsGridPbar',
			store: RoomReportsStore,
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
				Ext.getCmp("RoomReportsGrid").getEl().mask("Loading Rooms Status...");
				RoomReportsStore.load({
					callback: function() {
						Ext.getCmp("RoomReportsGrid").getEl().unmask();
					}
				});
			}

		}
    }).show();
	loadTabPanel.doLayout();	
}