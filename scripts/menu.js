    var accordion_store = Ext.create('Ext.data.TreeStore', {
        proxy: {
            type: 'ajax',
            url: './scripts/menu.json'
        }
    });

	var mnuUser_store = Ext.create('Ext.data.TreeStore', {
        root: {
			expanded: true,
			id:'SAadmin',
			children:[
				{
					text:'Manage',
					icon:'./images/management.png',
					id: 'Manage',
					expanded: true,
					children:[{
						text: 'Rooms',
						id: 'Rooms',
						icon:'images/rooms.png',
						leaf:true
					},{
						text: 'Guests',
						id: 'Guests',
						icon:'images/guests.png',
						leaf:true
					}]
				},
				{
					text: 'Reports',
					id: 'Reports',
					icon:'./images/report.png',
					expanded: true,
					children:[{
						text: 'Rooms Occupancy Report',
						icon:'./images/rooms.png',
						id: 'RoomReports',
						// id: 'TripSummaryReports',
						leaf:true
					},{
						text: 'Guest Reports',
						icon:'./images/guests.png',
						id: 'GuestReports',
						// id: 'HistoryReports',
						leaf:true
					},{
						text: 'Rent Reports',
						icon:'./images/rent.png',
						id: 'RentReports',
						// id: 'speedReports',
						leaf:true
					},{
						text: 'Daily Expenses Report',
						icon:'./images/expenses.png',
						id: 'expensesReports',
						leaf:true
					}]
				},{
					text:'Setings',
					id:'Settings',
					icon:'./images/settings.png',
					leaf:true
				},{
					text:'Close All Tabs',
					id:'closeAllTabs',
					icon:'./images/closeall.png',
					leaf:true
				},{
					text:'Logout',
					id:'Logout',
					icon:'./images/logoutsmall.png',
					leaf:true
					// ,
					// handler:function(){
					// 	confLogout();
					// }
				}
			]
        }/*,
		folderSort: true,
        sorters: [{
            property: 'text',
            direction: 'ASC'
        }]*/
    });
	var mnuSAdmin_store = Ext.create('Ext.data.TreeStore', {
        root: {
			expanded: true,
			id:'SAadmin',
			children:[
				{
					text:'Manage',
					icon:'./images/management.png',
					id: 'Manage',
					expanded: true,
					children:[{
						text: 'Rooms',
						id: 'Rooms',
						icon:'images/rooms.png',
						leaf:true
					},{
						text: 'Guests',
						id: 'Guests',
						icon:'images/guests.png',
						leaf:true
					}]
				},
				{
					text: 'Accounts',
					icon:'./images/accounts.png',
					id: 'Accounts',	
					expanded: true,			
					children:[{
						text: 'Account Heads',
						icon:'./images/accountheads.png',
						id: 'AccountHeads',
						// id: 'TripSummaryReports',
						leaf:true
					},{
						text: 'Expenses',
						icon:'./images/transactions.png',
						id: 'Expenses',
						leaf:true
					},
					{
						text: 'Receipt',
						icon:'./images/billing.png',
						id: 'Billing',
						leaf:true
					}]
				},
				{
					text: 'Reports',
					id: 'Reports',
					icon:'./images/report.png',
					expanded: true,
					children:[{
						text: 'Rooms Occupancy Report',
						icon:'./images/rooms.png',
						id: 'RoomReports',
						// id: 'TripSummaryReports',
						leaf:true
					},{
						text: 'Guest Reports',
						icon:'./images/guests.png',
						id: 'GuestReports',
						// id: 'HistoryReports',
						leaf:true
					},{
						text: 'Rent Reports',
						icon:'./images/rent.png',
						id: 'RentReports',
						// id: 'speedReports',
						leaf:true
					},{
						text: 'Daily Expenses Report',
						icon:'./images/expenses.png',
						id: 'expensesReports',
						leaf:true
					}]
				},{
					text:'Setings',
					id:'Settings',
					icon:'./images/settings.png',
					leaf:true
				},{
					text:'Close All Tabs',
					id:'closeAllTabs',
					icon:'./images/closeall.png',
					leaf:true
				},{
					text:'Logout',
					id:'Logout',
					icon:'./images/logoutsmall.png',
					leaf:true
					// ,
					// handler:function(){
					// 	confLogout();
					// }
				}
			]
        }/*,
		folderSort: true,
        sorters: [{
            property: 'text',
            direction: 'ASC'
        }]*/
    });

	var mnuTrack_store = Ext.create('Ext.data.TreeStore', {
//        proxy: {
//            actionMethods: {
//				read: 'POST'
//			},
//            type: 'ajax',
//            url: 'includes/devices_ajx.php',
//            extraParams: {
//				todo : 'Get_Devices_List'
//            }
//        },
        root: {
			text:'Tracking',
			id:'Tracking',
			expanded: true,
			children:[{
				text:'Realtime',
				id:'Tracking/Realtime',
				expanded: true,
				children:[{
					text: 'Devices',
					id: 'Tracking/Realtime/Devices',
					iconCls:'gpsFolder',
					expanded: true
				}]
			},
			{
				text: 'History',
				id: 'Tracking/Realtime/History'
			}]

        }
        /*,
		 folderSort: true,
        sorters: [{
            property: 'text',
            direction: 'ASC'
        }]*/
    });
	var welcome = Ext.create('Ext.Panel', {
		title: 'Welcome',
		html: '',
		iconCls:'dashboard'
	});


	var ManagePanel = Ext.create('Ext.Panel', {
		title: 'Manage',
		iconCls:'manage'
	});

	var ReportsPanel = Ext.create('Ext.tree.Panel', {
		title: 'Reports',
		iconCls:'report',
		store: accordion_store,
		root: {
			text:'Reports',
			id:'Reports/',
			expanded: true
        }
	});

	var sAdminPanel = Ext.create('Ext.tree.Panel',{
		title: 'Manage',
		iconCls: 'alarm',
		store: (usertype=="U")?mnuUser_store:mnuSAdmin_store,
		height:500,
		//flex:3,
		layout:'fit',
		border:0,
		rootVisible: false,
		listeners:{
			itemclick: function(view, record , item, index, event) {
				if(record.get("leaf")){
					if(record.get('id')=='Logout'){
						confLogout();
					}else if(record.get('id')=='closeAllTabs'){
						Ext.getCmp("contentPanel").getEl().mask("Closing all open Tabs...");
						var tabpanel = Ext.getCmp('contentPanel');
						tabpanel.items.each(
						function(item) {
							if(item.closable) {
								tabpanel.remove(item);
							}
						});
						Ext.getCmp("contentPanel").getEl().unmask();
					}else if(record.get('id')=='Billing' || record.get('id')=='AccountHeads' || record.get('id')=='Expenses'){						
						if(usertype=='U')
							return false;
						else
							eval("LoadTabs('"+record.get("id")+"', '"+record.get("text")+"')");
					}else{
						eval("LoadTabs('"+record.get("id")+"', '"+record.get("text")+"')");
					}
				}
			}
		}
	});


    var accordion = Ext.create('Ext.Panel',
		{
			region:'west',
			margins:'5 0 5 5',
			split:true,
			collapsible:true,
			collapsed:false,
			width: 200,
			minWidth:200,
			maxWidth:200,
			title:'Welcome',
			layout: {
				type:'vbox',
				//padding:'5',
				align:'stretch'
			},
			items:[{
				xtype:'container',
				title: 'Welcome',
				flex:1
				/*icon:'./images/duetoday.png'*//*,
				handler:markAttendance*/
			},{
				xtype:'container',
				//layout:'accordion',
				flex:3,
				items: [sAdminPanel]//,  ReportsPanel, ManagePanel, GeoFencePanel]
			}]

		}
	);