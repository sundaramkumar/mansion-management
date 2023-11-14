/*********
 * Billing.js
 * --------------
 *
 * Todo
 *		Validations
 *
 *
 *
 *
 **/

function showBilling(){
	var lrtMap, lrtRen, lrtSer;
	if(Ext.getCmp("billingGrid")){
		Ext.getCmp("SAdminPanelBilling").setActiveTab("billingGrid");
		return false;
	}
	
	Ext.define('billingdata', {
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

	var billingStore = Ext.create('Ext.data.JsonStore', {
        id: 'billingStore',
        model: 'billingdata',
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

	var Billingcol	= [	Ext.create('Ext.grid.RowNumberer'),
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
	
	
	var loadTabPanel = Ext.getCmp('SAdminPanelBilling');
	loadTabPanel.add({
		id:'billingGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:billingStore,
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
		columns: Billingcol,
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		tbar:[
			{
				xtype:'buttongroup',
				items: [
				{
					text:'Add New Receipt',
					scale: 'small',
					icon: './images/table_add.png',
					cls: 'x-btn-bigicon',				
					handler:function(){
						var billingArray 			= new Array();
						billingArray["todo"]		= "Add_Receipt";
						billingArray["titleStr"]	= "Add New Receipt";
						billingArray['receiptId'] = 0;

						for(var i=0;i<=3;i++){
							billingArray[i]="";
						}
						add_edit_bill(billingArray);
					}				
				}
				]
			},
			'-',
			{
				xtype:'button',
            	// cls: 'x-btn-bigicon search',
            	icon: './images/view1.png',
				cls: 'x-btn-bigicon',
            	text:'View Payments',
            	handler:function(){
            		var billingArray 			= new Array();
            		billingArray["todo"]		= "View_Receipt";
            		add_edit_bill(billingArray);
            	}
			},
			'->',
			'-',
            {
                xtype:'textfield',
                id:'searchReceipt',
                name:'searchReceipt',
                emptyText:'Receipt No|Month',
                width:150
            },
            {
            	xtype:'button',
            	// cls: 'x-btn-bigicon search',
            	icon: './images/search.png',
				cls: 'x-btn-bigicon',
            	text:'Search',
            	handler:function(){
					var searchFor	= Ext.getCmp("searchReceipt").getRawValue();
					billingStore.baseParams = {filterText:searchFor, start:0, limit:30};
					billingStore.load({params:{filterText:searchFor, start:0, limit:30}});
            	}
            }

		],
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'billingGridPbar',
			store: billingStore,
			dock: 'bottom',
			pageSize: 100,
			displayInfo: true
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
				Ext.getCmp("billingGrid").getEl().mask("Loading Receipts...");
				billingStore.load({
					callback: function() {
						Ext.getCmp("billingGrid").getEl().unmask();
					}
				});
			}

		}
    }).show();
	loadTabPanel.doLayout();
}



function add_edit_bill(billingArray){
	var selectedGuestId = -1;
	var selectedguestName = "";
	var selectedguestRoomNo = "";

	Ext.define('billingGuestsData', {
		extend: 'Ext.data.Model',
			fields: [
				{name: 'guestId',mapping: 'guestId',type:'int'},
				{name: 'guestName',mapping: 'guestName',type:'string'},
				{name: 'nativePhone',mapping: 'nativePhone', type: 'string'},
				{name: 'localPhone',mapping: 'localPhone', type: 'string'},
				{name: 'occupationPhone',mapping: 'occupationPhone', type: 'string'},
				{name: 'mobile',mapping: 'mobile', type: 'string'},
				{name: 'roomNo',mapping: 'roomNo', type: 'string'}
		    ],
		idvehicle: 'guestId'
	});

	var billingGuestsStore = Ext.create('Ext.data.JsonStore', {
        id: 'billingGuestsStore',
        model: 'billingGuestsData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/guests_ajx.php',
            extraParams: {
				todo : 'Get_Guests_List',
				// filterRoom:roomId
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

	var billingGuestscol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "guest Id", dataIndex: 'guestId', width:40, sortable: false,hidden:true},
		{text: "Guest Name", dataIndex: 'guestName', width:120, sortable: true,},
		{text: "roomNo", dataIndex: 'roomNo',  width:80, sortable: true,align:'center'},
		{text: "Native Phone", dataIndex: 'nativePhone',  width:100, sortable: false,align:'left'},
		{text: "mobile", dataIndex: 'mobile',  width:100, sortable: false,align:'left'},
		{text: "Local Phone", dataIndex: 'localPhone',  width:100, sortable: false,align:'left'},
		{text: "Occupation Phone", dataIndex: 'occupationPhone',  width:100, sortable: false,align:'center'}
	];	

	var billingGuestsGrid = new Ext.grid.GridPanel({
		id:'billingGuestsGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		height:260,
		store:billingGuestsStore,
		tbar:[
            {
                xtype:'textfield',
                id:'searchFor',
                name:'searchFor',
                emptyText:'Enter name|phone',
                width:150
            },
            {
            	xtype:'button',
            	// cls: 'x-btn-bigicon search',
            	icon: './images/search.png',
				cls: 'x-btn-bigicon',
            	text:'Search',
            	handler:function(){
					var searchFor	= Ext.getCmp("searchFor").getRawValue();
					billingGuestsStore.baseParams = {filterText:searchFor, start:0, limit:30};
					billingGuestsStore.load({params:{filterText:searchFor, start:0, limit:30}});
					//reset the receipt form	
					Ext.getCmp('billingform').getForm().reset();
            	}
            }
		],
		selModel: {
			selType: 'rowmodel',
			mode : 'SINGLE',
			listeners:{
				'selectionchange':function(selmod, record, opt){
					try{
						guestId = record[0].get("guestId");
						selectedGuestId = guestId;
						selectedguestName = record[0].get("guestName");
						selectedguestRoomNo = record[0].get("roomNo");

						Ext.getCmp('guestId').setValue(selectedGuestId);
						Ext.getCmp('guestName').setValue(selectedguestName);

						if(guestId!=0){	
							paymentsStore.baseParams = {guestId:guestId, start:0, limit:30};
							Ext.getCmp("paymentsGrid").setTitle("Payment History of "+selectedguestName)
							Ext.getCmp("paymentsGrid").getEl().mask("Loading Receipts...");
							paymentsStore.load({
								params:{guestId:guestId, start:0, limit:30},
								callback: function() {
									Ext.getCmp("paymentsGrid").getEl().unmask();
								}
							});
						}
					}
					catch (e){
					}
				}				
			}
		},
		viewConfig: {
			forceFit:true,
			stripeRows: true,
			emptyText:"<span class='tableTextM'>No Records Found</span>"
		},
		columns: billingGuestscol,
		border:true,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		listeners:{
			// afterrender:function(){
			// 	Ext.getCmp("billingGuestsGrid").getEl().mask("Searching Guests...");
			// 	billingGuestsStore.load({
			// 		callback: function() {
			// 			Ext.getCmp("billingGuestsGrid").getEl().unmask();
			// 		}
			// 	});
			// }
		}				
	});

	/***********************************/

	Ext.define('paymentsdata', {
		extend: 'Ext.data.Model',
			fields: [
				{name: 'receiptId',mapping: 'receiptId',type:'int'},
				{name: 'receiptNo',mapping: 'receiptNo',type:'string'},
				{name: 'billDate',mapping: 'billDate', type: 'string'},
				{name: 'guestId',mapping: 'guestId', type: 'string'},
				{name: 'month',mapping: 'month', type: 'string'},
				{name: 'amount',mapping: 'amount', type: 'string'},
				{name: 'addedBy',mapping: 'addedBy', type: 'string'},
				{name: 'addedOn',mapping: 'addedOn', type: 'string'}
		    ],
		idvehicle: 'receiptId'
	});

	var paymentsStore = Ext.create('Ext.data.JsonStore', {
        id: 'paymentsStore',
        model: 'paymentsdata',
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
				type : 'json',
                root:    'BILLS',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'billDate',
            direction: 'DESC'
        }]
    });

	var Billingcol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "ReceiptId", dataIndex: 'receiptId', width:40, sortable: false,hidden:true},
		{text: "Receipt No", dataIndex: 'receiptNo', width:100, sortable: false,},
		{text: "Bill Date", dataIndex: 'billDate', width:100, sortable: true,align:'center'},
		{text: "Month", dataIndex: 'month',  width:90, sortable: false,align:'center'},
		{text: "Amount  &#8377;", dataIndex: 'amount',  width:100, sortable: false,align:'right',
        	renderer:setFloat,summaryType:'sum',
        	summaryRenderer:function(v){
        		if(v!="" || v!=0)
        			return "<b>"+v.toFixed(2)+"</b>";
        		else
        			return v;
        	}
        },
		{text: "Receipt By", dataIndex: 'addedBy',  width:100, sortable: false,align:'center'},
		{text: "Receipt Date", dataIndex: 'addedOn',  width:110, sortable: true,align:'center'}
	];		

	var paymentsGrid = new Ext.grid.GridPanel({
		id:'paymentsGrid',
		xtype: 'grid',
		title:'Payment History',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		height:250,
		border:true,
		autoScroll:true,
		loadMask: true,
		store:paymentsStore,
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
		columns: Billingcol,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'paymentsGridPbar',
			store: paymentsStore,
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
			}
			// ,
			// afterrender:function(){
			// 	Ext.getCmp("paymentsGrid").getEl().mask("Loading Receipts...");
			// 	paymentsStore.load({
			// 		callback: function() {
			// 			Ext.getCmp("paymentsGrid").getEl().unmask();
			// 		}
			// 	});
			// }

		}
	});

	var receiptform = {
		xtype:'form',
		id:'receiptform',
		name:'receiptform',
		// frame:true,
		border:false,
		bodyPadding:10,
		fieldDefaults: {
			labelAlign: 'right',
			msgTarget: 'side',
			labelSeparator:''//,
			//labelWidth: 120
		},
		defaultType: 'textfield',
		items: [{
					xtype:'fieldset',
		            layout:'form',
		            labelWidth:80,
		            defaults:{labelSeparator:''},
		            title:'< Enter Receipt Details >',
		            bodyStyle:'background-color:#f7f7f7',
		            autoHeight:true,
		            border:true,
		            items:[
						{                    
	                        xtype:'textfield',
	                        fieldLabel: "Receipt No",
	                        name: 'receiptNo',
	                        id: 'receiptNo',
	                        anchor:'95%',
	                        readOnly:true
		                },
		                {
		                	xtype:'hidden',
		                	name:'guestId',
		                	id:'guestId',
		                	text:'guestId'
		                },
		                {
		                	xtype:'hidden',
		                	name:'guestName',
		                	id:'guestName',
		                	text:'guestName'		                	
		                },
		                {
                            xtype:'datefield',
                            fieldLabel: "Due Date",
                            format:'d-m-Y',
                            altFormats:'d/m/Y|d.m.Y',
                            name: 'billDate',
                            id: 'billDate',
                            anchor:'98%',
                            allowBlank:false,
                            editable:false,
                            blankText:'Due Date is Required',
                            value:new Date(),
                            listeners:{
                                change:function(ds, newval, oldval){
                                    var monthof = Ext.util.Format.date(newval,"M Y");
                                    Ext.getCmp('month').setValue(monthof);

                                }
                            }
		                },
		                {
                            xtype:'textfield',
                            fieldLabel: "Month of",
                            //format:'M Y',
                            name: 'month',
                            id: 'month',
                            readOnly:true,
                            value: Ext.util.Format.date(new Date(),"M Y"),
                            anchor:'90%',
                            //invalidText : 'Invalid Date.Correct Format - Jan 2009',
                            //menu:monthMenu,
                            allowBlank:false,
                            blankText:'Month is Required'		                	
		                },
		                {
							xtype:'numberfield',
							fieldLabel: 'Amount &#8377;',
							name: 'amount',
							id: 'amount',
							anchor:'60%',					
							blankText: 'Receipt Amount is required',
							allowBlank:false,
							minValue:1,
							hideTrigger: true,
							keyNavEnabled: false,
							mouseWheelEnabled: false,
							decimalPrecision:2,
							decimalSeparator:'.'
		                }
		            ]
				}

		]
	}

	var billingform = {
		xtype:'form',
		id:'billingform',
		name:'billingform',
		frame:true,
		border:false,
		// bodyPadding:10,
		fieldDefaults: {
			labelAlign: 'right',
			msgTarget: 'side',
			labelSeparator:''//,
			//labelWidth: 120
		},
		defaultType: 'textfield',
		// width: 900,
  //       height:530,
		layout:{
			type:'column'
		},			
		items: [
			{
					xtype: 'container',
					id:'receiptgridArea',
					name:'receiptgridArea',
					columnWidth: .6,
					layout:{
						type:'anchor'
					},
					border:false,
					// style:'padding-left:5px;padding-right:15px',
					items:[billingGuestsGrid,paymentsGrid]
			},{

					xtype: 'container',
					id:'receiptformArea',
					name:'receiptformArea',
					columnWidth: .4,
					layout:{
						type:'anchor'
					},
					border:false,
					// style:'padding-left:5px;padding-right:15px',
					items:[receiptform]
			}
		]
	}


	var billingWin = Ext.create('Ext.Window', {
		title: (billingArray['todo']=="Add_Receipt")?"Add Receipt":(billingArray['todo']=="View_Receipt")?"View Payments":"Edit Receipt",
		width: 1100,
        height:580,
		plain: true,
		modal:true,
		closable:true,
		border: false,
		layout: {
	//        align: 'stretch',
	        type: 'fit'
		},
		items: [billingform],
		buttons: [{
			text: billingArray['todo']=="Add_Receipt"?'Save':'Update',
			id:"ReceiptSaveBtn",
			name:"ReceiptSaveBtn",
			handler:function(){
				var formPanel = Ext.getCmp('billingform').getForm();
				if(Ext.getCmp('guestId').getValue()<=0 || Ext.getCmp('guestName').getValue()=="" ) {
					Ext.Msg.alert('Error', "Select a guest before making a receipt");
					return false;
				}
				if( Ext.getCmp('amount').getValue()<=0 || Ext.getCmp('amount').getValue()=="" ) {					
					Ext.Msg.alert('Error', "Please enter the receipt amount before making a receipt");
					Ext.getCmp('amount').focus();
					return false;
				}				
				var msgbox = Ext.MessageBox.show({
					title:'Confirm?',
					msg: 'Are you sure want to save the Receipt for <b>'+Ext.getCmp('month').getValue()+'</b>?<br><br>Transaction Password:',
					buttons: Ext.MessageBox.YESNO,
					prompt: true,
					fn: function(btn, text){
						if(btn=="yes"){							
							if(formPanel.isValid()){
								formPanel.submit({
									clientValidation: true,
									url: 'includes/billing_ajx.php',
									params: {
										todo: billingArray['todo'], 
										guestId:billingArray['guestId'],
										text:text
									},
									success: function(form, action) {
										var tmpmsg = action.result.msg.split(".");
										var sMsg = tmpmsg[0];
										if(tmpmsg[2])
											sMsg += tmpmsg[2];

										Ext.getCmp('receiptNo').setValue(tmpmsg[1]);
										Ext.Msg.alert('Success', sMsg);

										if(selectedGuestId!=0){	
											paymentsStore.baseParams = {guestId:selectedGuestId, start:0, limit:30};
											Ext.getCmp("paymentsGrid").setTitle("Payment History of "+selectedguestName)
											Ext.getCmp("paymentsGrid").getEl().mask("Loading Receipts...");
											paymentsStore.load({
												params:{guestId:selectedGuestId, start:0, limit:30},
												callback: function() {
													Ext.getCmp("paymentsGrid").getEl().unmask();
												}
											});
										}
									},
									failure: function(form, action) {
										// debugger;
										switch (action.failureType) {
											case Ext.form.action.Action.CLIENT_INVALID:
												Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
												break;
											case Ext.form.action.Action.CONNECT_FAILURE:
												Ext.Msg.alert('Failure', 'Ajax communication failed');
												break;
											case Ext.form.action.Action.SERVER_INVALID:
												if(action.result.title)
											   		Ext.Msg.alert((action.result.title!="")?action.result.title:'Failure', action.result.msg);
											   	else
											   		Ext.Msg.alert('Failure', action.result.msg);
									   }
									}
								});
							}
						}
					},
					icon: Ext.MessageBox.WARNING
				});
				msgbox.textField.inputEl.dom.type = 'password';
			}
		},
		// {
		// 	text: 'Print',
		// 	icon: './images/printer.png',
		// 	// cls: 'x-btn-bigicon print',			
		// 	handler: function() {
		// 		// Ext.getCmp('billingform').getForm().reset();
		// 	}
		// },
		{
			text: 'Reset',
			hidden:billingArray['todo']=="Add_Room"?false:true,
			handler: function() {
				Ext.getCmp('billingform').getForm().reset();
			}
		},{
			text: 'Close',
			handler: function() {
				billingWin.destroy();
				var billgrid = Ext.getCmp("billingGrid");
				billgrid.getEl().mask("Loading Receipts...");
				billgrid.getStore('billingStore').load(
				{
					callback: function() {
						billgrid.getEl().unmask();
					}
				}
				);				
			}
		}]
	    }).show();
		if(billingArray['todo']=="View_Receipt"){
			Ext.getCmp('ReceiptSaveBtn').hide();
			Ext.getCmp('receiptform').disable();
			// receiptgridArea
			// Ext.getCmp('receiptformArea').Remove();
		}
		// Ext.getCmp('roomNo').focus(true,1000);


}
