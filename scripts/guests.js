/*********************
 * TODO: 
 * 	Validation 
 *	Show Network status
 *	Search Feature
 *	Verify the photo loads properly 
 *	Photo editing tools for captured photo
 *
 ****/
function showGuests(){
	var lrtMap, lrtRen, lrtSer;
	if(Ext.getCmp("guestsGrid")){
		Ext.getCmp("SAdminPanelGuests").setActiveTab("guestsGrid");
		return false;
	}


	Ext.define('guestsData', {
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
				{name: 'occupationAddress',mapping: 'occupationAddress', type: 'string'},
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

	var guestsStore = Ext.create('Ext.data.JsonStore', {
        id: 'guestsStore',
        model: 'guestsData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/guests_ajx.php',
            extraParams: {
				todo : 'Get_Guests_List'
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

	var Guestscol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "guest Id", dataIndex: 'guestId', width:40, sortable: false,hidden:true},
		{text: "Guest Name", dataIndex: 'guestName', width:120, sortable: true,},
		{text: "roomNo", dataIndex: 'roomNo',  width:100, sortable: true,align:'center'},
		{text: "mobile", dataIndex: 'mobile',  width:100, sortable: false,align:'left'},
		{text: "Occupation", dataIndex: 'occupation',  width:100, sortable: false,align:'left'},
		{text: "Occupation Phone", dataIndex: 'occupationPhone',  width:100, sortable: false,align:'center'},
		{text: "Joining Date", dataIndex: 'joiningDate',  width:100, sortable: true,align:'center'},
		{text: "Reason Of Stay", dataIndex: 'reasonOfStay',  width:100, sortable: true,align:'center'},
		{text: "Vehicle No", dataIndex: 'vehicleNo',  width:100, sortable: false,align:'left'},
		{text: "Status", dataIndex: 'status',  width:100, sortable: true,align:'center'},
		{text: "Photo", dataIndex: 'viewphoto',  width:100, sortable: true,align:'center'}
	];	
	


	var loadTabPanel = Ext.getCmp('SAdminPanelGuests');
	loadTabPanel.add({
		id:'guestsGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:guestsStore,
		plugins: [{
		    ptype: 'rowexpander',
            rowBodyTpl : [
                "<p><b>Father's Name:</b> {fatherName}</p>",
                "<p><b>Native Place:</b> {nativePlace} <b>Ph:</b> {nativePhone}</p>",
                "<p><b>Address:</b> {address}</p>",
                "<p><b>Last Residence:</b> {lastResidenceAddress} <b>Ph:</b> {lastResidencePhone}</p>",
                "<p><b>Local Address:</b> {localAddress} <b>Ph:</b> {localPhone}</p>"
                // "<p><b>Local Address:</b> {localAddress} <b>Ph:</b> <img src='./guestsPhotos/{guestId}_{guestName}_photo.png' width=300 height=300/></p>"
            ]
        }],
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
		columns: Guestscol,
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		tbar:[{
			xtype:'buttongroup',
			items: [
			{
				text:'Add New Guest',            	
            	icon: './images/newguest.png',
				cls: 'x-btn-bigicon',
				scale: 'small',				
				handler:function(){
					var guestArray 			= new Array();
					guestArray["todo"]		= "Add_Guest";
					guestArray["titleStr"]	= "Add New Guest";
					guestArray['guestId'] = 0;

					for(var i=0;i<=3;i++){
						guestArray[i]="";
					}
					add_edit_guest(guestArray);
					// Ext.getCmp('vacatingDate').hide();
				}				
			},
			{
				text:'Edit Guest Details',
				disabled:true,            	
            	icon: './images/edituser.png',
				cls: 'x-btn-bigicon',
				scale:'small',
				id:'guestEditButton',
				handler:function(){
					var gridRec = Ext.getCmp("guestsGrid").getSelectionModel().getSelection();
					if(gridRec.length>0){
						var guestArray 			= new Array();
						guestArray["todo"]		= "Edit_Guest";
						guestArray["titleStr"]	= "Edit Guest Details";
						guestArray['guestId'] 	= gridRec[0].get("guestId");
						guestArray[0]	= gridRec[0].get("guestName");
						guestArray[1]	= gridRec[0].get("fatherName");
						guestArray[2]	= gridRec[0].get("mobile");
						guestArray[3]	= gridRec[0].get("nativePlace");
						guestArray[4]	= gridRec[0].get("address");
						guestArray[5]	= gridRec[0].get("nativePhone");
						guestArray[6]	= gridRec[0].get("permanentAddress");
						guestArray[7]	= gridRec[0].get("permanentPhone");
						guestArray[8]	= gridRec[0].get("localAddress");
						guestArray[9]	= gridRec[0].get("localPhone");
						guestArray[10]	= gridRec[0].get("occupation");
						guestArray[11]	= gridRec[0].get("occupationPhone");
						guestArray[12]	= gridRec[0].get("lastResidenceAddress");
						guestArray[13]	= gridRec[0].get("lastResidencePhone");
						guestArray[14]	= gridRec[0].get("reasonOfStay");
						
						guestArray[15]	= gridRec[0].get("joiningDate");
						var date = Ext.Date.parse(guestArray[15], 'd/m/Y');
						guestArray[15]	= Ext.Date.format(date, "Y/m/d");

						guestArray[16]	= gridRec[0].get("vacatingDate");
						var date = Ext.Date.parse(guestArray[16], 'd/m/Y');
						guestArray[16]	= Ext.Date.format(date, "Y/m/d");

						guestArray[17]	= gridRec[0].get("advanceAmount");
						guestArray[18]	= gridRec[0].get("advanceDate");
						guestArray[19]	= gridRec[0].get("roomNo");
						guestArray[20]	= gridRec[0].get("vehicleNo");
						guestArray[21]	= gridRec[0].get("status");
						guestArray[22]	= gridRec[0].get("comments");
						guestArray[23]	= gridRec[0].get("occupationAddress");

						add_edit_guest(guestArray);
					
					}					
				}
			},
			{
				text:'Manage Id / Address Proof',
				disabled:true,
				scale:'small',            	
            	icon: './images/idproof.png',
				cls: 'x-btn-bigicon',
				id:'proofEditButton',
				handler:function(){
					var gridRec = Ext.getCmp("guestsGrid").getSelectionModel().getSelection();
					if(gridRec.length>0){
						var guestArray 			= new Array();
						guestArray["todo"]		= "Edit_Proof";
						guestArray["titleStr"]	= "Manage Proofs of Guest ";
						guestArray['guestId'] 	= gridRec[0].get("guestId");
						guestArray['guestName'] 	= gridRec[0].get("guestName");
						guestArray[0]	= gridRec[0].get("guestName");

						add_edit_proof(guestArray);
					
					}					
				}
			},
			{
				text:'Mark Vacating Date',
				disabled:true,
				scale:'small',            	
            	icon: './images/checkout.png',
				cls: 'x-btn-bigicon',
				id:'checkoutBtn',
				handler:function(){
					var gridRec = Ext.getCmp("guestsGrid").getSelectionModel().getSelection();
					if(gridRec.length>0){
						var guestArray 			= new Array();
						guestArray["todo"]		= "setCheckoutDate";
						guestArray["titleStr"]	= "Mark Vacating Date";
						guestArray['guestId'] 	= gridRec[0].get("guestId");
						guestArray['guestName'] 	= gridRec[0].get("guestName");
						guestArray[0]	= gridRec[0].get("guestName");
						guestArray[1]	= gridRec[0].get("advanceDate");
						guestArray[2]	= gridRec[0].get("advanceAmount");
						guestArray[3]	= gridRec[0].get("comments");

						setCheckoutDate(guestArray);
					
					}					
				}
			}		
		 	]
		// },'->'
		},
		'->',
		'-',
		{
			xtype:'textfield',
			width:250,
			id:'filterText',
			emptyText:'name|any Phone no|vehicleNo|occupation'			
		},
		{
			xtype:'button',
			text:'Search >>',            	
        	icon: './images/search.png',
			cls: 'x-btn-bigicon',
			handler:function(){
				var filterText	= Ext.getCmp("filterText").getRawValue();
				guestsStore.baseParams = {filterText:filterText, start:0, limit:30};
				guestsStore.load({params:{filterText:filterText, start:0, limit:30}});
			}
		}
		// ,
		// '-',	
		// {
		// 	xtype:'buttongroup',
		// 	items: [{
		// 		text:'Generate Excel',
		// 		scale: 'small'				
		// 	}]
		// }
		


		],
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'guestsGridPbar',
			store: guestsStore,
			dock: 'bottom',
			pageSize: 100,
			displayInfo: true
		}],
		listeners:{
			'selectionchange':function(selmod, record, opt){
				try{
					if(record[0].get("guestId")!=0){
						Ext.getCmp("guestEditButton").enable();
						Ext.getCmp("proofEditButton").enable();
						Ext.getCmp("checkoutBtn").enable();						
					}
				}
				catch (e){
				}
			},
			rowselect: function(selModel, rowIndex, record){
				console.log(record[0].get('guestId'));
			},
			afterrender:function(){
				Ext.getCmp("guestsGrid").getEl().mask("Loading Guests List...");
				guestsStore.load({
					callback: function() {
						Ext.getCmp("guestsGrid").getEl().unmask();
					}
				});
			},
			rowdblclick: function(grid, rowIndex, event){
				var record = grid.getStore().getAt(rowIndex);
				console.log(record[0].get('guestId'));
			}
						

		}
    }).show();
	loadTabPanel.doLayout();
}



function add_edit_guest(guestArray){
	var myImage;

	var reasonStore = Ext.create('Ext.data.ArrayStore', {
	    fields: ['val','reason'],
	    data : [
				["B","Business"],
				["R","Residence"],
				["S","Student"],
				["E","Employee"]
			]
	});

	var statusStore = Ext.create('Ext.data.ArrayStore', {
	    fields: ['val','status'],
	    data : [
				["S","Staying"],
				["V","Vacated"]
			]
	});

	var guestform = {
		xtype:'form',
		id:'guestform',
		name:'guestform',
		frame:true,
		border:false,
		bodyPadding:10,
		fieldDefaults: {
			labelAlign: 'right',
			msgTarget: 'side',
			labelWidth: false,
			labelStyle: 'width: auto',
			labelSeparator:''//,
			//labelWidth: 120
		},
		defaultType: 'textfield',
		layout:{
			type:'column'
		},
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

				xtype: 'container',
				columnWidth: .33,
				layout:{
					type:'anchor'
				},
				border:false,
				style:'padding-left:5px;padding-right:15px',
				items: [
						{
							xtype: 'textfield',
							fieldLabel:'Guest Name',
							name:'guestName',
							id:'guestName',				
							allowBlank:false,
							blankText:'Please enter the Guest Name',
							vtype:'nameVal',
							listeners:{
								afterrender:function(){
									if(guestArray[0]!="")
										this.setValue(guestArray[0]);
								}
							}
						},
						{
							xtype: 'textfield',
							fieldLabel:'Father\'s Name',
							name:'fatherName',
							id:'fatherName',
							allowBlank:false,
							blankText:'Please enter the Father\'s Name',
							vtype:'nameVal',
							listeners:{
								afterrender:function(){
									if(guestArray[1]!="")
										this.setValue(guestArray[1]);
								}
							}
						},
						{
							xtype: 'textfield',
							fieldLabel:'Mobile',
							name:'mobile',
							id:'mobile',
							allowBlank:false,
							vtype:'mobileval',
							// emptyText:'Only Mobile numbers',
							blankText:'Please enter the mobile Phone',
							listeners:{
								afterrender:function(){
									if(guestArray[2]!="")
										this.setValue(guestArray[2]);
								}
							}
						},
						{
							xtype: 'textfield',
							fieldLabel:'Native Place',
							name:'nativePlace',
							id:'nativePlace',
							allowBlank:false,
							blankText:'Please enter the Native Place',
							vtype:'cityVal',
							listeners:{
								afterrender:function(){
									if(guestArray[3]!="")
										this.setValue(guestArray[3]);
								}
							}
						},
						{
							xtype: 'textarea',
							fieldLabel:'Address',
							name:'address',
							id:'address',
							width:350,
							allowBlank:false,
							blankText:'Please enter the address',
							// vtype:'addressVal',
							listeners:{
								afterrender:function(){
									if(guestArray[4]!="")
										this.setValue(guestArray[4]);
								}
							}
						},
						{
							xtype: 'textfield',
							// minValue:0,
							// hideTrigger: true,
							// keyNavEnabled: false,
							// mouseWheelEnabled: false,
							fieldLabel:'Native Phone',
							name:'nativePhone',
							id:'nativePhone',
							allowBlank:false,
							blankText:'Please enter the Native Phone',
							vtype:'phoneVal',
							// emptyText:'Only Numbers',
							listeners:{
								afterrender:function(){
									if(guestArray[5]!="")
										this.setValue(guestArray[5]);
								}
							}
						},
						{
							xtype: 'checkboxfield',
							boxLabel  :'Same as Native Place',
							fieldLabel:' ',
							name:'copynative',
							id:'copynative',
							handler:function(){
									//copy the native address and phone to permanent
									if(Ext.getCmp('copynative').checked){
										Ext.getCmp('permanentaddress').setValue( Ext.getCmp('address').getValue() ); 
										Ext.getCmp('permanentPhone').setValue( Ext.getCmp('nativePhone').getValue() ); 
									}
									else{
										Ext.getCmp('permanentaddress').setValue(""); 
										Ext.getCmp('permanentPhone').setValue(""); 
									}	
							}
						},
						{
							xtype: 'textarea',
							fieldLabel:'Permanent Address',
							name:'permanentaddress',
							id:'permanentaddress',
							labelWidth: 102,							
							width:350,
							allowBlank:false,
							blankText:'Please enter the Permanent address',
							listeners:{
								afterrender:function(){
									if(guestArray[6]!="")
										this.setValue(guestArray[6]);
								}
							}
						},
						{
							xtype: 'textfield',
							// minValue:0,
							// hideTrigger: true,
							// keyNavEnabled: false,
							// mouseWheelEnabled: false,
							fieldLabel:'Permanent Phone',
							name:'permanentPhone',
							id:'permanentPhone',
							allowBlank:false,
							blankText:'Please enter the Permanent Phone',
							vtype:'phoneVal',
							// emptyText:'Only Numbers',
							listeners:{
								afterrender:function(){
									if(guestArray[7]!="")
										this.setValue(guestArray[7]);
								}
							}
						},
						{
							xtype: 'textarea',
							fieldLabel:'Local Address',
							name:'localAddress',
							id:'localAddress',
							width:350,
							allowBlank:true,
							blankText:'Please enter the Local address',
							listeners:{
								afterrender:function(){
									if(guestArray[8]!="")
										this.setValue(guestArray[8]);
								}
							}
						},
						{
							xtype: 'textfield',
							// minValue:0,
							// hideTrigger: true,
							// keyNavEnabled: false,
							// mouseWheelEnabled: false,
							fieldLabel:'Local Phone',
							name:'localPhone',
							id:'localPhone',
							allowBlank:true,
							blankText:'Please enter the Local Phone',
							vtype:'phoneVal',
							// emptyText:'Only Numbers',
							listeners:{
								afterrender:function(){
									if(guestArray[9]!="")
										this.setValue(guestArray[9]);
								}
							}
						}							
				]			
		},
		{

				xtype: 'container',
				columnWidth: .37,
				layout:{
					type:'anchor'
				},
				border:false,
				style:'padding-left:5px;padding-right:15px',
				items: [
						{
							xtype: 'textfield',
							fieldLabel:'Occupation',
							name:'occupation',
							id:'occupation',
							allowBlank:false,
							blankText:'Please enter the Occupation',
							vtpye:'nameVal',
							listeners:{
								afterrender:function(){
									if(guestArray[10]!="")
										this.setValue(guestArray[10]);
								}
							}
						},
						{
							xtype: 'textarea',
							fieldLabel:'Occupation Address',
							name:'occupationAddress',
							id:'occupationAddress',
							width:350,
							allowBlank:true,
							listeners:{
								afterrender:function(){
									if(guestArray[23]!="")
										this.setValue(guestArray[23]);
								}
							}
						},
						{
							xtype: 'textfield',
							fieldLabel:'Occupation Phone',
							name:'occupationPhone',
							id:'occupationPhone',
							allowBlank:true,
							// minValue:0,
							// hideTrigger: true,
							// keyNavEnabled: false,
							// mouseWheelEnabled: false,
							blankText:'Please enter the Occupation Phone',
							vtype:'phoneVal',
							// emptyText:'Only Numbers',
							listeners:{
								afterrender:function(){
									if(guestArray[11]!="")
										this.setValue(guestArray[11]);
								}
							}
						},						
						{
							xtype: 'textarea',
							fieldLabel:'Last Residence Address',
							name:'lastResidenceAddress',
							id:'lastResidenceAddress',
							width:350,
							allowBlank:true,
							listeners:{
								afterrender:function(){
									if(guestArray[12]!="")
										this.setValue(guestArray[12]);
								}
							}
						},
						{
							xtype: 'textfield',
							// minValue:0,
							// hideTrigger: true,
							// keyNavEnabled: false,
							// mouseWheelEnabled: false,
							fieldLabel:'Last Residence Phone',
							name:'lastResidencePhone',
							id:'lastResidencePhone',
							allowBlank:true,
							// emptyText:'Only Numbers',
							vtype:'phoneVal',
							listeners:{
								afterrender:function(){
									if(guestArray[13]!="")
										this.setValue(guestArray[13]);
								}
							}
						},{
							xtype: 'combo',
							fieldLabel: 'Reason for Staying',
							grow:false,
							id:'reasonOfStay',
							name:'reasonOfStay',
							store: reasonStore,
							allowBlank:false,
							blankText:'Select the Reason of Staying',
							queryMode: 'local',
							displayField: 'reason',
							editable:false,
							valueField: 'val',
							listeners:{
								afterrender:function(){
									if(guestArray[14]!="")
										this.setValue(guestArray[14]);
									else
										this.setValue("S");
								}
							}
						},
						{
							xtype: 'datefield',
							fieldLabel:'Joining Date',
							name:'joiningDate',
							id:'joiningDate',
							allowBlank:false,
							editable:false,
							blankText:'Please enter the joining Date',
							format: 'Y/m/d',
							altFormat:'Y/m/d|Y.m.d',
							// value:Ext.util.Format.date(new Date(), "Y/m/d"),
							listeners:{
								afterrender:function(){
									// debugger;
									// var dt = Ext.util.Format.date(new Date(), "Y/m/d");
									// Ext.getCmp("joiningDate").setValue(new Date());
									if(guestArray[15]!="")
										this.setValue(guestArray[15]);
								}
							}
						},
						{
							xtype: 'datefield',
							fieldLabel:'Vacating Date',
							name:'vacatingDate',
							id:'vacatingDate',
							editable:false,
							// allowBlank:false,
							blankText:'Please enter the vacating Date',
							format: 'Y/m/d',
							altFormat:'Y/m/d|Y.m.d',
							hidden:true,
							listeners:{
								afterrender:function(){
									if(guestArray[16]!="")
										this.setValue(guestArray[16]);
								}
							}
						},
						{
							xtype: 'numberfield',
							minValue:1,
							hideTrigger: true,
							keyNavEnabled: false,
							mouseWheelEnabled: false,
							fieldLabel:'Advance Amount',
							name:'advanceAmount',
							id:'advanceAmount',
							allowBlank:false,
							blankText:'Please enter the Advance Amount',
							listeners:{
								afterrender:function(){
									if(guestArray[17]!="")
										this.setValue(guestArray[17]);
								}
							}
						},
						{
							xtype: 'datefield',
							fieldLabel:'Advance Date',
							name:'advanceDate',
							id:'advanceDate',
							allowBlank:false,
							editable:false,
							blankText:'Please enter the advance Date',
							format: 'Y/m/d',
							altFormat:'Y/m/d|Y.m.d',
							listeners:{
								afterrender:function(){
									if(guestArray[18]!="")
										this.setValue(guestArray[18]);
								}
							}
						},
						{
							xtype: 'combo',
							fieldLabel:'Room No',
							grow:false,
							name:'roomId',
							id:'roomId',
							mode: 'remote',
							editable:false,
							disabled:true,
							displayField: 'roomNo',
							valueField: 'roomId',							
							allowBlank:false,
							triggerAction:'all',
							forceSelection:true,							
							blankText:'Please enter the Room Number',
							store: Ext.create('Ext.data.Store', {
		                        fields: [
		                            {name: 'roomId'},
		                            {name: 'roomNo'}
		                        ],
		                        //autoLoad: false,
		                        proxy: {
		                            type: 'ajax',
									actionMethods: {
										read: 'POST'
									},
		                            url: './includes/guests_ajx.php',
						            extraParams: {
										todo : 'Get_Rooms_List',
										//devtype:'VTS'
						            },
		                            reader: {
		                                type: 'json',
		                                root: 'ROOMS',
						                totalProperty: 'totalCount'
		                            }
		                        }
					        
					        }),
					        listeners: {
					            render: function(combo) {
					                // the edit guest option need to load the current room also.
					                //if the current room is already full then the rooms list will exclude the current room
					                //so the query needs to include the current room also				                
					                //the add functionality will need to show the rooms that are not full. so that time we don't need the 
					                //extra params.
									if(guestArray['todo']=="Edit_Guest"){
										Ext.getCmp('roomId').getStore().load({
											params:{roomNo:guestArray[19]}											
										});
									}else{
					                	Ext.getCmp('roomId').getStore().load();
									}
					            },
								afterrender:function(){
									if(guestArray[19]!=""){
										//Load the Roomd If from the combo store itself
										var roomstor = Ext.getCmp('roomId').getStore();
										roomstor.on('load',function(){				
											var idx=Ext.getCmp('roomId').getStore().findExact('roomNo',guestArray[19]);
											if(idx>=0){ //if exists in the store, then find the room id
												var room_id=Ext.getCmp('roomId').getStore().getAt(idx).get('roomId');
												Ext.getCmp('roomId').setValue(room_id);
											}
										})
									}
								}
							}
						},
						{
							xtype: 'textfield',
							fieldLabel:'Vehicle No',
							name:'vehicleNo',
							id:'vehicleNo',
							allowBlank:true,
							blankText:'Please enter the Vehicle No',
							listeners:{
								afterrender:function(){
									if(guestArray[20]!="")
										this.setValue(guestArray[20]);
								}
							}
						},{
							xtype: 'combo',
							fieldLabel: 'status',
							grow:false,
							id:'status',
							name:'status',
							store: statusStore,
							//allowBlank:true,
							queryMode: 'local',
							displayField: 'status',
							valueField: 'val',
							forceSelection:true,
							listeners:{
								afterrender:function(){
									if(guestArray[21]!="")
										this.setValue( (guestArray[21]=="Staying") ? "S":"V" );
									else
										this.setValue("S");
								}
							}
						},
						{
							xtype: 'textarea',
							fieldLabel:'Comments',
							name:'comments',
							id:'comments',
							width:350,
							allowBlank:true,
							listeners:{
								afterrender:function(){
									if(guestArray[22]!="")
										this.setValue(guestArray[22]);
								}
							}
						}
				]			
		},
		{

				xtype: 'container',
				columnWidth: .30,
				layout:{
					type:'anchor'
				},
				border:false,
				style:'padding-left:5px;padding-right:15px',
				items: [{
			                xtype: 'panel',
			                fieldLabel:'Photo',
			                width:300,
			                height:350,
			                hidden:true,
			                bodyStyle: {
			                	border:'0px'
			                },
			                html: '<canvas id="guestPhoto" width="640" height="480"></canvas>'
					        //<br/><input type="button" onclick="window.open(\'capture.html\',\'captureWindow\',\'height=450,width=350\')" value="Start Camera"/>'
		        		},
		        		{
		        			xtype:'button',
		        			text:'Start Camera',
		        			handler:function(){
		        				window.open('capture.html','captureWindow','height=520,width=660');
		        			}
		        		},
		        		{
		        			xtype:'image',
		        			width:320,
		        			height:240,
		        			id:'guestPhotoImage',
		        			src:'./images/nophoto.png',
		        			listeners:{
								afterrender:function(){
									Ext.getCmp("guestPhotoImage").getEl().mask("Loading Guest Photo...");
									var guestPhoto = './guestsPhotos/'+guestArray['guestId']+'_'+guestArray[0].replace(/ /g, "")+'_photo.png';
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
									Ext.getCmp("guestPhotoImage").getEl().unmask();	
								}
							}
		        		},{
			                xtype: 'panel',
			                fieldLabel:'Photo',
			                id:'SignPhoto',
			                name:'SignPhoto',
			                width:300,
			                height:350,
			                hidden:true,
			                bodyStyle: {
			                	border:'0px'
			                },
			                html: '<canvas id="signPhoto" width="640" height="480"></canvas>'
					        //<br/><input type="button" onclick="window.open(\'capture.html\',\'captureWindow\',\'height=450,width=350\')" value="Start Camera"/>'
		        		},
		        		{
		        			xtype:'button',
		        			id:'signCapture',
		        			name:'signCapture',
		        			text:'Capture Signature',
		        			handler:function(){
		        				window.open('./photoboothjs/index.html','signcaptureWindow','height=520,width=660');
		        			}
		        		},
		        		{
		        			xtype:'image',
		        			width:320,
		        			height:140,
		        			id:'guestSignImage',
		        			name:'guestSignImage',
		        			src:'./images/nophoto.png',
		        			listeners:{
								afterrender:function(){
									Ext.getCmp("guestSignImage").getEl().mask("Loading Guest Photo...");
									var guestPhoto = './guestsSign/'+guestArray['guestId']+'_'+guestArray[0].replace(/ /g, "")+'_sign.png';
									var noPhoto = './images/nophoto.png';
									//load the photo saved earlier
									var randomNum = Math.round(Math.random() * 10000);
									var oImg=new Image;
									oImg.src=guestPhoto; //+"?rand="+randomNum;
									oImg.onload=function(){
										Ext.getCmp('guestSignImage').getEl().dom.src=oImg.src;
									}
									oImg.onerror=function(){
										Ext.getCmp('guestSignImage').getEl().dom.src=noPhoto;
									}								
									Ext.getCmp("guestSignImage").getEl().unmask();	
								}
							}
		        		}
		    //     		,
						// {
						// 	xtype: 'checkboxfield',
						// 	boxLabel  :'This is an existing Guest, so I\'ll Upload photo Later',
						// 	fieldLabel:'',
						// 	name:'uploadLater',
						// 	id:'uploadLater'
						// }						
		        		,
		        		{
							xtype       :'form',
							id          :'photouploadform',
							name        :'photouploadform',
							border      :false,
							title:'Upload Photo Manually',
							// bodyPadding :5,
							width      : 320,
							frame       :true,
		        			items:[		        			
		        				{
									xtype      : 'filefield',
									fieldLabel :'Upload Photo',
									id         :'guestuploadPhoto',
									name       :'guestuploadPhoto',
									width      : 300,
									buttonText : 'Select File...',
									allowBlank :true,
							        listeners:{
							            afterrender:function(cmp){
							              cmp.fileInputEl.set({
							                accept:'image/png' //,image/jpeg' // or w/e type
							              });
							            }
							        }
								},{
									xtype      : 'filefield',
									fieldLabel :'Upload Sign',
									id         :'guestuploadSign',
									name       :'guestuploadSign',
									width      : 300,
									buttonText : 'Select File...',
									allowBlank :true,
							        listeners:{
							            afterrender:function(cmp){
							              cmp.fileInputEl.set({
							                accept:'image/png' //,image/jpeg' // or w/e type
							              });
							            }
							        }
								}
				     //    		{
									// xtype      :'fieldset',
									// // layout  :'form',
									// frame      :true,
									// labelWidth :80,
									// defaults   :{labelSeparator:''},
									// title      :'< Upload Photo Manually >',
									// autoHeight :true,
									// border     :true,
				     //    			items:[
									// 	{
									// 		xtype      : 'filefield',
									// 		fieldLabel :'Upload Photo',
									// 		id         :'guestuploadPhoto',
									// 		name       :'guestuploadPhoto',
									// 		width      : 300,
									// 		buttonText : 'Select File...',
									// 		allowBlank :true,
									//         listeners:{
									//             afterrender:function(cmp){
									//               cmp.fileInputEl.set({
									//                 accept:'image/jpeg' //,image/png' // or w/e type
									//               });
									//             }
									//         }
									// 	}
									// 	,{
									// 		xtype    :'button',
									// 		icon     :'images/upload.png',
									// 		text     :'Upload Photo',
									// 		// width :100,
									// 		anchor   :'40%',
									// 		handler:function(){
									// 		    Ext.getCmp('photouploadform').submit({
									// 	            url: './includes/guests_ajx.php',
									// 	            method: 'POST',
									// 	            params : {
									// 					todo : 'UploadPhoto',
									// 					guestId:guestArray['guestId'],
									// 					guestName:guestArray[0]
									// 	        	},
									// 	            success: function(response) {
									// 	                var result = Ext.decode(response.responseText);
									// 	                if (result.success) {
									// 	                	Ext.Msg.alert("Info","Already you have uploaded some proofs for this Guest.<br/>Before uploading new Proof, view them first.<br/>If you want to upload new proofs upload to the correct prrof number");
									// 	                	Ext.getCmp('viewImages').enable();
									// 	                } else {
									// 	                    Ext.getCmp('viewImages').disable();
									// 	                }
									// 	            }
									// 	        });
									// 		}

									// 	}	        			

				     //    			]
				     //    		}
		        			]
		        		}
				        		
		        ]
		}		
		]
	}


	var guestWin = Ext.create('Ext.Window', {
		title: guestArray['todo']=="Add_Guest"?"Add Guest":"Edit Guest",
		width:1125,
		height:600,
		plain: true,
		modal:true,
		closable:true,
		border: false,
		layout: {
	//        align: 'stretch',
	        type: 'fit'
		},
		items: [guestform],
		buttons: [{
			text: guestArray['todo']=="Add_Guest"?'Add':'Update',
			icon: guestArray['todo']=="Add_Guest"?'./images/newguest.png':'./images/edituser.png',
			handler:function(){		

				Ext.getCmp('roomId').enable();
				var formPanel = Ext.getCmp('guestform').getForm();
				// if(guestArray['todo']=="Add_Guest"){
					// if(Ext.getCmp('uploadLater').checked){
					// }else{
					// 
						//remove ; in the address
						Ext.getCmp("address").setValue( Ext.getCmp("address").getValue().replace(/;/g,"") );
						Ext.getCmp("permanentaddress").setValue( Ext.getCmp("permanentaddress").getValue().replace(/;/g,"") );
						Ext.getCmp("localAddress").setValue( Ext.getCmp("localAddress").getValue().replace(/;/g,"") );
						Ext.getCmp("occupationAddress").setValue( Ext.getCmp("occupationAddress").getValue().replace(/;/g,"") );
						Ext.getCmp("lastResidenceAddress").setValue( Ext.getCmp("lastResidenceAddress").getValue().replace(/;/g,"") );
						Ext.getCmp("comments").setValue( Ext.getCmp("comments").getValue().replace(/;/g,"") );

						if(guestArray['todo']=="Edit_Guest"){
							if(Ext.getCmp('vacatingDate').getRawValue() !="" && Ext.getCmp('status').getValue()=='S' ){
								Ext.MessageBox.show({
									title:'Error',
									msg: 'Seems that the guest is vacating. If you set the <b>vacating Date</b>, then you have to set the status as <b>Vacated</b>',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								});					
								return false;
							}						
							if(Ext.getCmp('vacatingDate').getRawValue() =="" && Ext.getCmp('status').getValue()=='V' ){
								Ext.MessageBox.show({
									title:'Error',
									msg: 'Seems that the guest is vacating. If you set the status as <b>Vacated</b>, then you have to set the <b>vacating Date</b> as well',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								});					
								return false;
							}						
						}

						//Check if the photo of the guest is captured
						if(Ext.getCmp('guestuploadPhoto').getValue()=="" && Ext.getCmp('guestPhotoImage').getEl().dom.src.indexOf('nophoto.png') !=-1 ){
							Ext.MessageBox.show({
								title:'Error',
								msg: 'You haven\'t captured the photo of the guest Yet !<br><br><span class="tableTextM">You must capture the photo of the guest before submitting</span>',
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.ERROR
							});					
							return false;
						}
						// else if(Ext.getCmp('guestPhotoImage').getEl().dom.src.indexOf('nophoto.png') !=-1 ){
						// 	Ext.MessageBox.show({
						// 		title:'Error',
						// 		msg: 'You haven\'t captured the photo of the guest Yet !<br><br><span class="tableTextM">You must capture the photo of the guest before submitting</span>',
						// 		buttons: Ext.MessageBox.OK,
						// 		icon: Ext.MessageBox.ERROR
						// 	});					
						// 	return false;
						// }
						if( Ext.getCmp('guestuploadSign').getValue()=="" && Ext.getCmp('guestSignImage').getEl().dom.src.indexOf('nophoto.png') !=-1 ){
							Ext.MessageBox.show({
								title:'Error',
								msg: 'You haven\'t captured the Signature of the guest Yet !<br><br><span class="tableTextM">You must capture the Signature of the guest before submitting</span>',
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.ERROR
							});					
							return false;
						}
						// else if(Ext.getCmp('guestSignImage').getEl().dom.src.indexOf('nophoto.png') !=-1 ){
						// 	Ext.MessageBox.show({
						// 		title:'Error',
						// 		msg: 'You haven\'t captured the Signature of the guest Yet !<br><br><span class="tableTextM">You must capture the Signature of the guest before submitting</span>',
						// 		buttons: Ext.MessageBox.OK,
						// 		icon: Ext.MessageBox.ERROR
						// 	});					
						// 	return false;
						// }	
					
					// }
				// }
				if(formPanel.isValid()){
					Ext.getCmp("guestform").getEl().mask("Saving Guest Details...");
					formPanel.submit({
						clientValidation: true,
						url: 'includes/guests_ajx.php',
						params: {
							todo: guestArray['todo'], 
							guestId:guestArray['guestId'],
							imgSrc:Ext.getCmp('guestPhotoImage').getEl().dom.src,
							imgSignSrc:Ext.getCmp('guestSignImage').getEl().dom.src
						},
						success: function(form, action) {
							Ext.getCmp("guestform").getEl().unmask();
							Ext.Msg.alert('Success', action.result.msg);
							guestWin.destroy();
							Ext.getCmp("guestsGrid").getStore().loadPage(1);
							Ext.getCmp("guestEditButton").disable();
							Ext.getCmp("proofEditButton").disable();
							Ext.getCmp("checkoutBtn").disable();							   
						   //CustomersStore.load({params:{start:0, limit:30}});
						},
						failure: function(form, action) {
							Ext.getCmp("guestform").getEl().unmask();
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
			hidden:guestArray['todo']=="Add_Guest"?false:true,
			icon:'./images/refresh.png',
			handler: function() {
				Ext.getCmp('guestform').getForm().reset();
			}
		},{
			text: 'Close',
			icon: './images/close.png',
			handler: function() {
				guestWin.destroy();
				Ext.getCmp("guestEditButton").disable();	
				Ext.getCmp("proofEditButton").disable();	
				Ext.getCmp("checkoutBtn").disable();	
				Ext.getCmp("guestsGrid").getSelectionModel().deselectAll();
			}
		}]
	    }).show();
		Ext.getCmp('guestName').focus(true,1000);

		if(guestArray['todo']=="Edit_Guest"){
			Ext.getCmp('vacatingDate').show();
			Ext.getCmp('status').show();	
			// Ext.getCmp('uploadLater').hide();		
		}
		else{
			Ext.getCmp('vacatingDate').hide();
			Ext.getCmp('status').hide();
			// Ext.getCmp('uploadLater').show();		
		}
}

/**
 * Manage ID,Address,other proof 
 * @param {array} guestArray [description]
 */
function add_edit_proof(guestArray){
	var proofGuestsWin = Ext.create('Ext.Window', {
		title: guestArray['titleStr']+guestArray[0],
		width:340,
		height:340,
		plain: true,
		modal:true,		
		closable:true,
		layout: {
	    	type: 'fit'
		},
		items: [
			{
				xtype:'form',
				id:'proofGuestsform',
				name:'proofGuestsform',
				frame:true,
                items:[                	
                	{
						xtype: 'filefield',
						fieldLabel:'Upload Proof 1',
						id:'proof1',
						name:'proof1',
						width: 300,
						buttonText: 'Select File...',
						allowBlank:true,
				        listeners:{
				            afterrender:function(cmp){
				              cmp.fileInputEl.set({
				                accept:'image/jpeg' // or w/e type
				              });
				            }
				        }
					},{
						xtype: 'filefield',
						fieldLabel:'Upload Proof 2',
						id:'proof2',
						name:'proof2',
						width: 300,
						buttonText: 'Select File...',
						allowBlank:true,
				        listeners:{
				            afterrender:function(cmp){
				              cmp.fileInputEl.set({
				                accept:'image/jpeg' // or w/e type
				              });
				            }
				        }
					},{
						xtype: 'filefield',
						fieldLabel:'Upload Proof 3',
						id:'proof3',
						name:'proof3',
						width: 300,
						buttonText: 'Select File...',
						allowBlank:true,
				        listeners:{
				            afterrender:function(cmp){
				              cmp.fileInputEl.set({
				                accept:'image/jpeg' // or w/e type
				              });
				            }
				        }
					},{
						xtype: 'filefield',
						fieldLabel:'Upload Proof 4',
						id:'proof4',
						name:'proof4',
						width: 300,
						buttonText: 'Select File...',
						allowBlank:true,
				        listeners:{
				            afterrender:function(cmp){
				              cmp.fileInputEl.set({
				                accept:'image/jpeg' // or w/e type
				              });
				            }
				        }
					},{
						xtype: 'filefield',
						fieldLabel:'Upload Proof 5',
						id:'proof5',
						name:'proof5',
						width: 300,
						buttonText: 'Select File...',
						allowBlank:true,
				        listeners:{
				            afterrender:function(cmp){
				              cmp.fileInputEl.set({
				                accept:'image/jpeg' // or w/e type
				              });
				            }
				        }
					},
					{
                		xtype:'label',
                		cls:'tableTextM',
                		html:'<br/><br/>Note: Upload Jpg format images only',
                	}                        	
                ]				
				
			}


		],
		//roomguestsGrid
		buttons: [
			{
				xtype:'button',
				icon:'./images/view.png',
				text:'View Proofs',
				id:'viewImages',
				name:'viewImages',				
				handler:function(){
					// Ext.Msg.alert("test","test");
					var winHandle = window.open("./viewimages.php?guestId="+guestArray['guestId'],"ViewProofs","width=670,height=480");
					if(winHandle==null){
						Ext.Msg.alert("Error","Error: While Launching New Window...\nYour browser maybe blocking up Popup windows. \n\n  Please check your Popup Blocker Settings");
					}
				}				
			},
			'->',
			{
				text    : 'Upload Selected Files',
				icon    :'./images/upload.png',
				handler : function() {
					var formPanel = Ext.getCmp('proofGuestsform').getForm();
					if(formPanel.isValid()){
						formPanel.submit({
							clientValidation: true,
							url: 'includes/guests_ajx.php',
							params: {
								todo: guestArray['todo'], 
								guestId:guestArray['guestId'],
								guestName:guestArray['guestName']
							},
							success: function(form, action) {
								Ext.Msg.alert('Success', action.result.msg);
								Ext.getCmp('viewImages').enable();
								// proofGuestsWin.destroy();
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
			},
			{
				text: 'Close',
				icon: './images/close.png',
				handler: function() {
					proofGuestsWin.destroy();
				}
			}
		]
	});
	// Check if there are any proofs already uploaded for the selected guest
	proofGuestsWin.on('show', function(proofGuestsWin) {
        Ext.Ajax.request({
            url: './includes/guests_ajx.php',
            method: 'POST',
            params : {
				todo : 'CheckProofExists',
				guestId:guestArray['guestId']
        	},
            success: function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                	Ext.Msg.alert("Info","Already you have uploaded some proofs for this Guest.<br/>Before uploading new Proof, view them first.<br/>If you want to upload new proofs upload to the correct prrof number");
                	Ext.getCmp('viewImages').enable();
                } else {
                    Ext.getCmp('viewImages').disable();
                }
            }
        });	    	
    });

    proofGuestsWin.show();

}

function downloadPdf(guestId){
	Ext.DomHelper.append(document.body, {
	   tag: 'iframe',
	   frameBorder: 0,
	   width: 0,
	   height: 0,
	   css: 'display:none;visibility:hidden;height:1px;',
	   src: './tcpdf/guestpdf.php?todo=Gen_Guest_PDF&guestId='+guestId
   });		
}

function setCheckoutDate(guestArray){
	var checkoutWin = Ext.create('Ext.Window', {
		title: guestArray['titleStr'],
		width:450,
		height:240,
		plain: true,
		modal:true,		
		closable:true,
		layout: {
	    	type: 'fit'
		},
		items: [
			{
				xtype:'form',
				id:'checkoutform',
				name:'checkoutform',
				frame:true,
                items:[                	
                	{
						xtype: 'datefield',
						fieldLabel:'Vacating Date',
						name:'vacatingOn',
						id:'vacatingOn',
						editable:false,
						allowBlank:false,
						blankText:'Please enter the vacating On Date',
						format: 'Y/m/d',
						altFormat:'Y/m/d|Y.m.d',
						minValue:new Date(),	//allow only present and future dates
						// hidden:true,
						listeners:{
							afterrender:function(){
								if(guestArray[16]!="")
									this.setValue(guestArray[16]);
							}
						}
					},
                	{
						xtype: 'datefield',
						fieldLabel:'Advance Date',
						// name:'vacatingDate',
						// id:'vacatingDate',
						editable:false,
						readOnly:true,
						// allowBlank:false,
						format: 'Y/m/d',
						altFormat:'Y/m/d|Y.m.d',
						listeners:{
							afterrender:function(){
								if(guestArray[1]!="")
									this.setValue(guestArray[1]);
							}
						}
					},
					{
						xtype: 'numberfield',
						minValue:1,
						hideTrigger: true,
						keyNavEnabled: false,
						mouseWheelEnabled: false,
						readonly:true,
						editable:false,
						fieldLabel:'Advance Amount',
						// name:'advanceAmount',
						// id:'advanceAmount',
						allowBlank:true,
						listeners:{
							afterrender:function(){
								if(guestArray[2]!="")
									this.setValue(guestArray[2]);
							}
						}
					},
					{
						xtype: 'textarea',
						fieldLabel:'Comments',
						name:'comments',
						id:'comments',
						width:350,
						allowBlank:true,
						listeners:{
							afterrender:function(){
								if(guestArray[3]!="")
									this.setValue(guestArray[3]);
							}
						}
					},
					{
                		xtype:'label',
                		cls:'tableTextM',
                		html:'<br/><br/>Note: This is to mark the vacating Date only. Not the actual checkout'
                	}                       	
                ]				
				
			}


		],
		buttons: [
			{
				xtype:'button',
				icon:'./images/save.png',
				text:'Save',
				id:'saveCheckoutBtn',
				name:'saveCheckoutBtn',				
				handler:function(){
					var formPanel = Ext.getCmp('checkoutform').getForm();
					if(formPanel.isValid()){
						formPanel.submit({
							clientValidation: true,
							url: 'includes/guests_ajx.php',
							params: {
								todo: guestArray['todo'], //setCheckoutDate
								guestId:guestArray['guestId'],
								guestName:guestArray['guestName']
							},
							success: function(form, action) {
								Ext.Msg.alert('Success', action.result.msg);
								checkoutWin.destroy();
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
			},			
			{
				text: 'Close',
				icon: './images/close.png',
				handler: function() {
					checkoutWin.destroy();
				}
			}
		]
	});


    checkoutWin.show();

}