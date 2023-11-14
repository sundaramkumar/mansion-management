/**
 * guestreports.js
 *
 * Reports on Guests for the following
 * 
 *		vacated guests list in a date range	-	done
 *  	staying guests list in a date range	-	done
 *   	new guests list in  date range	-	done
 *   	list based on reasonofstaying - not required
 *   	Police report generation - todo
 * 
 */
function showGuestReports(){
	var lrtMap, lrtRen, lrtSer;
	if(Ext.getCmp("guestReportsGrid")){
		Ext.getCmp("SAdminPanelGuestReports").setActiveTab("guestReportsGrid");
		return false;
	}

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
				["V","Vacated"],
				["N","Newly Joined"]
			]
	});

	Ext.define('guestReportsData', {
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

	var guestReportsStore = Ext.create('Ext.data.JsonStore', {
        id: 'guestReportsStore',
        model: 'guestReportsData',
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

	var GuestReportscol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "guest Id", dataIndex: 'guestId', width:40, sortable: false,hidden:true},
		{text: "Guest Name", dataIndex: 'guestName', width:120, sortable: true,},
		{text: "roomNo", dataIndex: 'roomNo',  width:80, sortable: true,align:'center'},
		{text: "mobile", dataIndex: 'mobile',  width:100, sortable: false,align:'left'},
		{text: "Occupation", dataIndex: 'occupation',  width:100, sortable: false,align:'left'},
		{text: "Occupation Phone", dataIndex: 'occupationPhone',  width:100, sortable: false,align:'center'},
		{text: "Joining Date", dataIndex: 'joiningDate',  width:100, sortable: true,align:'center'},
		{text: "Vacated Date", dataIndex: 'vacatingDate',  width:100, sortable: true,align:'center'},
		{text: "Reason Of Stay", dataIndex: 'reasonOfStay',  width:100, sortable: true,align:'center'},
		{text: "Vehicle No", dataIndex: 'vehicleNo',  width:100, sortable: false,align:'left'},
		{text: "Status", dataIndex: 'status',  width:90, sortable: true,align:'center'},
		{text: "Photo", dataIndex: 'viewphoto',  width:100, sortable: true,align:'center'}
	];	
	
	function onItemClick(item){
		var menu_id   = item.id;
		var startdate = Ext.getCmp("fromDate").getValue();
		var enddate   = Ext.getCmp("toDate").getValue();
		var searchFor ="";

		if(startdate=="" || startdate == null){
			Ext.Msg.alert("INFO","Please select the Start Date");
			return false;
		}

		if(enddate=="" || enddate == null){
			Ext.Msg.alert("INFO","Please select the End Date");
			return false;
		}

		startdate	= Ext.util.Format.date(startdate, "Y-m-d H:i:s");
		enddate		= Ext.util.Format.date(enddate, "Y-m-d H:i:s");

		if(menu_id=="viewVacated"  || menu_id=="excelVacated"){
			searchFor = "Vacated";
		}
		if(menu_id=="viewNew"  || menu_id=="excelNew"){
			searchFor = "New";
		}
		if(menu_id=="viewStaying"  || menu_id=="excelStaying"){
			searchFor = "Staying";
		}

		if(menu_id.indexOf("view")!=-1) {
			guestReportsStore.baseParams = {searchFor:searchFor,startdate:startdate,enddate:enddate, start:0, limit:30};
			guestReportsStore.load({params:{searchFor:searchFor,startdate:startdate,enddate:enddate, start:0, limit:30}});
		}
		if(menu_id.indexOf("excel")!=-1) {
			Ext.DomHelper.append(document.body, {
				   tag: 'iframe',
				   frameBorder: 0,
				   width: 0,
				   height: 0,
				   css: 'display:none;visibility:hidden;height:1px;',
				   src: 'includes/guests_ajx.php?todo=GenXL_GuestsList&searchFor='+searchFor+'&startdate='+startdate+'&enddate='+enddate
		   });			
		}
	}

	var loadTabPanel = Ext.getCmp('SAdminPanelGuestReports');
	loadTabPanel.add({
		id:'guestReportsGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:guestReportsStore,
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
		columns: GuestReportscol,
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		tbar:[
			{
				xtype: 'datefield',
				fieldLabel:'From Date',
				name:'fromDate',
				id:'fromDate',
				labelSeparator:'',
				labelWidth:60,
				width:180,
				labelAlign: 'right',
				editable:false,
				// labelStyle: 'width: auto',				
				format: 'Y/m/d',
				altFormat:'Y/m/d|Y.m.d',
				listeners:{
					afterrender:function(){
					}
				}
			},
			{
				xtype: 'datefield',
				fieldLabel:'To Date',
				labelSeparator:'',
				labelWidth:60,
				width:180,
				labelAlign: 'right',
				editable:false,
				// labelStyle: 'width: auto',					
				name:'toDate',
				id:'toDate',
				format: 'Y/m/d',
				altFormat:'Y/m/d|Y.m.d',
				listeners:{
					afterrender:function(){
					}
				}
			},	
			'-',
            {
            	xtype:'button',
            	text:'Vacated Guests',            	
            	icon: './images/vacated.png',
				cls: 'x-btn-bigicon',
            	qtip:"Generate Reports based on Room Status",
				menuAlign:'bl',
				menu: [
					{text: 'View', icon:'./images/view.png', floating: false, handler: onItemClick, id:'viewVacated'},
					{text: 'Generate Excel',icon:'./images/excel.png', floating: false, handler: onItemClick, id:'excelVacated'}
				]	
						// listeners:{activate:function(item){
						// 							console.log(item.id);
						// 							if(version =='B') {
						// 								Ext.getCmp(item.id).disable();
						// 							}
						// 						}}					
            },
            '-',
            {
            	xtype:'button',
            	text:'Staying Guests',            	
            	icon: './images/staying.png',
				cls: 'x-btn-bigicon',
            	qtip:"Generate Reports based on Room Status",
				menuAlign:'bl',
				menu: [
					{text: 'View', icon:'./images/view.png', floating: false, handler: onItemClick, id:'viewStaying'},
					{text: 'Generate Excel',icon:'./images/excel.png', floating: false, handler: onItemClick, id:'excelStaying'}
				]	
						// listeners:{activate:function(item){
						// 							console.log(item.id);
						// 							if(version =='B') {
						// 								Ext.getCmp(item.id).disable();
						// 							}
						// 						}}					
            },
            '-',
            {
            	xtype:'button',
            	text:'New Guests',            	
            	icon: './images/newguest.png',
				cls: 'x-btn-bigicon',
            	qtip:"Generate Reports based on Room Status",
				menuAlign:'bl',
				menu: [
					{text: 'View', icon:'./images/view.png', floating: false, handler: onItemClick, id:'viewNew'},
					{text: 'Generate Excel',icon:'./images/excel.png', floating: false, handler: onItemClick, id:'excelNew'}
				]	
						// listeners:{activate:function(item){
						// 							console.log(item.id);
						// 							if(version =='B') {
						// 								Ext.getCmp(item.id).disable();
						// 							}
						// 						}}					
            },
            '-',                        				
            '->',
            '-',
            {
            	xtype:'button',
            	text:'Generate Report for Police',            	
            	icon: './images/police.png',
				cls: 'x-btn-bigicon',
            	qtip:"Generate Reports based on Room Status",
            	handler:function(){
            		showPoliceRepoForm();
            	}            	
            }		
		],
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'guestReportsGridPbar',
			store: guestReportsStore,
			dock: 'bottom',
			pageSize: 100,
			displayInfo: true
		}],
		listeners:{
			'selectionchange':function(selmod, record, opt){
				try{
					if(record[0].get("guestId")!=0){
						Ext.getCmp("guestEditButton").enable();
						// Ext.getCmp("roomDeleteButton").enable();
						// Ext.getCmp("viewGuestsButton").enable();						
					}
				}
				catch (e){
				}
			},
			afterrender:function(){
				Ext.getCmp("guestReportsGrid").getEl().mask("Loading Guests List...");
				guestReportsStore.load({
					callback: function() {
						Ext.getCmp("guestReportsGrid").getEl().unmask();
					}
				});
			}

		}
    }).show();
	loadTabPanel.doLayout();
}


function showPoliceRepoForm(){
	var policeRepoform = {
		xtype:'form',
		id:'policeRepoform',
		name:'policeRepoform',
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
					xtype: 'checkboxfield',
					boxLabel  :'Include Proof documents in the PDF',
					fieldLabel:' ',
					name:'includeProofs',
					id:'includeProofs'
				}											
		]
	}	
	var policeRepoWin = Ext.create('Ext.Window', {
		title: "Generate Report for Police Submission",
		width:400,
		height:200,
		plain: true,
		modal:true,
		closable:true,
		border: false,
		layout: {
	        type: 'fit'
		},
		items: [policeRepoform],
		buttons: [{
			text: 'Generate Now',
			handler: function() {		
				var formPanel = Ext.getCmp('policeRepoform').getForm();	
				var includeProofs="";
				if(Ext.getCmp('includeProofs').checked)
					includeProofs = "Y";
				else 
					includeProofs = "N";

				// console.log(includeProofs);
				if(formPanel.isValid()){
					// console.log(includeProofs);
					policeRepoWin.destroy();
					Ext.getCmp("guestReportsGrid").getEl().mask("Generating Report for Police Submission.<br/><b class='tableTextM'>As the size of the data will be big, this will take sometime. Pl be patient</b><br/><br/><b>If you are waiting for more time...Make sure if any of the files are opened. Pls close them.</b><br/><b>then reload the page by pressing F5 key</b><br/><br/><b class='tableTextM'>If still the problem persists, Call support</b>");
					formPanel.submit({
						clientValidation: true,
						url: './tcpdf/policerepogen.php',
						method: 'POST',
			            params : {
							todo : 'Gen_Police_Report',
							includeProofs: includeProofs
			        	},
						success: function(form, action) {
							Ext.getCmp("guestReportsGrid").getEl().unmask();
							Ext.Msg.alert('Success', action.result.msg);
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
		}]
	});
    policeRepoWin.show();
	

}