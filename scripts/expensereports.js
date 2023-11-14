/**
 * expensereports.js
 *
 **/
 function showexpensesReports(){

    if(Ext.getCmp("expensesReportsGrid")){
        Ext.getCmp("SAdminPanelexpensesReports").setActiveTab("expensesReportsGrid");
        return false;
    }   
    Ext.define('expensesReportsData', {
        extend: 'Ext.data.Model',
            fields: [
                {name: 'expensesId',mapping: 'expensesId'},
                {name: 'date',mapping: 'date'},
                {name: 'accountHeadId',mapping: 'accountHeadId'},
                {name: 'accountHeadName',mapping: 'accountHeadName'},
                {name: 'description',mapping: 'description'},
                {name: 'amount',mapping: 'amount',type:'float'},
                {name: 'addedBy',mapping: 'addedBy'},
                {name: 'addedOn',mapping: 'addedOn'}
            ],
        idvehicle: 'expensesId'
    }); 
    var expensesReportsStore = Ext.create('Ext.data.JsonStore', {
        id: 'expensesReportsStore',
        model: 'expensesReportsData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
            actionMethods: {
                read: 'POST'
            },
            url: './includes/expenses_ajx.php',
            extraParams: {
                todo : 'Get_Expenses_Report',
                //devtype:'VTS'
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
    var expensesCol = [ Ext.create('Ext.grid.RowNumberer'),
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

    function onItemClick(item){
        var menu_id   = item.id;
        var searchFor ="";
        var todo = "";

        var startdate = Ext.getCmp("expensefromDate").getValue();
        var enddate   = Ext.getCmp("expensetoDate").getValue();

        if(startdate=="" || startdate == null){
            Ext.Msg.alert("INFO","Please select the Start Date");
            return false;
        }

        if(enddate=="" || enddate == null){
            Ext.Msg.alert("INFO","Please select the End Date");
            return false;
        }

        startdate   = Ext.util.Format.date(startdate, "Y-m-d");
        enddate     = Ext.util.Format.date(enddate, "Y-m-d");     

        if(menu_id.indexOf("view")!=-1) {
            var fromDate  = Ext.getCmp("expensefromDate").getRawValue();
            var toDate  = Ext.getCmp("expensetoDate").getRawValue();
            var expenseReportfilteraccountHeadId = Ext.getCmp('expenseReportfilteraccountHeadId').getValue();

            expensesReportsStore.baseParams = {todo:'Get_Expenses_Report',acchead:expenseReportfilteraccountHeadId,startdate:startdate,enddate:enddate, start:0, limit:30};
            expensesReportsStore.load({params:{todo:'Get_Expenses_Report',acchead:expenseReportfilteraccountHeadId,startdate:startdate,enddate:enddate, start:0, limit:30}});
        }
        if(menu_id.indexOf("excel")!=-1) {
            Ext.DomHelper.append(document.body, {
                   tag: 'iframe',
                   frameBorder: 0,
                   width: 0,
                   height: 0,
                   css: 'display:none;visibility:hidden;height:1px;',
                   src: 'includes/expenses_ajx.php?todo=GenXL_Get_Expenses_Report&startdate='+startdate+'&enddate='+enddate+'&acchead='+expenseReportfilteraccountHeadId
           });          
        }
    }   

    var loadTabPanel = Ext.getCmp('SAdminPanelexpensesReports');
    loadTabPanel.add({
        id:'expensesReportsGrid',
        xtype: 'grid',
        enableColumnHide:false,
        enableColumnMove:false,
        layout: 'fit',
        autoScroll:true,
        loadMask: true,
        store:expensesReportsStore,
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
        tbar:[
            {
                xtype: 'datefield',
                fieldLabel:'From Date',
                name:'expensefromDate',
                id:'expensefromDate',
                labelSeparator:'',
                labelWidth:60,
                width:180,
                editable:false,
                labelAlign: 'right',
                // labelStyle: 'width: auto',               
                format: 'Y/m/d',
                altFormat:'Y-m-d|Y.m.d',
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
                name:'expensetoDate',
                id:'expensetoDate',
                format: 'Y/m/d',
                altFormat:'Y-m-d|Y.m.d',
                listeners:{
                    afterrender:function(){
                    }
                }
            },
            {
                xtype:'combo',
                fieldLabel: 'Account Head',
                displayField: 'accountHeadName',
                name: 'expenseReportfilteraccountHeadId',
                id:'expenseReportfilteraccountHeadId',
                valueField: 'accountHeadId',
                mode: 'remote',
                emptyText:'Select AccountHead...',
                editable :false,
                labelAlign: 'right',
                labelSeparator:'',
                hiddenName: 'expenseReportfilteraccountHeadId',
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
                            Ext.getCmp('expenseReportfilteraccountHeadId').getStore().load();
                        
                    }
                }
            },
            // {
            //  xtype:'datefield',
            //  fieldLabel: "Filter By Date",
            //  format: 'Y/m/d',
            //  altFormat:'Y/m/d|Y.m.d',
            //  name: 'filterDate',
            //  id: 'filterDate',
            //  labelSeparator:'',
            //  // anchor:'70%',
            //  labelWidth:70,
            //  width:180,
            //  allowBlank:false,                   
            //  blankText:'Expense Date is Required'
            // },
            {
                xtype:'button',
                icon:'./images/view.png',
                cls: 'x-btn-bigicon',
                text:'View Expenses',
                menuAlign:'bl',
                menu: [
                    {text: 'View', icon:'./images/view.png', floating: false, handler: onItemClick, id:'viewExpenses'},
                    {text: 'Generate Excel',icon:'./images/excel.png', floating: false, handler: onItemClick, id:'excelExpenses'}
                ]   
                // handler:function(){
                //  var filterDate  = Ext.getCmp("fromDate").getRawValue();
                //  var filterDate  = Ext.getCmp("toDate").getRawValue();
                //  var expenseReportfilteraccountHeadId = Ext.getCmp('expenseReportfilteraccountHeadId').getValue();
                //  expensesReportsStore.baseParams = {acchead:expenseReportfilteraccountHeadId,scexdate:filterDate, start:0, limit:30};
                //  expensesReportsStore.load({params:{acchead:expenseReportfilteraccountHeadId,scexdate:filterDate, start:0, limit:30}});
                // }
            }           
        ],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            id:'expensesGridPbar',
            store: expensesReportsStore,
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
                    if(record[0].get("expensesId")!=0){
                        Ext.getCmp("expenseEditButton").enable();
                        Ext.getCmp("expensesDelButton").enable();
                    }
                }
                catch (e){
                }
            },
            afterrender:function(){
                Ext.getCmp("expensesReportsGrid").getEl().mask("Loading Expenses...");
                // var curdate = Ext.util.Format.date(new Date(),"d-m-Y");
                // expensesReportsStore.load({params:{start:0, limit:20,scexdate:curdate}});                
                expensesReportsStore.load({
                    callback: function() {
                        Ext.getCmp("expensesReportsGrid").getEl().unmask();
                    }
                });
            }

        }
    }).show();
    loadTabPanel.doLayout();
}

 