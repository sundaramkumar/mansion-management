/*********
 * Billing.js
 * --------------
 *
 * Todo
 *		Validations
 *		Rent Collection Details - From - to Date Total collected from, Total Pending From, Total amount collected , Total No of Guests
 *  	collected from  - List of all Guests who have paid for the selected Month
 *  	pending from 	- List of all Guests who haven't paid for the selected Month
 *  	analysis total guests vs total rent collected every month over a selected period
 *
 *
 *
 **/

function showRentReports(){
	var lrtMap, lrtRen, lrtSer;
	if(Ext.getCmp("rentReportsGrid")){
		Ext.getCmp("SAdminPanelRentReports").setActiveTab("rentReportsGrid");
		return false;
	}
	
	Ext.define('rentReportsdata', {
		extend: 'Ext.data.Model',
			fields: [
				{name: 'receiptId',mapping: 'receiptId',type:'int'},
				{name: 'receiptNo',mapping: 'receiptNo',type:'string'},
				{name: 'billDate',mapping: 'billDate', type: 'string'},
				{name: 'getGuestName',mapping: 'getGuestName', type: 'string'},
				{name: 'month',mapping: 'month', type: 'string'},
				{name: 'amount',mapping: 'amount', type: 'string'},
				{name: 'addedBy',mapping: 'addedBy', type: 'string'},
				{name: 'addedOn',mapping: 'addedOn', type: 'string'}
		    ],
		idvehicle: 'receiptId'
	});

	var rentReportsStore = Ext.create('Ext.data.JsonStore', {
        id: 'rentReportsStore',
        model: 'rentReportsdata',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/billing_ajx.php',
            extraParams: {
				todo : 'Get_bills_List'
            },
            reader: {
				type: 'json',
                root: 'BILLS',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'addedOn',
            direction: 'DESC'
        }]
    });

	var rentReportscol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "ReceiptId", dataIndex: 'receiptId', width:40, sortable: false,hidden:true},
		{text: "Receipt No", dataIndex: 'receiptNo', width:120, sortable: false,},
		{text: "Due Date", dataIndex: 'billDate', width:120, sortable: true,align:'center'},
		{text: "Guest", dataIndex: 'getGuestName', width:100, sortable: true,align:'left'},
		{text: "Month", dataIndex: 'month',  width:100, sortable: false,align:'center'},
		{text: "Amount  &#8377;", dataIndex: 'amount',  width:100, sortable: false,align:'right',
        	renderer:setFloat,summaryType:'sum',
        	summaryRenderer:function(v){
        		if(v!="" || v!=0)
        			return "<b>"+v.toFixed(2)+"</b>";
        		else
        			return v;
        	}
        },
		{text: "Bill by", dataIndex: 'addedBy',  width:100, sortable: false,align:'center'},
		{text: "Bill Date", dataIndex: 'addedOn',  width:100, sortable: false,align:'center'}
	];	

	
	var years = [];
	y = 2013;
	while (y <= new Date().getFullYear()){
	     years.push([y]);
	     y++;
	}

	var yearStore = new Ext.data.SimpleStore
	({
	      fields : ['years'],
	      data : years
	})
		

	var monthsStore = Ext.create('Ext.data.ArrayStore', {
	    fields: ['months'],
	    data : [
					["January"],
					["February"],
					["March"],
					["April"],
					["May"],
					["June"],
					["July"],
					["August"],
					["September"],
					["October"],
					["November"],
					["December"]
				]
	});


	function onItemClick(item){
		var menu_id   = item.id;
		var searchFor ="";
		var todo = "";


		if(menu_id=="viewPaid"  || menu_id=="excelPaid"){
			searchFor = "Paid";
			todo = "Paid";
		}
		if(menu_id=="viewPending"  || menu_id=="excelPending"){
			searchFor = "Pending";
			todo = "Pending";
		}
		var paidmonth = Ext.getCmp("paidmonth").getValue();
		var paidyear   = Ext.getCmp("paidyear").getValue();
		
		if(paidmonth=="" || paidmonth == null){
			Ext.Msg.alert("INFO","Please select the Month");
			Ext.getCmp("paidmonth").focus(true,1000);
			return false;
		}

		if(paidyear=="" || paidyear == null){
			Ext.Msg.alert("INFO","Please select the Year");
			Ext.getCmp("paidyear").focus(true,1000);
			return false;
		}

		var month = paidmonth.substring(0,3) + " " + paidyear;

		if(menu_id.indexOf("view")!=-1) {
			if(todo == "Pending"){
				showRentPendingDetails('PendingList',searchFor,month)
				// rentReportsStore.baseParams = {todo:'PendingList',searchFor:searchFor,month:month, start:0, limit:30};
				// rentReportsStore.load({params:{todo:'PendingList',searchFor:searchFor,month:month, start:0, limit:30}});
			}else{
				rentReportsStore.baseParams = {todo:'Get_bills_List',searchFor:searchFor,month:month, start:0, limit:30};
				rentReportsStore.load({params:{todo:'Get_bills_List',searchFor:searchFor,month:month, start:0, limit:30}});
			}
		}
		if(menu_id.indexOf("excel")!=-1) {
			Ext.DomHelper.append(document.body, {
				   tag: 'iframe',
				   frameBorder: 0,
				   width: 0,
				   height: 0,
				   css: 'display:none;visibility:hidden;height:1px;',
				   src: 'includes/billing_ajx.php?todo=GenXL_'+todo+'GuestsList&searchFor='+searchFor+'&month='+month
		   });			
		}
	}

	var loadTabPanel = Ext.getCmp('SAdminPanelRentReports');
	loadTabPanel.add({
		id:'rentReportsGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:rentReportsStore,
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
		columns: rentReportscol,
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		tbar:[
			{
				xtype: 'datefield',
				fieldLabel:'From Date',
				name:'rentfromDate',
				id:'rentfromDate',
				labelSeparator:'',
				labelWidth:60,
				width:180,
				editable:false,
				labelAlign: 'right',
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
				name:'renttoDate',
				id:'renttoDate',
				format: 'Y/m/d',
				altFormat:'Y/m/d|Y.m.d',
				listeners:{
					afterrender:function(){
					}
				}
			},
            {
            	xtype:'button',
            	text:'Rent Collection Details',            	
            	icon: './images/collected.png',
				cls: 'x-btn-bigicon',
            	qtip:"Generate Reports based on Room Status",
            	handler:function(){
					var startdate = Ext.getCmp("rentfromDate").getValue();
					var enddate   = Ext.getCmp("renttoDate").getValue();

					if(startdate=="" || startdate == null){
						Ext.Msg.alert("INFO","Please select the Start Date");
						return false;
					}

					if(enddate=="" || enddate == null){
						Ext.Msg.alert("INFO","Please select the End Date");
						return false;
					}

					startdate	= Ext.util.Format.date(startdate, "Y-m-d");
					enddate		= Ext.util.Format.date(enddate, "Y-m-d");      

					showRentCollectionDetails(startdate,enddate);      		
            	}					
            },
            '-',	
			'->',
			{
				xtype: 'combo',
				fieldLabel: 'Month',
				grow:false,
				id:'paidmonth',
				name:'paidmonth',
				labelSeparator:'',
				labelAlign: 'right',
				labelWidth:50,
				width:140,
				store: monthsStore,
				editable:false,				
				allowBlank:false,
				blankText:'Select the month',
				queryMode: 'local',
				displayField: 'months'
			},
			{
				xtype: 'combo',
				fieldLabel: 'Year',
				grow:false,
				id:'paidyear',
				name:'paidyear',
				labelSeparator:'',
				labelAlign: 'right',
				labelWidth:50,
				width:120,				
				store: yearStore,
				editable:false,
				allowBlank:false,
				blankText:'Select the Year',
				queryMode: 'local',
				displayField: 'years'				
			},
            {
            	xtype:'button',
            	text:'Rent Paid',            	
            	icon: './images/collected.png',
				cls: 'x-btn-bigicon',
            	qtip:"Generate Reports based on Rent Paid",
				menuAlign:'bl',
				menu: [
					{text: 'View', icon:'./images/view.png', floating: false, handler: onItemClick, id:'viewPaid'},
					{text: 'Generate Excel',icon:'./images/excel.png', floating: false, handler: onItemClick, id:'excelPaid'}
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
            	text:'Rent Pending',            	
            	icon: './images/pending.png',
				cls: 'x-btn-bigicon',
            	qtip:"Generate Reports based on Rent Pending",
				menuAlign:'bl',
				menu: [
					{text: 'View', icon:'./images/view.png', floating: false, handler: onItemClick, id:'viewPending'},
					{text: 'Generate Excel',icon:'./images/excel.png', floating: false, handler: onItemClick, id:'excelPending'}
				]	
						// listeners:{activate:function(item){
						// 							console.log(item.id);
						// 							if(version =='B') {
						// 								Ext.getCmp(item.id).disable();
						// 							}
						// 						}}					
            }
		],
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'rentReportsGridPbar',
			store: rentReportsStore,
			dock: 'bottom',
			pageSize: 100,
			displayInfo: true,
			listeners: {
			    afterrender : function() {
			    	//hide the refresh button in the bbar
			        this.child('#refresh').hide();
			    }
			}
		}],
		listeners:{
			'selectionchange':function(selmod, record, opt){
				try{
					if(record[0].get("receiptId")!=0){
						// Ext.getCmp("roomEditButton").enable();
						// Ext.getCmp("roomDeleteButton").enable();
						// Ext.getCmp("viewGuestsButton").enable();						
					}
				}
				catch (e){
				}
			},
			afterrender:function(){
				Ext.getCmp("rentReportsGrid").getEl().mask("Loading Receipts...");
				var d = new Date();
				var month = d.getShortMonthName() + " " + d.getFullYear();

				Ext.getCmp("paidmonth").setValue(d.getMonthName());
				Ext.getCmp("paidyear").setValue(d.getFullYear());

				rentReportsStore.baseParams = {searchFor:"Paid",month:month, start:0, limit:30};
				rentReportsStore.load({
					params:{
						searchFor:"Paid",
						month:month, 
						start:0, 
						limit:30
					},
					callback: function() {
						Ext.getCmp("rentReportsGrid").getEl().unmask();
					}
				});						
				// rentReportsStore.load({
				// 	callback: function() {
				// 		Ext.getCmp("rentReportsGrid").getEl().unmask();
				// 	}
				// });
			}

		}
    }).show();
	loadTabPanel.doLayout();
}

/**
 * Show details on the rent 
 * 		Total collected from, 
 * 		Total Pending From, 
 * 		Total amount collected , 
 * 		Total No of Guests
 * 		
 * @param  {date} startdate [description]
 * @param  {date} enddate   [description]
 *  
 */
function showRentCollectionDetails(startdate,enddate){
	var rentCollectionDetailsform = {
		xtype:'form',
		id:'rentCollectionDetailsform',
		name:'rentCollectionDetailsform',
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
					xtype:'textfield',
					fieldLabel: 'Collected From',
					name: 'collectedFrom',
					id: 'collectedFrom',
					readOnly:true,
					anchor:'90%'
				},
				{
					xtype:'textfield',
					fieldLabel: 'Pending From',
					name: 'pendingFrom',
					id: 'pendingFrom',
					readOnly:true,
					anchor:'90%'
				},
				{
					xtype:'textfield',
					fieldLabel: 'Total No of Guests',
					name: 'noOfGuests',
					id: 'noOfGuests',
					readOnly:true,
					anchor:'90%'
				},
				{
					xtype:'textfield',
					fieldLabel: 'Amount &#8377;',
					name: 'totalCollectedamount',
					id: 'totalCollectedamount',
					readOnly:true,
					anchor:'90%'
				}							
		]
	}	
	var rentCollectionWin = Ext.create('Ext.Window', {
		title: "Rent Collection Details",
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
		items: [rentCollectionDetailsform],
		buttons: [{
			text: 'Close',
			handler: function() {
				rentCollectionWin.destroy();
			}
		}]
	});
		// debugger;
	rentCollectionWin.on('show', function(rentCollectionWin) {
        Ext.Ajax.request({
            url: './includes/billing_ajx.php',
            method: 'POST',
            params : {
				todo : 'Get_RentCollection_Details',
				startdate:startdate,
				enddate:enddate
        	},
            success: function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                	// $noOfPaid."|*|".$pendingFrom."|*|".$guestCnt."|*|".$collectionAmount;
                	var msgAry = result.msg.split("|*|");
                	Ext.getCmp('collectedFrom').setValue(msgAry[0]);
                	Ext.getCmp('pendingFrom').setValue(msgAry[1]);
                	Ext.getCmp('noOfGuests').setValue(msgAry[2]);
                	Ext.getCmp('totalCollectedamount').setValue(msgAry[3]);
                } else {
                    Ext.Msg.alert(result.msg);
					Ext.MessageBox.show({
					   msg: result.msg,
					   title: result.title,
					   icon:Ext.MessageBox.ERROR,
					   buttons: Ext.MessageBox.OK
					});	                    
                }
            }
        });	    	
    });
    rentCollectionWin.show();
	

}

/**
 * Show all guests who haven't yet paid the rent for the selected month
 * 
 * @param  {string} todo      [description]
 * @param  {string} searchFor [description]
 * @param  {string} month     [description]
 * 
 */
function showRentPendingDetails(todo,searchFor,month){
	if(todo!="PendingList")
		return false;



	Ext.define('rentReportsguestsData', {
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
				{name: 'comments',mapping: 'comments', type: 'string'}
		    ],
		idvehicle: 'guestId'
	});

	var rentReportsguestsStore = Ext.create('Ext.data.JsonStore', {
        id: 'rentReportsguestsStore',
        model: 'rentReportsguestsData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/billing_ajx.php',
            extraParams: {
				todo      : todo, 
				month     : month,
				searchFor :searchFor
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

	var rentReportsGuestscol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "guest Id", dataIndex: 'guestId', width:40, sortable: false,hidden:true},
		{text: "Guest Name", dataIndex: 'guestName', width:120, sortable: true,},
		{text: "roomNo", dataIndex: 'roomNo',  width:100, sortable: true,align:'center'},
		{text: "mobile", dataIndex: 'mobile',  width:100, sortable: false,align:'left'},
		{text: "Occupation", dataIndex: 'occupation',  width:100, sortable: false,align:'center'},
		{text: "Occupation Phone", dataIndex: 'occupationPhone',  width:100, sortable: false,align:'center'},
		{text: "Joining Date", dataIndex: 'joiningDate',  width:100, sortable: true,align:'center'},
		{text: "Reason Of Stay", dataIndex: 'reasonOfStay',  width:100, sortable: true,align:'center'},
		{text: "Vehicle No", dataIndex: 'vehicleNo',  width:100, sortable: false,align:'left'},
		{text: "Status", dataIndex: 'status',  width:100, sortable: true,align:'center'}
	];	

	var photoPanel = new Ext.panel.Panel({
		title:'Guest Photo',
		width:320,
		height:240,
		items:[
		{
			xtype:'image',
			width:320,
			height:240,
			id:'guestPhotoImage',
			src:'./images/nophoto.png',
			listeners:{
				afterrender:function(){
					// var guestPhoto = './guestsPhotos/'+guestArray['guestId']+'_'+guestArray[0]+'_photo.png';
					// var noPhoto = './images/nophoto.png';
					// //load the photo saved earlier
					// var randomNum = Math.round(Math.random() * 10000);
					// var oImg=new Image;
					// oImg.src=guestPhoto; //+"?rand="+randomNum;
					// oImg.onload=function(){
					// 	Ext.getCmp('guestPhotoImage').getEl().dom.src=oImg.src;
					// }
					// oImg.onerror=function(){
					// 	Ext.getCmp('guestPhotoImage').getEl().dom.src=noPhoto;
					// }									
				}
			}
		}]

	})

	var rentReportsguestsGrid = new Ext.grid.GridPanel({
		id:'rentReportsguestsGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		height:380,
		autoScroll:true,
		loadMask: true,
		border:true,
		bodyBorder:true,
		store:rentReportsguestsStore,
		tools:[{
			itemId: 'dashrefresh',
			type: 'refresh',
			tooltip:'Refresh Guests List',
			handler: function(){
				Ext.getCmp("rentReportsguestsGrid").getEl().mask("Loading Guests...");
				rentReportsguestsStore.load({
					callback: function() {
						Ext.getCmp("rentReportsguestsGrid").getEl().unmask();
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
						guestId = record[0].get("guestId");
						guestName = record[0].get("guestName");

						var guestPhoto = './guestsPhotos/'+guestId+'_'+guestName+'_photo.png';
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
					}
				}
			}
		},
		viewConfig: {
			forceFit:true,
			stripeRows: true,
			emptyText:"<span class='tableTextM'>No Records Found</span>"
		},
		columns: rentReportsGuestscol,
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		listeners:{
			afterrender:function(){
				Ext.getCmp("rentReportsguestsGrid").getEl().mask("Loading Guests...");
				rentReportsguestsStore.load({
					callback: function() {
						Ext.getCmp("rentReportsguestsGrid").getEl().unmask();
					}
				});
			}

		},
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'rentReportsguestsGridPbar',
			store: rentReportsguestsStore,
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

	var rentReportsGuestsWin = Ext.create('Ext.Window', {
		title    : "View Guests Not paid Rent for "+month,
		width    :1300,
		height   :440,
		plain    : true,
		modal    :true,
		closable :true,
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
								columnWidth :.76,
								//layout    : 'fit',
								bodyStyle   :'background-color:#f7f7f7;padding-right:1px',
								border      :false,
								items       : [rentReportsguestsGrid]
		                    },
		                    {
								columnWidth :.24,
								//layout    : 'fit',
								bodyStyle   :'background-color:#f7f7f7;padding-right:1px',
								border      :false,
								items       : [photoPanel]	
		                    }
	                    ]
	        }
		],
		//roomguestsGrid
		buttons: [
		{
			text    : 'Generate Excel',            	
			icon    : './images/excel.png',
			cls     : 'x-btn-bigicon',
			handler : function() {
				var paidmonth = Ext.getCmp("paidmonth").getValue();
				var paidyear   = Ext.getCmp("paidyear").getValue();

				var searchFor = "Pending";
				var todo = "Pending";

				var month = paidmonth.substring(0,3) + " " + paidyear;

				Ext.DomHelper.append(document.body, {
						tag         : 'iframe',
						frameBorder : 0,
						width       : 0,
						height      : 0,
						css         : 'display:none;visibility:hidden;height:1px;',
						src         : 'includes/billing_ajx.php?todo=GenXL_'+todo+'GuestsList&searchFor='+searchFor+'&month='+month
			   });			
			}
		},
		{
			text    : 'Close',
			handler : function() {
				rentReportsGuestsWin.destroy();
			}
		}		
		]
	}).show();


}

