function showSettings(){
	if(Ext.getCmp("SAdminPanelSettingsGrid")){
		Ext.getCmp("SAdminPanelSettings").setActiveTab("SAdminPanelSettingsGrid");
		return false;
	}
	var loadTabPanel = Ext.getCmp('SAdminPanelSettings');
	loadTabPanel.add({
		id:'CPanelSettingsGrid',
		layout:'column',
		border:false,
		autoScroll:true,
		defaults: {
			layout: 'anchor',
			defaults: {
				anchor: '100%'
			}
		},
		items:[
			{
				columnWidth:.33,
				baseCls:'x-plain',
				bodyStyle:'padding:5px',
				height:200,
				items:[{
					xtype:'form',
					title:'Change Password',
					id:'pwd_chng_form',
					height:160,
					frame:true,
					items:[{
						xtype: 'container',
						width:350,
						height:100,
						border:false,
						layout:{
							type:'anchor'
						},
						style:'padding-left:5px;padding-right:15px',
						items: [{
							xtype: 'textfield',
							fieldLabel:'Current password',
							id:'old_pwd',
							name:'old_pwd',
							//flex:0,
							//width:10,
							inputType: 'password',
							allowBlank:false,
							emptyText:'Enter Current Password',
							blankText:'Please enter your old password',
							anchor:'100%',
							listeners:{
								afterrender:function(){
								}
							}
						},{
							xtype: 'textfield',
							fieldLabel:'New password',
							id:'new_pwd',
							name:'new_pwd',
							//flex:0,
							inputType: 'password',
							allowBlank:false,
							minLength:8,
							emptyText:'Enter new password',
							blankText:'Please enter your new password',
							anchor:'100%',
							listeners:{
								afterrender:function(){
								}
							}
						},{
							xtype: 'textfield',
							fieldLabel:'Confirm Password',
							id:'new_pwd2',
							name:'new_pwd2',
							inputType: 'password',
							allowBlank:false,
							minLength:8,
							emptyText:'Confirm password',
							blankText:'Please re-enter your password',
							anchor:'100%',
							listeners:{
								afterrender:function(){
								}
							}
						}]
					}],
				buttons:[{
					xtype:'button',
					scale: 'small',
					//buttonAlign:'right',
					//style:'margin-top:-3px;',
					id:'pwd_id',
					text:'Update',
					icon:'./images/save_btn_image.png',
					handler:function(){
						var formPanel = Ext.getCmp('pwd_chng_form').getForm();
						var oldpwd = Ext.getCmp('old_pwd').getValue();
						var newpwd = Ext.getCmp('new_pwd').getValue();
						var cnfmpwd = Ext.getCmp('new_pwd2').getValue();
						if(formPanel.isValid()){
							if(newpwd!=cnfmpwd){
								Ext.Msg.alert('INFO', "New Password and Re-entered Password not matched..");
								Ext.getCmp('new_pwd').reset();
								Ext.getCmp('new_pwd2').reset();
								return false;
							}
							var formMask 	= Ext.getCmp("pwd_chng_form");
							formMask.getEl().mask("Changing Password...");
							formPanel.submit({
								clientValidation: true,
								url: 'includes/dashboard_ajx.php',
								params: {
									todo: 'Change_Password'
								},
								success: function(form, action) {
									
									if(action.result.success==true)
									{
										Ext.Msg.alert('Success', action.result.msg);
										formMask.getEl().unmask();
										formPanel.reset();
									}
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
								   formMask.getEl().unmask();
								   formPanel.reset();
								} 
							});
						}
						//chnge_pwd();
					}
				}]
				}]
			},
			{
				columnWidth:.33,
				baseCls:'x-plain',
				bodyStyle:'padding:5px',
				height:200,
				items:[
					{
						xtype:'form',
						title:'Backup Data',
						id:'backupDataForm',
						height:160,
						frame:true,
						bodyStyle:'background-color:#f7f7f7',
						layout:'column',
						items:[
							{
								columnWidth:.33,
								baseCls:'x-plain',
								// bodyStyle:'padding:5px',
								height:200,							
								items:[
									{
										xtype: 'container',
										width:350,
										height:100,
										border:false,
										layout:{
											type:'anchor'
										},
										style:'padding-left:5px;padding-right:15px',
										items: [
											{
												xtype: 'image',
												fieldLabel:'',
												src:'./images/backuptools.jpg',
												height:100
											}
										]
									}
								]							
							},
							{
								columnWidth:.67,
								baseCls:'x-plain',
								bodyStyle:'padding:5px',
								height:200,							
								items:[
									{
										xtype: 'container',
										width:350,
										height:100,
										border:false,
										layout:{
											type:'anchor'
										},
										style:'padding-left:5px;padding-right:15px',
										items: [
											{
												xtype: 'label',
												fieldLabel:'',
												html:'Backup your data regularly to avoid<br/>accidental data loss.<br/><br/><b class="tableTextM">Note:</b> Kindly note that the developers are<br/>not responsible for any data loss occured'
											}
										]
									}
								]									
							}
						],								
						buttons:[
							{
								xtype:'button',
								text:'Backup Images',
								icon:'./images/images.png',
								handler:function(){
									Ext.Msg.alert("Info","To backup guest photos and ID/Address proofs, open the folders <b>guestsPhotos</b> and <b>guestsProofs</b> and copy them to some location.<br/><br/><b class='tableTextM'>Note:</b> As the total size of the images are too big, the download option is restricted here")
								}
							},
							'->',
							{
								xtype:'button',
								scale: 'small',
								//buttonAlign:'right',
								//style:'margin-top:-3px;',
								id:'backupBtn',
								text:'Backup dB',
								icon:'./images/backup.png',
								handler:function(){
							        Ext.Ajax.request({
							            url: './dbbackup/backup_db.php',
							            method: 'POST',
							            params : {
											todo : 'BACKUPDB'
							        	},
							            success: function(response) {
							                var result = Ext.decode(response.responseText);
							                if (result.success) {
							                	//Ext.Msg.alert("Info",result.msg);
							                	////download the file
									            Ext.DomHelper.append(document.body, {
									                   tag: 'iframe',
									                   frameBorder: 0,
									                   width: 0,
									                   height: 0,
									                   css: 'display:none;visibility:hidden;height:1px;',
									                   src: 'download.php?obj='+result.msg
									           });  									
							                } else {
							                    Ext.Msg.alert("Info",result.msg);
							                }
							            }
							        });

								}
							}
						]
					}
				]
			},
			{
				columnWidth:.33,
				baseCls:'x-plain',
				bodyStyle:'padding:5px',
				height:200,
				items:[
					{
						xtype:'form',
						title:'Restore Data',
						id:'restoreDataForm',
						name:'restoreDataForm',
						height:160,
						frame:true,
						bodyStyle:'background-color:#f7f7f7',
						layout:'column',
						items:[
							{
								columnWidth:.33,
								baseCls:'x-plain',
								// bodyStyle:'padding:5px',
								height:200,							
								items:[
									{
										xtype: 'container',
										width:350,
										height:100,
										border:false,
										layout:{
											type:'anchor'
										},
										style:'padding-left:5px;padding-right:15px',
										items: [
											{
												xtype: 'image',
												fieldLabel:'',
												src:'./images/restorebig.png',
												height:96
											}
										]
									}
								]							
							},
							{
								columnWidth:.67,
								baseCls:'x-plain',
								bodyStyle:'padding:5px',
								height:200,							
								items:[
									{
										xtype: 'container',
										width:350,
										height:100,
										border:false,
										layout:{
											type:'anchor'
										},
										style:'padding-left:5px;padding-right:15px',
										items: [
											{
												xtype: 'filefield',
												fieldLabel:'',
												id:'backupfile',
												name:'backupfile',
												width: 200,
												emptyText:'Select backup File...',
												buttonText: 'Select',
												allowBlank:false,
												validator: function(v){
													if(!/\.sql$/.test(v)){
												    	return 'Only db backup files with .sql extension allowed';
												    }
												    return true;
												}										        
											}
											// ,
											// {
											// 	xtype: 'label',
											// 	fieldLabel:'',
											// 	// layout:'fit',
											// 	style:'font:normal 8px',
											// 	html:'Be cautious while restoring the data. Select the right backup file to restore the data<br/><br/><b class="tableTextM">Note:</b> We took care on restoring the data at all possible steps. However developers are not responsible for unexpected errors, data loss occured'												
											// }
										]
									}
								]									
							}
						],								
						buttons:[							
							{
								xtype:'button',
								scale: 'small',
								//buttonAlign:'right',
								//style:'margin-top:-3px;',
								id:'restoreBtn',
								text:'Restore dB',
								icon:'./images/restore.png',
								handler:function(){
									var formPanel = Ext.getCmp('restoreDataForm').getForm();
									if( formPanel.isValid() ){
										var msgbox = Ext.MessageBox.show({
											title:'Warning!!!',
											msg: 'Be cautious while restoring the data. Select the right backup file to restore the data<br/><br/><b class="tableTextM">Note:</b> We took care on restoring the data at all possible steps. However developers are not responsible for unexpected errors, data loss occured<br><br>Transaction Password:',
											buttons: Ext.MessageBox.YESNO,
											prompt: true,
											fn: function(btn, text){
												if(btn=="yes"){
													if(Ext.util.Format.trim(text)!=""){
														Ext.getCmp("restoreDataForm").getEl().mask("Restoring Data. Pls wait it will take sometime based on the size of your backup data");
														formPanel.submit({
															clientValidation: true,
															url: './dbbackup/backup_db.php',
															params: {
																todo: 'RESTOREDB',
																text:text
															},
															success: function(form, action) {
																Ext.getCmp("restoreDataForm").getEl().unmask();
																Ext.Msg.alert('Success', action.result.msg);												
															},
															failure: function(form, action) {
																Ext.getCmp("restoreDataForm").getEl().unmask();
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
											icon: Ext.MessageBox.WARNING
										});	
										//show the prompt text field as password field
										msgbox.textField.inputEl.dom.type = 'password';

									}



								}
							}
						]
					}
				]
			}
		]
	}).show();
	loadTabPanel.doLayout();
}