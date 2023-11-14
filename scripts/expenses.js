function showAccountHeads(){	
	// var aheadStore =  new Ext.data.Store({
	// 	proxy: new Ext.data.HttpProxy({
	// 			url:'includes/expenses_ajx.php',
	// 			method:'POST'
	// 		}),
	// 		reader: new Ext.data.JsonReader({
	// 			root: 'AHEAD',
	// 			totalProperty: 'totalCount',
	// 			id: 'accountHeadId'
	// 		}, [
	// 			{name: 'accountHeadId',mapping: 'accountHeadId'},
	// 			{name: 'accountHeadName',mapping: 'accountHeadName'}				
	// 		]),
	// 	baseParams :{todo:'AccountHead_List'}
	// });
	
	Ext.define('aheadData', {
		extend: 'Ext.data.Model',
			fields: [
				{name: 'accountHeadId',mapping: 'accountHeadId'},
				{name: 'accountHeadName',mapping: 'accountHeadName'}
		    ],
		idachead: 'accountHeadId'
	});

	var aheadStore = Ext.create('Ext.data.JsonStore', {
        id: 'aheadStore',
        model: 'aheadData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/expenses_ajx.php',
            extraParams: {
				todo : 'AccountHead_List'
            },
            reader: {
				type: 'json',
                root: 'AHEAD',
                totalProperty: 'totalCount',
				id: 'accountHeadId'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'accountHeadName',
            direction: 'ASC'
        }]
    });

	var aheadCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{header: "AccoutnHead ID", width: 35, sortable: true, dataIndex: 'accountHeadId',resizable: false,menuDisabled:true,hideable:false,hidden:true},
		{header: 'Account Head',width: 200,sortable: true,dataIndex: 'accountHeadName',resizable: true}	
	];	    
    

	var loadTabPanel = Ext.getCmp('SAdminPanelAccountHeads');
	loadTabPanel.add({
		id:'aheadGrid',
		xtype: 'grid',
		layout: 'fit',
		enableColumnHide:false,
		enableColumnMove:false,
		autoScroll:true,
		loadMask: true,
		store: aheadStore,
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
		viewConfig: { forceFit:true },
		columns: aheadCol,
		stripeRows: true,
		tbar:new Ext.Toolbar({
			items:[{
				text:'&#160;Add New Account Head',
				icon: './images/table_add.png',
				cls: 'x-btn-bigicon',
				ctCls:'y-toolbar',
				handler:function(){
					var aheadArray = new Array();
					aheadArray["todo"]="Add_AccountHead";
					aheadArray["titleStr"]="Add Account Head";
					for(var i=0;i<=1;i++){ aheadArray[i]=""; }
					add_edit_Ahead(aheadArray);
				}
			},'-',{
				text:'&#160;Edit Account Head',
				id:'editbut',
				qtip:"Edit/Change the selected Account Head",
				icon: './images/edit_btn.gif',
				cls: 'x-btn-bigicon',
				ctCls:'y-toolbar',
				disabled:true,
				handler:function(){
					var aheadArray = new Array();
					aheadArray["todo"]="Update_AccountHead";
					aheadArray["titleStr"]="Update AccountHead";

					var record = Ext.getCmp("aheadGrid").getSelectionModel().getSelection();
					if(record){
						aheadArray['accountHeadId'] = record[0].get("accountHeadId");
						aheadArray[0] = record[0].get("accountHeadName");
						add_edit_Ahead(aheadArray);
					}
				}
			},'-',{
				text:'&#160;Delete Account Head',
				id:'deletebut',
				qtip:'Delete the selected Account Head',
				icon: './images/delete.png',
				cls: 'x-btn-bigicon',
				ctCls:'y-toolbar',
				disabled:true,
				handler:function(){
					var record = Ext.getCmp("aheadGrid").getSelectionModel().getSelection();
					if(record){
						var accountHeadId = record[0].get("accountHeadId");
						var accountHeadName = record[0].get("accountHeadName");
						delete_Ahead(accountHeadId,accountHeadName);
					}
				}
			}]
		}),
		bbar: new Ext.PagingToolbar({
			id:'aheadGridPbar',
			pageSize: 200,
			store: aheadStore
		}),
		listeners:{
			'selectionchange':function(selmod, record, opt){
				try{
					if(record[0].get("accountHeadId")!=0){
						Ext.getCmp("editbut").enable();
						Ext.getCmp("deletebut").enable();						
					}
				}
				catch (e){
				}
			}
		}
	}).show();
	// loadTabPanel.setTitle("Account Head Details");
	loadTabPanel.doLayout();
    aheadStore.load();
}
function add_edit_Ahead(aheadArray){
	var ahead_win = new Ext.Window({
		title: aheadArray["titleStr"],
		width: 450,
		height:130,
		layout: 'fit',
		id:'ahead_win',
		loadMask:true,
		modal:true,
		border:false,
		shadow:true,
		closable:true,
		resizable:false,
		//frame:true,
		//closeAction:'hide',
		buttonAlign:'right',
		defaults:{
			//bodyStyle:'padding:5px;background-color:#f7f7f7;',
			labelSeparator:''
		},
		items:[new Ext.FormPanel({
				labelWidth: 130,
				id:'aheadfrm',
				fileUpload: true,
				border:false,
				defaults:{
					msgTarget: 'side',
					labelSeparator:''
				 },
				items: [{
					xtype:'textfield',
					fieldLabel: 'Account Head Name',
					name: 'accountHeadName',
					id: 'accountHeadName',
					anchor:'90%',
					maxLength:100,
					blankText: 'Account Head Name is required',
					allowBlank:false,
					vtype:'cityVal',
					listeners:{
						render:function(){ 
							if(aheadArray[0]!="") 
								this.setValue(aheadArray[0]);
						}
					}
				}]
			})
		],
		buttons: [{
			text   : aheadArray['todo'] == "Update_AccountHead"?'Update':'Save',
			iconCls: 'save',
			id:'aheadSave',
			handler:function(){						
				var fp = Ext.getCmp("aheadfrm").getForm();
				if(fp.isValid()){
					Ext.getCmp("aheadSave").disable();
					Ahead_formSubmit(aheadArray);
				}
			}
		},{
			text   : 'Cancel',
			handler  : function(){
				if(Ext.get("aheadStatusbar_sBar"))
					Ext.get("aheadStatusbar_sBar").dom.style.visibility="hidden";
				ahead_win.destroy();
			}
		}]
	});
    ahead_win.show();
}

function Ahead_formSubmit(aheadArray){
	var fp = Ext.getCmp("aheadfrm").getForm();
	fp.submit({
		url:'includes/expenses_ajx.php',
		params:aheadArray,
		success: function(form, action){			
			Ext.getCmp("aheadSave").enable();
			Ext.getCmp('aheadGrid').getStore().loadPage(1);
			Ext.getCmp("ahead_win").destroy();

			Ext.MessageBox.show({
			   msg: action.result.Msg
			});
			setTimeout(function(){
				Ext.MessageBox.hide();
			}, 1000);
		},
		failure:function(form, action){
			Ext.getCmp("aheadSave").enable();

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

function delete_Ahead(accountHeadId,accountHeadName){
	var msgbox = Ext.MessageBox.show({
		title:'Confirm Delete?',
		msg: 'Are you sure want to delete the Account Head <b>'+accountHeadName+'?<br><br>Transaction Password:',
		buttons: Ext.MessageBox.YESNO,
		prompt: true,
		fn: function(btn, text){
			if(btn=="yes"){
				if(Ext.util.Format.trim(text)!=""){
					Ext.Ajax.request({
						url: 'includes/expenses_ajx.php',
						method: 'POST',
						params: {
							todo: 'Delete_AccountHead',
							accountHeadId: accountHeadId,
							text:text
						},
						success: function(response){
							var result = Ext.decode(response.responseText); //Ext.util.JSON.decode(response.responseText);

							if(result.success){
								Ext.MessageBox.show({
								   msg: result.Msg,
								   title:'Success',
								   icon:Ext.MessageBox.INFO
								});

								setTimeout(function(){
									Ext.MessageBox.hide();
								}, 1000);
								Ext.getCmp('aheadGrid').getSelectionModel().clearSelections();
								Ext.getCmp("editbut").disable();
								Ext.getCmp("deletebut").disable();
								Ext.getCmp('aheadGrid').store.reload();
							}else{
								Ext.MessageBox.show({
								   msg: result.Msg,
								   title: result.title,
								   icon:Ext.MessageBox.ERROR,
								   buttons: Ext.MessageBox.OK
								});
								if(result.title=="Not Exists"){
									Ext.getCmp('aheadGrid').getSelectionModel().clearSelections();
									Ext.getCmp("editbut").disable();
									Ext.getCmp("deletebut").disable();
									Ext.getCmp('aheadGrid').store.reload();
								}
							}
							Ext.getCmp('aheadGrid').getStore().loadPage(1);
						}
					});
				}
			}
		},
		icon: Ext.MessageBox.WARNING
	});	
	//show the prompt text field as password field
	msgbox.textField.inputEl.dom.type = 'password';
}