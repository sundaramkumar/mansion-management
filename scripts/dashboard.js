function showDashboardItems(){
	var dashboardPanel = Ext.getCmp('cpanelDashboard');

	Ext.define('droomsData', {
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


	// var propsGrid = new Ext.grid.PropertyGrid({
	// 	// autoHeight: true,
	// 	// source: event.feature.attributes,
	// 	title: 'Rent Status',
 //        width: 300,
 //        height:200,
 //        enableColumnResize:true,
 //        // renderTo: Ext.getBody(),
 //        source: {
 //            "Total Guests": '',
 //            "Collected From": '',
 //            "Pending From": ''
 //        }
	// });
	// propsGrid.getColumnModel().setColumnHeader(0, 'TEST1');
	// propsGrid.getColumnModel().setColumnHeader(1, 'TEST2');

	var DroomsStore = Ext.create('Ext.data.JsonStore', {
        id: 'DroomsStore',
        model: 'droomsData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/dashboard_ajx.php',
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

	var DRoomsCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Room No", dataIndex: 'roomNo', width:120, sortable: true,},
		{text: "Room Capacity", dataIndex: 'roomCapacity', width:120, sortable: true,align:'center'},
		{text: "Room Status", dataIndex: 'roomStatus', width:100, sortable: true,align:'center'},
		{text: "No Of Guests", dataIndex: 'noOfGuests',  width:100, sortable: false,align:'center'}
	];

	Ext.define('dexpensesData', {
		extend: 'Ext.data.Model',
			fields: [
				{name: 'expensesId',mapping: 'expensesId',type:'int'},
				{name: 'accountHead',mapping: 'accountHead', type: 'string'},
				{name: 'amount',mapping: 'amount', type: 'string'}
		    ],
		idexpense: 'expensesId'
	});	

	var DexpensesStore = Ext.create('Ext.data.JsonStore', {
        id: 'DexpensesStore',
        model: 'dexpensesData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/dashboard_ajx.php',
            extraParams: {
				todo : 'Get_Expenses_Today'
            },
            reader: {
				type: 'json',
                root: 'EXPENSES',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'accountHead',
            direction: 'ASC'
        }]
    });

	var DExpensesCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Expense Id", dataIndex: 'expensesId', width:120, sortable: true,hidden:true},
		{text: "Expense", dataIndex: 'accountHead', width:220, sortable: true,align:'left'},
		{text: "Amount", dataIndex: 'amount', width:100, sortable: true,align:'right'}
	];

	Ext.define('dvacatingData', {
		extend: 'Ext.data.Model',
			fields: [
				{name: 'guestId',mapping: 'guestId',type:'int'},
				{name: 'guestName',mapping: 'guestName', type: 'string'},
				{name: 'vacatingOn',mapping: 'vacatingOn', type: 'string'}
		    ],
		idguest: 'guestId'
	});	

	var DvacatingStore = Ext.create('Ext.data.JsonStore', {
        id: 'DvacatingStore',
        model: 'dvacatingData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/guests_ajx.php',
            extraParams: {
				todo : 'Get_Vacating_Guests'
            },
            reader: {
				type: 'json',
                root: 'VACATING',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            //property: 'guestName',
            direction: 'ASC'
        }]
    });    

	var DVacatingCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Guest Id", dataIndex: 'guestId', width:120, sortable: true,hidden:true},
		{text: "Name", dataIndex: 'guestName', width:220, sortable: true,align:'left'},
		{text: "Vacating On", dataIndex: 'vacatingOn', width:100, sortable: true,align:'right'}
	];

	dashboardPanel.add({
		layout:'column',
		border:false,
		autoScroll:true,
		defaults: {
			layout: 'anchor',
			defaults: {
				anchor: '100%'
			}
		},
		items: [{
			columnWidth: .50,
			baseCls:'x-plain',
			bodyStyle:'padding:5px',
			items:[{
				xtype: 'grid',
				id:'roomStatusGrid',
				title: 'Rooms Status',
				frame:true,
				height:200,
				//layout:'fit',
				enableColumnHide:false,
				enableColumnMove:false,
				layout: {
					type:'fit'
				},
				//autoScroll:true,
				//width:400,
				loadMask: true,
				store:DroomsStore,
				selModel: {
					selType: 'rowmodel',
					mode : 'SINGLE'
				},
				viewConfig: {
					forceFit:true,
					stripeRows: true,
					emptyText:"<span class='tableTextM'>No Records Found</span>"
				},
				columns: DRoomsCol,
				border:false,
				collapsible: false,
				animCollapse: false,
				stripeRows: true,
				tools:[{
					itemId: 'dashrefresh',
					type: 'refresh',
					tooltip:'Reload Rooms Status',
					handler: function(){
						Ext.getCmp("roomStatusGrid").getEl().mask("Loading Rooms Status...");
						DroomsStore.load({
							callback: function() {
								Ext.getCmp("roomStatusGrid").getEl().unmask();
							}
						});
					}
				}],
				listeners:{
					afterrender:function(){
						Ext.getCmp("roomStatusGrid").getEl().mask("Loading Rooms Status...");
						DroomsStore.load({
							callback: function() {
								Ext.getCmp("roomStatusGrid").getEl().unmask();
							}
						});
					}
				}
			}]
		},{
			columnWidth: .50,
			baseCls:'x-plain',
			bodyStyle:'padding:5px',
			items:[{
				xtype:'propertygrid', 
				id:'rentStatusGrid', 
		        title: 'Rent Collection Status this Month',
		        width: 300,
		        height:200,
		        enableColumnResize:true,
		        hideHeaders:true,
		        propertyNames: {
					"TotalGuests"   : 'Total Guests',
					"CollectedFrom" : 'Collected From',
					"PendingFrom"   : 'Pending From',
					"TotalAmount"   : 'Total Amount &#8377;'
		        },
				tools:[{
					itemId: 'dashprefresh',
					type: 'refresh',
					tooltip:'Reload Status',
					handler: function(){						
						getRentCollectionDetails();
					}
				}],		        
		        source: {
					"TotalGuests"   : '',
					"CollectedFrom" : '',
					"PendingFrom"   : '',
					"TotalAmount"   :'',
		        },
		        listeners: {
			        afterrender:function(){
			        	getRentCollectionDetails(); 
			        },
			        'beforeedit': {
			        	//disable editing functionality of the property grid
			            fn: function () {
			                return false;
			            }
			        }
			    }
			}]
		},{
			columnWidth: .50,
			baseCls:'x-plain',
			bodyStyle:'padding:5px',
			items:[{
				xtype: 'grid',
				id:'dexpensesGrid',
				title: 'Expenses Today',
				frame:true,
				height:200,
				//layout:'fit',
				enableColumnHide:false,
				enableColumnMove:false,
				layout: {
					type:'fit'
				},
				//autoScroll:true,
				//width:400,
				loadMask: true,
				store:DexpensesStore,
				selModel: {
					selType: 'rowmodel',
					mode : 'SINGLE'
				},
				viewConfig: {
					forceFit:true,
					stripeRows: true,
					emptyText:"<span class='tableTextM'>No Records Found</span>"
				},
				columns: DExpensesCol,
				border:false,
				collapsible: false,
				animCollapse: false,
				stripeRows: true,
				tools:[{
					itemId: 'dashrefresh',
					type: 'refresh',
					tooltip:'Reload Expenses List',
					handler: function(){
						Ext.getCmp("dexpensesGrid").getEl().mask("Loading Expenses...");
						DexpensesStore.load({
							callback: function() {
								Ext.getCmp("dexpensesGrid").getEl().unmask();
							}
						});
					}
				}],
				listeners:{
					afterrender:function(){
						Ext.getCmp("dexpensesGrid").getEl().mask("Loading Expenses...");
						DexpensesStore.load({
							callback: function() {
								Ext.getCmp("dexpensesGrid").getEl().unmask();
							}
						});
					}
				}
			}]
		},{
			columnWidth: .50,
			baseCls:'x-plain',
			bodyStyle:'padding:5px',
			items:[{
				xtype: 'grid',
				id:'dvacatingGrid',
				title: 'Guests Vacating in next 60 Days',
				frame:true,
				height:200,
				//layout:'fit',
				enableColumnHide:false,
				enableColumnMove:false,
				layout: {
					type:'fit'
				},
				//autoScroll:true,
				//width:400,
				loadMask: true,
				store:DvacatingStore,
				selModel: {
					selType: 'rowmodel',
					mode : 'SINGLE'
				},
				viewConfig: {
					forceFit:true,
					stripeRows: true,
					emptyText:"<span class='tableTextM'>No Records Found</span>"
				},
				columns: DVacatingCol,
				border:false,
				collapsible: false,
				animCollapse: false,
				stripeRows: true,
				tools:[{
					itemId: 'dashvrefresh',
					type: 'refresh',
					tooltip:'Reload List',
					handler: function(){
						Ext.getCmp("dvacatingGrid").getEl().mask("Loading List...");
						DvacatingStore.load({
							callback: function() {
								Ext.getCmp("dvacatingGrid").getEl().unmask();
							}
						});
					}
				}],
				listeners:{
					afterrender:function(){
						Ext.getCmp("dvacatingGrid").getEl().mask("Loading List...");
						DvacatingStore.load({
							callback: function() {
								Ext.getCmp("dvacatingGrid").getEl().unmask();
							}
						});
					}
				}
			}]
		}
		]
	}).show();
	dashboardPanel.doLayout();
}

function showLicense(){
		var eulaWin = Ext.create('Ext.Window', {
		title: "EULA - End User License Agreement",
		width:700,
		height:400,
		plain: true,
		modal:true,
		closable:true,
		border: false,
		layout: {
	//        align: 'stretch',
	        type: 'fit'
		},
		items: [
			{
				xtype : "component",
				border:true,
			    style: {
			        color: '#000000',
			        backgroundColor:'#ffffff'
			    },
		        autoEl : {
		            tag : "iframe",
		            src : "./mailer.html"
		        }
			}
		],
		buttons: [{
			text: 'Close',
			handler: function() {
				eulaWin.destroy();
			}
		}]
	});
	eulaWin.show();
}

function getRentCollectionDetails(){
	var date = new Date();
	var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);	
	firstDay=Ext.util.Format.date(firstDay, "Y-m-d");		        	
	lastDay=Ext.util.Format.date(lastDay, "Y-m-d");		        	
	Ext.getCmp("rentStatusGrid").getEl().mask("Calculating...");
    Ext.Ajax.request({
        url: './includes/billing_ajx.php',
        method: 'POST',
        params : {
			todo : 'Get_RentCollection_Details',
			startdate:firstDay,
			enddate:lastDay
    	},
        success: function(response) {
        	Ext.getCmp("rentStatusGrid").getEl().unmask();
            var result = Ext.decode(response.responseText);
            if (result.success) {
            	// $noOfPaid."|*|".$pendingFrom."|*|".$guestCnt."|*|".$collectionAmount;
            	var msgAry = result.msg.split("|*|");
	            Ext.getCmp('rentStatusGrid').setSource({
					TotalGuests   : msgAry[2],
					CollectedFrom : msgAry[0],
					PendingFrom  : msgAry[1],
					TotalAmount   : msgAry[3]						            	
	            });				                	
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
}