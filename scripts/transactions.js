function showExpenses(){
	if(Ext.getCmp("expensesGrid")){
		Ext.getCmp("SAdminPanelExpenses").setActiveTab("expensesGrid");
		return false;
	}	
	Ext.define('expensesData', {
		extend: 'Ext.data.Model',
			fields: [
                {name: 'expensesId',mapping: 'expensesId'},
                {name: 'date',mapping: 'date',type:'string'},
                {name: 'accountHeadId',mapping: 'accountHeadId'},
                {name: 'accountHeadName',mapping: 'accountHeadName'},
                {name: 'description',mapping: 'description'},
                {name: 'amount',mapping: 'amount',type:'float'},
                {name: 'addedBy',mapping: 'addedBy'},
                {name: 'addedOn',mapping: 'addedOn'}
		    ],
		idvehicle: 'expensesId'
	});	
	var expensesStore = Ext.create('Ext.data.JsonStore', {
        id: 'expensesStore',
        model: 'expensesData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/expenses_ajx.php',
            extraParams: {
				todo : 'Get_Expenses_List'
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
            property: 'accountHeadId',
            direction: 'ASC'
        }]
    });	

	function setFloat(v){		
		if(v!="")
			return v.toFixed(2);
		else
			return v;
	}
	var expensesCol	= [	Ext.create('Ext.grid.RowNumberer'),
        {header: "Expense ID", width: 35, sortable: true, dataIndex: 'expensesId',menuDisabled:true,hideable:false,hidden:true},
        {header: "accountHeadId", width: 35, sortable: true, dataIndex: 'accountHeadId',menuDisabled:true,hideable:false,hidden:true},
        {header: 'Date',width: 120,sortable: true,dataIndex: 'date'},
        {header: 'Account Head',width: 200,sortable: true,dataIndex: 'accountHeadName'},
        {header: "Description", width: 250,sortable: false, dataIndex: 'description'},
        {header: "Amount &#8377;", width: 120, dataIndex: 'amount',align:'right',
        	renderer:setFloat,summaryType:'sum',
        	summaryRenderer:function(v){
        		if(v!="" || v!=0)
        			return "<b>"+v.toFixed(2)+"</b>";
        		else
        			return v;
        	}
        },
        {header: "Entered By", width: 120, dataIndex: 'addedBy'},
        {header: "Entered On", width: 120, dataIndex: 'addedOn'},        
	];	

	var loadTabPanel = Ext.getCmp('SAdminPanelExpenses');
	loadTabPanel.add({
		id:'expensesGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:expensesStore,
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
		columns: expensesCol,
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		tbar:[{
			xtype:'buttongroup',
			items: [
			{
				text:'Enter New Expense',
				scale: 'small',
				icon: './images/table_add.png',
				cls: 'x-btn-bigicon',			
				handler:function(){
					var expensesArray 			= new Array();
					expensesArray["todo"]		= "Add_Expense";
					expensesArray["titleStr"]	= "Add New Expense";
					expensesArray['expensesId'] = 0;

					for(var i=0;i<=3;i++){
						expensesArray[i]="";
					}
					add_edit_expenses(expensesArray);
				}				
			},
			{
				text:'Edit Expense',
				disabled:true,
				scale:'small',
				id:'expenseEditButton',
				icon: './images/edit_btn.gif',
				cls: 'x-btn-bigicon',
				handler:function(){
					var gridRec = Ext.getCmp("expensesGrid").getSelectionModel().getSelection();
					if(gridRec.length>0){
						//alert(customerArray);
						//var tmpStrArray = gridRec[0].get("contactperson").split(" ");
						var expensesArray 			= new Array();
						expensesArray["todo"]		= "Edit_Expense";
						expensesArray["titleStr"]	= "Edit Expense Details";
						expensesArray['expensesId'] 	= gridRec[0].get("expensesId");
						expensesArray[0]	= gridRec[0].get("accountHeadId");
						expensesArray[1]	= gridRec[0].get("accountHeadName");

						expensesArray[2]	= gridRec[0].get("date");
						console.log(expensesArray[2]);
						var date = Ext.Date.parse(expensesArray[2], 'd-m-Y');
						expensesArray[2]	= Ext.Date.format(date, "Y/m/d");
						console.log(expensesArray[2]);

						expensesArray[3]	= gridRec[0].get("description");
						expensesArray[4]	= gridRec[0].get("amount");						

						add_edit_expenses(expensesArray);
					}					
				}
			}]
			},
			'->',
			'-',
			{
				xtype:'combo',
				fieldLabel: 'Account Head',
				displayField: 'accountHeadName',
				valueField: 'accountHeadId',
				mode: 'remote',
				emptyText:'Select AccountHead...',
				editable :false,
				name: 'filteraccountHeadId',
				id:'filteraccountHeadId',
				hiddenName: 'filteraccountHeadId',
				anchor:'90%',
				msgTarget: 'side',
				triggerAction: 'all',
				forceSelection: false,
				selectOnFocus:true,
				allowBlank:true,
				store: Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'accountHeadId'},
                        {name: 'accountHeadName'}
                    ],
                    //autoLoad: false,
                    proxy: {
                        type: 'ajax',
						actionMethods: {
							read: 'POST'
						},
                        url: './includes/combo_ajx.php',
			            extraParams: {
							todo : 'Get_AccountHead',
							//devtype:'VTS'
			            },
                        reader: {
                            type: 'json',
                            root: 'ACHEADS',
			                totalProperty: 'totalCount'
                        }
                    }
		        
		        }),
		        listeners: {
		            render: function(combo) {						
		                	Ext.getCmp('filteraccountHeadId').getStore().load();
						
		            }
				}
			},
			{
				xtype:'datefield',
				fieldLabel: "Filter By Date",
				format: 'Y/m/d',
				altFormat:'Y/m/d|Y.m.d',
				name: 'filterDate',
				id: 'filterDate',
				labelSeparator:'',
				// anchor:'70%',
				labelWidth:70,
				width:180,
				allowBlank:false,					
				blankText:'Expense Date is Required'
			},
			{
				xtype:'button',
				text:'Search >>',
				handler:function(){
					var filterDate	= Ext.getCmp("filterDate").getRawValue();
					var filteraccountHeadId = Ext.getCmp('filteraccountHeadId').getValue();
					expensesStore.baseParams = {acchead:filteraccountHeadId,scexdate:filterDate, start:0, limit:30};
					expensesStore.load({params:{acchead:filteraccountHeadId,scexdate:filterDate, start:0, limit:30}});
				}
			}			
		],
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'expensesGridPbar',
			store: expensesStore,
			dock: 'bottom',
			pageSize: 100,
			displayInfo: true
		}],
		listeners:{
			'selectionchange':function(selmod, record, opt){
				try{
					if(record[0].get("expensesId")!=0){
						Ext.getCmp("expenseEditButton").enable();
						Ext.getCmp("expensesDelButton").enable();
					}
				}
				catch (e){
				}
			},
			afterrender:function(){
				Ext.getCmp("expensesGrid").getEl().mask("Loading Expenses...");
			    // var curdate = Ext.util.Format.date(new Date(),"d-m-Y");
			    // expensesStore.load({params:{start:0, limit:20,scexdate:curdate}});				
				expensesStore.load({
					callback: function() {
						Ext.getCmp("expensesGrid").getEl().unmask();
					}
				});
			}

		}
    }).show();
	loadTabPanel.doLayout();
}

 

function add_edit_expenses(expensesArray){
	var transactionform = {
		xtype:'form',
		id:'transactionform',
		name:'transactionform',
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
					xtype:'combo',
					fieldLabel: 'Account Head',
					displayField: 'accountHeadName',
					valueField: 'accountHeadId',
					mode: 'remote',
					emptyText:'Select AccountHead...',
					editable :false,
					name: 'accountHeadId',
					id:'accountHeadId',
					hiddenName: 'accountHeadId',
					anchor:'90%',
					msgTarget: 'side',
					triggerAction: 'all',
					forceSelection: false,
					selectOnFocus:true,
					blankText:'Account Head is Required',
					allowBlank:false,
					store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'accountHeadId'},
                            {name: 'accountHeadName'}
                        ],
                        //autoLoad: false,
                        proxy: {
                            type: 'ajax',
							actionMethods: {
								read: 'POST'
							},
                            url: './includes/combo_ajx.php',
				            extraParams: {
								todo : 'Get_AccountHead',
								//devtype:'VTS'
				            },
                            reader: {
                                type: 'json',
                                root: 'ACHEADS',
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
							if(expensesArray['todo']=="Edit_Expense"){
								Ext.getCmp('accountHeadId').getStore().load({
									params:{accountHeadName:expensesArray[1]}											
								});
							}else{
			                	Ext.getCmp('accountHeadId').getStore().load();
							}
			            },
						afterrender:function(){
							if(expensesArray[19]!=""){
								//Load the Roomd If from the combo store itself
								var roomstor = Ext.getCmp('accountHeadId').getStore();
								roomstor.on('load',function(){				
									var idx=Ext.getCmp('accountHeadId').getStore().findExact('accountHeadName',expensesArray[1]);
									if(idx>=0){ //if exists in the store, then find the room id
										var acc_id=Ext.getCmp('accountHeadId').getStore().getAt(idx).get('accountHeadId');
										Ext.getCmp('accountHeadId').setValue(acc_id);
									}
								})
							}
						}
					}
				},{
					xtype:'datefield',
					fieldLabel: "Expense Date",
					format: 'Y/m/d',
					altFormat:'Y/m/d|Y.m.d',
					name: 'date',
					id: 'date',
					anchor:'60%',
					allowBlank:false,					
					blankText:'Expense Date is Required',
					editable:false,
					//value:new Date(),
					// minValue:expensesArray['todo'] == "Update_Expenses"?'':new Date(),
					listeners:{
						afterrender:function(){ 
							if(expensesArray[2]!="") 
								this.setValue(expensesArray[2]);
						}
					}
				},{
					xtype:'textfield',
					fieldLabel: 'Description',
					name: 'description',
					id: 'description',
					anchor:'90%',					
					blankText: 'Description is required',
					allowBlank:false,
					listeners:{afterrender:function(){ 
						if(expensesArray[3]!="") 
							this.setValue(expensesArray[3]);
					}}
				},{
					xtype:'numberfield',
					fieldLabel: 'Amount &#8377;',
					name: 'amount',
					id: 'amount',
					anchor:'60%',					
					blankText: 'Expense Amount is required',
					allowBlank:false,
					minValue:0,
					hideTrigger: true,
					keyNavEnabled: false,
					mouseWheelEnabled: false,
					decimalPrecision:2,
					decimalSeparator:'.',
					listeners:{afterrender:function(){ if(expensesArray[4]!="") this.setValue(expensesArray[4]);}}
				}							
		]
	}


	var transactionWin = Ext.create('Ext.Window', {
		title: expensesArray['todo']=="Add_Expense"?"Add Expense":"Edit Expense",
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
		items: [transactionform],
		buttons: [{
			text: expensesArray['todo']=="Add_Expense"?'Add':'Update',
			icon: expensesArray['todo']=="Add_Expense"?"./images/table_add.png":"./images/edit_btn.gif",
			handler:function(){
				var formPanel = Ext.getCmp('transactionform').getForm();
				if(formPanel.isValid()){
					formPanel.submit({
						clientValidation: true,
						url: 'includes/expenses_ajx.php',
						params: {
							todo: expensesArray['todo'], 
							expensesId:expensesArray['expensesId']
						},
						success: function(form, action) {
						   Ext.Msg.alert('Success', action.result.Msg);
						   transactionWin.destroy();
						   Ext.getCmp("expensesGrid").getStore().loadPage(1);
							Ext.getCmp("expenseEditButton").disable();
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
								   Ext.Msg.alert('Failure', action.result.Msg);
						   }
						}
					});
				}
			}
		},{
			text: 'Reset',
			icon:'./images/refresh.png',
			hidden:expensesArray['todo']=="Add_Expense"?false:true,
			handler: function() {
				Ext.getCmp('transactionform').getForm().reset();
			}
		},{
			text: 'Close',
			icon:'./images/close.png',
			handler: function() {
				transactionWin.destroy();
			}
		}]
	    }).show();
		// Ext.getCmp('roomNo').focus(true,1000);
	
	// var branch_store = new Ext.data.SimpleStore({
	// 	url: 'includes/combo_ajx.php',
	// 	fields: ['code', 'value']
	// });
	// branch_store.load({params: {todo:'Get_BranchList'}});
	// branch_store.on('load', setBrnachVal);
	// function setBrnachVal(){
	// 	if(expenseArray[0]!="" && jlpcook.get("utype")!="U"){
	// 	    Ext.getCmp('expensefrm').getForm().findField('branchHid').setValue(expenseArray[0]);
 //        }
	// 	if(jlpcook.get("bid") && jlpcook.get("utype")=="U"){
	// 		Ext.getCmp('expensefrm').getForm().findField('branchHid').setValue(jlpcook.get("bid"));
	// 	}
 //    }
    
    
 //    var acchead_store = new Ext.data.SimpleStore({
	// 	url: 'includes/combo_ajx.php',
	// 	fields: ['code', 'value']
	// });
	// acchead_store.load({params:{todo:'Get_AccountHead'}});
	// acchead_store.on('load', setAccheadVal);
	// function setAccheadVal(){
	// 	if(expenseArray[1]!="")
	// 		Ext.getCmp('expensefrm').getForm().findField('accheadHid').setValue(expenseArray[1]);
	// }
	
	// var expense_win = new Ext.Window({
	// 	title: expenseArray["titleStr"],
	// 	width: 450,
	// 	height:270,
	// 	layout: 'fit',
	// 	id:'expense_win',
	// 	loadMask:true,
	// 	modal:true,
	// 	border:false,
	// 	shadow:true,
	// 	closable:true,
	// 	resizable:false,
	// 	//closeAction:'hide',
	// 	buttonAlign:'right',
	// 	defaults:{bodyStyle:'padding:5px;background-color:#f7f7f7;',labelSeparator:''},
	// 	items:[new Ext.FormPanel({
	// 			labelWidth: 130,
	// 			id:'expensefrm',
	// 			fileUpload: true,
	// 			border:false,
	// 			//autoScroll:true,
	// 			bodyStyle:'background-color:#f7f7f7;',
	// 			defaults:{
	// 				msgTarget: 'side',
	// 				bodyStyle:'background-color:#f7f7f7',
	// 				labelSeparator:''
	// 			 },
	// 			items: [{
	// 				xtype:'combo',
	// 				fieldLabel: 'Branch',
	// 				disabled:jlpcook.get("utype")=="U"?true:false,
	// 				store: branch_store,
	// 				displayField: 'value',
	// 				valueField: 'code',
	// 				mode:'local',
	// 				emptyText:'Select Branch...',
	// 				editable :false,
	// 				name: 'branch',
	// 				id:'branch',
	// 				hiddenName: 'branchHid',
	// 				anchor:'90%',
	// 				msgTarget: 'side',
	// 				triggerAction: 'all',
	// 				forceSelection: false,
	// 				selectOnFocus:true,
	// 				blankText:'Branch is Required',
	// 				allowBlank:false
	// 			},{
	// 				xtype:'combo',
	// 				fieldLabel: 'Account Head',
	// 				store: acchead_store,
	// 				displayField: 'value',
	// 				valueField: 'code',
	// 				mode:'local',
	// 				emptyText:'Select AccountHead...',
	// 				editable :false,
	// 				name: 'acchead',
	// 				id:'acchead',
	// 				hiddenName: 'accheadHid',
	// 				anchor:'90%',
	// 				msgTarget: 'side',
	// 				triggerAction: 'all',
	// 				forceSelection: false,
	// 				selectOnFocus:true,
	// 				blankText:'Account Head is Required',
	// 				allowBlank:false
	// 			},{
	// 				xtype:'datefield',
	// 				fieldLabel: "Expense Date",
	// 				format:'d-m-Y',
	// 				altFormats:'d/m/Y|d.m.Y',
	// 				name: 'expdate',
	// 				id: 'expdate',
	// 				anchor:'60%',
	// 				allowBlank:false,					
	// 				blankText:'Expense Date is Required',
	// 				//value:new Date(),
	// 				minValue:expenseArray['todo'] == "Update_Expenses"?'':new Date(),
	// 				listeners:{render:function(){ if(expenseArray[2]!="") this.setValue(expenseArray[2]);}}
	// 			},{
	// 				xtype:'textarea',
	// 				fieldLabel: 'Description',
	// 				name: 'expdesc',
	// 				id: 'expdesc',
	// 				anchor:'90%',					
	// 				blankText: 'Description is required',
	// 				allowBlank:false,
	// 				listeners:{render:function(){ 
	// 					if(expenseArray[3]!="") 
	// 						this.setValue(replaceNewLines(Ext.util.Format.htmlDecode(expenseArray[3])));
	// 				}}
	// 			},{
	// 				xtype:'numberfield',
	// 				fieldLabel: 'Amount',
	// 				name: 'expamount',
	// 				id: 'expamount',
	// 				anchor:'60%',					
	// 				blankText: 'Expense Amount is required',
	// 				allowBlank:false,
	// 				decimalPrecision:2,
	// 				decimalSeparator:'.',
	// 				listeners:{render:function(){ if(expenseArray[4]!="") this.setValue(expenseArray[4]);}}
	// 			}],
	// 			bbar: new Ext.StatusBar({
	// 				id: 'expenseStatusbar',
	// 				plugins: new Ext.ux.ValidationStatus({form:'expensefrm'})
	// 			})                
	// 		})
	// 	],
	// 	buttons: [{
	// 		text   : expenseArray['todo'] == "Update_Expenses"?'Update':'Save',
	// 		iconCls: 'save',
	// 		id:'expenseSave',
	// 		handler:function(){						
	// 			var fp = Ext.getCmp("expensefrm").getForm();
	// 			if(fp.isValid()){
	// 				Ext.getCmp("expenseSave").disable();
	// 				Expense_formSubmit(expenseArray);
	// 			}
	// 		}
	// 	},{
	// 		text   : 'Cancel',
	// 		handler  : function(){
	// 			if(Ext.get("expenseStatusbar_sBar"))
	// 				Ext.get("expenseStatusbar_sBar").dom.style.visibility="hidden";
	// 			expense_win.destroy();
	// 		}
	// 	}]
	// });
 //    expense_win.show();
}

function Expense_formSubmit(expenseArray){
	var fp = Ext.getCmp("expensefrm").getForm();
	var sb = Ext.getCmp('expenseStatusbar');
	sb.showBusy('Saving form...');
	fp.getEl().mask();
	fp.submit({
		url:'includes/expenses_ajx.php',
		params:expenseArray,
		success: function(form, action){
			Ext.getCmp("expenseSave").enable();
			var result = Ext.util.JSON.decode(action.response.responseText);
			sb.setStatus({
				text:result.Msg,
				iconCls:'x-status-valid',
				clear: {
					wait: 10000,
					anim: false,
					useDefaults: false
				}
			});
			Ext.getCmp('expensesGrid').store.reload();
			fp.getEl().unmask();
			Ext.getCmp("expense_win").destroy();

			Ext.MessageBox.show({
			   msg: result.Msg
			});
			setTimeout(function(){
				Ext.MessageBox.hide();
			}, 1000);
		},
		failure:function(form, action){
			Ext.getCmp("expenseSave").enable();
			var result = Ext.util.JSON.decode(action.response.responseText);
			sb.setStatus({
				text:result.Msg,
				iconCls:'x-status-error',
				clear: {
					wait: 10000,
					anim: false,
					useDefaults: false
				}
			});
			fp.getEl().unmask();
		}
    });
}

function delete_Expense(expenseid){
	Ext.MessageBox.show({
		title:'Confirm Delete?',
		msg: 'Are you sure want to delete this Expenses?<br><br><br><br>Transaction Password:',
		buttons: Ext.MessageBox.YESNO,
		prompt: true,
		fn: function(btn, text){
			if(btn=="yes"){
				if(Ext.util.Format.trim(text)!=""){
					Ext.Ajax.request({
						url: 'includes/expenses_ajx.php',
						method: 'POST',
						params: {
							todo: 'Delete_Expenses',
							expenseid: expenseid,
							text:text
						},
						success: function(response){
							var result = Ext.util.JSON.decode(response.responseText);

							if(result.success){
								Ext.MessageBox.show({
								   msg: result.Msg,
								   title:'Success',
								   icon:Ext.MessageBox.INFO
								});

								setTimeout(function(){
									Ext.MessageBox.hide();
								}, 1000);
								Ext.getCmp('expensesGrid').getSelectionModel().clearSelections();
								Ext.getCmp("editbut").disable();
								Ext.getCmp("deletebut").disable();
								Ext.getCmp('expensesGrid').store.reload();
							}else{
								Ext.MessageBox.show({
								   msg: result.Msg,
								   title: result.title,
								   icon:Ext.MessageBox.ERROR,
								   buttons: Ext.MessageBox.OK
								});
								if(result.title=="Cannot Exists"){
									Ext.getCmp('expensesGrid').getSelectionModel().clearSelections();
									Ext.getCmp("editbut").disable();
									Ext.getCmp("deletebut").disable();
									Ext.getCmp('expensesGrid').store.reload();
								}
							}
						}
					});
				}
			}
		},
		icon: Ext.MessageBox.WARNING
	});
}