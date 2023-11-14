/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */

// Add the additional 'advanced' VTypes
Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {
        var date = field.parseDate(val);
        //alert(date+field);
        if(!date){
            return;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    },

    alphaspacedotText : "This field should only contain Dot,Space,letters and numbers",
    alphaspacedotRe : /^[a-zA-Z0-9][. a-zA-Z0-9-]{0,254}$/,
    alphaspacedot : function(v){
        return this.alphaspacedotRe.test(v);
    },

    fnnameValText : "This field should only contain Dot,Space,Hypen,letters and numbers",
    fnnameValRe : /^[a-zA-Z0-9][ a-zA-Z0-9.-@]{0,254}$/,
    fnnameVal : function(v){
        return this.fnnameValRe.test(v);
    },

    codeValText : "This field should only contain Hypen,letters and numbers",
    codeValRe : /^[a-zA-Z0-9][a-zA-Z0-9-/]{0,254}$/,
    codeVal : function(v){
        return this.codeValRe.test(v);
    },

    cityValText : "This field should only contain Space and letters",
    cityValRe : /^[A-Za-z\s]+$/,
    cityVal : function(v){
        return this.cityValRe.test(v);
    },

    nameValText : "This field should only contain Space and letters",
    nameValRe : /^[A-Za-z\s]+$/, // /^[a-zA-Z ][ a-zA-Z]$/,
    nameVal : function(v){
        return this.nameValRe.test(v);
    },   

    addressValText : "This field should only contain Space and letters",
    addressValRe : /^[a-zA-Z][ a-zA-Z]$/,
    addressVal : function(v){
        return this.addressValRe.test(v);
    },        

    alphanumhypText : "This field should only contain Hypen,letters and numbers",
    alphanumhypRe : /^[a-zA-Z0-9][-a-zA-Z0-9]{0,254}$/,
    alphanumhyp : function(v){
        return this.alphanumhypRe.test(v);
    },
	
	exeproofText : "This field should only contain Hypen,letters,Slashes and numbers",
    exeproofRe : /^[a-zA-Z0-9][-a-zA-Z0-9/]{0,254}$/,
    exeproof : function(v){
        return this.alphanumhypRe.test(v);
    },

    charspaceText :"This field should only contain letters and Space",
    charspaceRe : /^[a-zA-Z][a-zA-Z]{0,254}$/,
    charspace : function(v){
        return this.charspaceRe.test(v);
    },

    phoneText :"phone number should contain only numbers",
    phoneRe : /(^\+[0-9-]+$)|(^[0-9-]+$)/,
    phoneVal : function(v){
        if(v.length <= 1 || v.length >15 || isNaN(v))
            return false
        else
            return this.phoneRe.test(v);
    },

    mobilevalText :"Invalid Mobile Number",    
    //mobilevalRe : /(^((^[0])[9]{1})|((^[9])[0-9]{1})[0-9-]+$)/,
    mobilevalRe : /(^((^[9|8|7])[0-9]{9})+$)/,
    mobileval : function(v){
            if(v.length < 1 || v.length > 10 )
                return false;
            else
                return this.mobilevalRe.test(v);
    },

    //Ext.form.VTypes["phone"] = /^(\d{3}[-]?){1,2}(\d{4})$/;
    //Ext.form.VTypes["phoneMask"] = /[\d-]/;
    //Ext.form.VTypes["phoneText"] = 'Not a valid phone number. Must be in the format 123-4567 or 123-456-7890 (dashes optional)';



    numbersText: "Only numbers are allowed.",
    numbersRe : /^[0-9]+$/,
    numbers :  function(v){
        return this.numbersRe.test(v);
    },

    numericText: "Only numbers are allowed.",
    numericMask: /[0-9]/,
    numericRe: /(^-?dd*.d*$)|(^-?dd*$)|(^-?.dd*$)/,
    numeric :function (v) {
        return this.numericRe.test(v);
    } ,

    decNumText: "Only decimal numbers are allowed.",
    decNumMask: /(d|.)/,
    decNumRe: /d+.d+|d+/,
    decNum : function (v) {
        return this.decNumRe.test(v);
    },

    password : function(val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    passwordText : 'Passwords do not match'

});

Ext.override(Ext.form.TextField, {
    validator:function(text){
        if(this.allowBlank==false && Ext.util.Format.trim(text).length==0)
          return false;
        else
          return true;
    }
});

/*Ext.onReady(function(){


    var dr = new Ext.FormPanel({
      labelWidth: 125,
      frame: true,
      title: 'Date Range',
      bodyStyle:'padding:5px 5px 0',
      width: 350,
      defaults: {width: 175},
      defaultType: 'datefield',
      items: [{
        fieldLabel: 'Start Date',
        name: 'startdt',
        id: 'startdt',
        vtype: 'daterange',
        endDateField: 'enddt' // id of the end date field
      },{
        fieldLabel: 'End Date',
        name: 'enddt',
        id: 'enddt',
        vtype: 'daterange',
        startDateField: 'startdt' // id of the start date field
      }]
    });

    dr.render('dr');



    var pwd = new Ext.FormPanel({
      labelWidth: 125,
      frame: true,
      title: 'Password Verification',
      bodyStyle:'padding:5px 5px 0',
      width: 350,
      defaults: {
        width: 175,
        inputType: 'password'
      },
      defaultType: 'textfield',
      items: [{
        fieldLabel: 'Password',
        name: 'pass',
        id: 'pass'
      },{
        fieldLabel: 'Confirm Password',
        name: 'pass-cfrm',
        vtype: 'password',
        initialPassField: 'pass' // id of the initial password field
      }]
    });

    pwd.render('pw');
});*/
