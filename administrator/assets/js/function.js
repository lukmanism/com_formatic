function construct(request, source){    
    var rowid, gettoken, attr_series, fields, title;
    gettoken = token.val();
    attributes  = {};

    switch(source){
        case 'store':
            // store attributes
            $('#formView .rows').removeClass('active');
            rowid       = (typeof rowid == 'undefined')? $('#formView h3').length+1 : rowid;
            options     = request.split('_');
            element     = options[0];
            type        = options[1];
            attributes  = getAttr(type);
            attributes['format'] = request;
            fields      = getRequest(attributes, gettoken, rowid, 'store');
            props       = $.parseJSON(fields);
             
            viewElement(element, type, rowid, request);
            propElement('input', type, rowid, request, props[rowid]);
        break;
        case 'get':
            // get attributes
            options     = request['title'].split('_');
            type        = options[1];
            rowid       = request['parentid'].split('_');
            rowid       = rowid[1];
            readfields  = $.parseJSON(getRequest('', gettoken, rowid, 'get'));
            propElement('input', type, rowid, request['title'], readfields);
        break;
        case 'update':
            // update attributes
            $('#formView .fields').html('');
            rowid       = request['parentid'].split('_');
            title       = request['title'].split('_');
            getRequest(request['properties'], gettoken, rowid[1], 'update');
            fields      = getRequest('', gettoken, rowid[1], 'push');
            readfields  = $.parseJSON(fields);
            $('#formView #row_'+rowid[1]).remove();
            $.each(readfields, function(key, val) {
                options     = val['format'].split('_');
                element     = options[0];
                type        = options[1];
                viewElement(element, type, key, val['format'], val);
            });
            propElement('input', title[1], rowid[1], request['title'], readfields[rowid[1]]);
        break;
        case 'position':
            // update attributes
            $('#formView .fields').html('');
            $('#formProp .fields').html('');
            fields      = getRequest(request, gettoken, null, 'position');
            readfields  = $.parseJSON(fields);
            $.each(readfields, function(key, val) {
                options     = val['format'].split('_');
                element     = options[0];
                type        = options[1];
                viewElement(element, type, key, val['format'], val);
            });
        break;
        case 'load':
            // load views & properties
            $.each(request, function(key, val) {
                options     = val['format'].split('_');
                element     = options[0];
                type        = options[1];
                viewElement(element, type, key, val['format'], val);
                getRequest(val, gettoken, key, 'load');  
            });
        break;
        case 'delete':
            // delete
            $('#formView .fields').html('');
            $('#formProp .fields').html('');
            rowid       = request['parentid'].split('_');
            fields      = getRequest(null, gettoken, rowid[1], 'delete');
            voidfields  = (fields)? $.parseJSON(fields): false;
            if(voidfields){
                $.each(voidfields, function(key, val) {
                    options     = val['format'].split('_');
                    element     = options[0];
                    type        = options[1];
                    viewElement(element, type, key, val['format'], val);
                    getRequest(val, gettoken, key, 'load');
                });                
            }
        break;
    }
    if(fields){
        $("#jform_fields").html(fields);        
    }
}

// View
function viewElement(element, type, rowid, request, thatval){
    var field, hiddenfield;
    var viewContainer   = $(getContainer(rowid, request));
    var formView        = $('#formView .fields');
    var counter         = '<h3>'+rowid+'</h3>';
    var del             = '<div id="del"><div title="Confirm Action?" class="confirm"></div><div title="Delete" class="cancel"></div></div><div class="tempfields" ></div>';
    field               = getFieldView(element, type, thatval);
    formView.append(viewContainer);
    viewContainer.append(counter+del);

    if(typeof field == 'object'){
        $.each(field, function(key, val){
            field = val[0].add(val[1]); // label/ input
            $('.tempfields',viewContainer).append(field);
        });
    } else {
        $('.tempfields',viewContainer).append(field);
    }
}

// Properties
function propElement(element, type, rowid, request, attributes){
    $('#formView .rows').removeClass('active'); 
    $('#formView #row_'+rowid).addClass('active');   
    var type, attributes, field, format, attrType, attrField;
    var propContainer   = $(getContainer(rowid, request));
    var formProp        = $('#formProp .fields');

    formProp.html('');
    propContainer.append('<div class="tempfields"></div>');
    formProp.append(propContainer);

    $.each(attributes, function(key, val) {
        switch(key){
            case 'format':
                element     = 'input';
                thistype    = 'hidden';
            break;
            case 'required':
                element     = 'input';
                thistype    = 'checkbox';     
            break;
            case 'fieldtype':
                element     = 'select';
                thistype    = 'single';
                var fieldType = ['Text', 'Email', 'Phone US', 'Phone Intl', 'Zip Code'];
                $.each(fieldType, function(key, value){
                    var cval    = value.replace(' ', '_').toLowerCase();
                    if(cval === val){
                        fieldType[key] = '}'+value;
                    } 
                });
                val = fieldType;
            break;
            case 'values':
            case 'options':
                element     = 'textarea';
                thistype    = 'textarea';
            break;
            default:
                element     = 'input';
                thistype    = 'text';
            break;
        }
        attrField   = getFieldProp(element, thistype, key, val);
        propContainer.append(attrField);
    });
    propContainer.append('<input type="button" id="apply" value="Apply" disabled="disabled" />');

    //not yet applied
    // validation  = getValidation(type);

    // if(typeof validation != 'undefined'){
    //     attrField   = $(getFieldProp('select', '', 'validation'));
    //     $.each(validation, function(tkey, tval) {
    //         $(attrField[1]).append(new Option(tval[1], tval[0]));
    //     });
    //     propContainer.append(attrField);        
    // }   
}

function getContainer(rowid, request) {
    var container = '<div class="rows" id="row_'+rowid+'" title="'+request+'" />';
    return container;
}

function getFieldProp(field, type, name, value){
            console.log(field, type, name, value);
    var label = $('<label>'+name+'</label>');
    var element;
    switch(field){
        case 'input':
            if(type == 'hidden'){
                element = '<input class="row getterfield" type="'+type+'" />';
            } else {
                element = '<input class="row field" type="'+type+'" />';
            }
        break;
        case 'textarea':
            element = '<textarea class="row field" />';
        break;
        case 'select':
            element = '<select class="row field" />';
        break;
    }
    element = $(element);  
    element.attr('name', name); 

    switch(type){
        case 'textarea':
            element.html(value);
        break;
        case 'single':
            var options = {};
            $.each(value, function(key,val) {
                if(val.indexOf("}") !== -1){
                    val     = val.replace('}','');
                    val2    = val.replace(' ', '_').toLowerCase();
                    options[key] = new Option(val,val2,true);
                } else {
                    opt     = (val != 'Text')? val: '';
                    opt    = val.replace(' ', '_').toLowerCase();
                    options[key] = new Option(val,opt,false);
                }
            });  
            element.append(options);
        break;
        case 'checkbox':
            element.attr('checked', (value == 'true')?true:false);
            element.val(value);
        break;
        default:
            element.val(value);
        break;
    }

    if(type == 'hidden'){
        return element;
    } else {
        return label.add(element);
    }
}

function getFieldView(field, type, attr) {
    var label = '<label>'+type+'</label>';
    var element = {}, elements, labelElements, allElements = {};
    var voidAttr = ['values', 'options', 'format', 'label'];


    switch(field){
        case 'input':
            if(type == 'hidden'){
                element = '<input class="getterfield" type="'+type+'" />';
            } else {
                element = '<input class="field" type="'+type+'" />';
            }
        break;
        case 'textarea':
            element     = '<textarea class="field" />';
        break;
        case 'select':
            element     = '<select class="field" />';
        break;
    } 

    labelElements = $(label);
    if(typeof attr != 'undefined'){
        switch(type){
            case 'checkbox':
            case 'radio':
            left = attr['values'].split("\n");
            right = attr['options'].split("\n");
            $.each(left, function(key, val){
                elements = $(element);
                $.each(attr, function(name, val2){
                    if(voidAttr.indexOf(name) === -1){
                        elements = elements.attr(name, val2);
                    } 
                });
                allElements[key]   = [$(label).html(right[key]), elements.val(val)];
            });          
            break;
            case 'single': 
            left = attr['options'].split("\n");
            right = attr['values'].split("\n");

            var options = {};
            $.each(left, function(key, val) {
                var selected = false;
                elements = $(element);
                if(right[key].indexOf("}") !== -1){
                    right[key] = right[key].replace('}','');
                    var selected = true;
                }
                options[key] = new Option(val,right[key],selected);
            });  
            elements.append(options);
            $.each(attr, function(name, val2){
                if(voidAttr.indexOf(name) === -1){
                    elements = elements.attr(name, val2);
                } else if(name == 'label'){
                    labelElements = labelElements.html(val2);
                }
            });
            allElements[0]   = [labelElements, elements];
            break; 
            default:
                elements = $(element);
                $.each(attr, function(name, val){
                    if(voidAttr.indexOf(name) === -1){
                        elements = elements.attr(name, val);
                    } else if(name == 'label'){
                        labelElements = labelElements.html(val);
                    }
                });
                allElements[0]   = [labelElements, elements];
            break;
        }
    } else {
        allElements[0] = [$(label), $(element)];
    }
    return allElements;
}

function getAttr(type){
    var attribute = {'class':'', 'name':''};    
    switch(type){
        case 'text':
            attribute['id']         = '';
            attribute['label']      = '';
            attribute['value']      = '';
            attribute['size']       = '';
            attribute['maxlength']  = '';
            attribute['required']   = '';
            attribute['fieldtype']  = '';
        break;
        case 'textarea':
            attribute['id']         = '';
            attribute['label']      = '';
            attribute['value']      = '';
            attribute['cols']       = '';
            attribute['rows']       = '';
            attribute['required']   = '';
        break;
        case 'single':
            attribute['id']         = '';
            attribute['label']      = '';
            attribute['size']       = '';
            attribute['options']    = '';
            attribute['values']     = '';
            attribute['required']   = '';
        break;
        case 'radio':
        case 'checkbox':
            attribute['label']      = '';
            attribute['options']    = '';
            attribute['values']     = '';
            attribute['required']   = '';
        break;
        case 'button':
        case 'submit':
        case 'reset':
            attribute['id']         = '';
            attribute['value']      = '';
        break;
    }
    return attribute;
}

function constructOption(target, thatval, chainselect, rowid) { 
    $("option", target).remove();
    var index = rowid.split("_");
    index = index[1];
    var defaultSelected = false;
    var options = thatval.split("\n");
    options = getUnique(options);

    var i=0;
    var count;
    if(chainselect){
        // append container
        $('.selections.prop_'+index[0]).remove();
        var selections = '<div id="prop_'+index[0]+'" class="selections" title="select_chain"></div>';
        $('#formProp .fields').append(selections);
    }

    $(target).append(new Option('Please Select...',''));    
    $.each(options, function(val, val) {
        if(val != ''){
            // focus selected value
            if(val.indexOf("{SELECTED}") !== -1){
                val = val.replace('{SELECTED}','');
                var defaultSelected = true;
            }
            if(chainselect){
                index = i++;
                $(target).append(new Option(val,index,defaultSelected));
                // clone options properties
                var clone = '<label for="'+val+'">'+val+'</label><textarea name="option'+ index +'" class="field"></textarea>';
                $('.selections').append(clone);
            } else {
                // construct <options>
                $(target).append(new Option(val,val,defaultSelected));
            }
        }
    });

    // construct chain select array
    $(document).on("change", ".selections", function(){ 
        window.chain_sel = new Array();
        $('.property[name]', this).each(function(){
            var chain_val = $(this).attr('value').split("\n");
            if(chain_val != ''){
                chain_sel.push(chain_val);
            }
        });
    }); 

    // reconstruct <options> according to selection
    $(document).on("change", "#cselect0", function(){ 
        $('#cselect1 option').remove();
        var val = $(this).val();
        $('#cselect1').append(new Option('Please Select...',''));        
        $.each(window.chain_sel[val], function(val, val) {
            $('#cselect1').append(new Option(val,val));
        });
    });

}   

// Applied to Select & Chain Select values
function getUnique(a) {
    var b = [a[0]], i, j, tmp;
    for (i = 1; i < a.length; i++) {
        tmp = 1;
    for (j = 0; j < b.length; j++) {
        if (a[i] == b[j]) { tmp = 0; break; }
    }
    if (tmp) { b.push(a[i]); }
    }
    return b;
}

function getRequest(attribute, gettoken, rowid, method) {
    var pushdata;
    $.ajax({
            type: "POST",
            url: "components/com_formatic/assets/js/temp.js.php?method="+method+"&token="+gettoken+"&row="+rowid,
            data: attribute,
            async : false
        }).done(function(data) {
            pushdata = data;
    });        
    return pushdata;
}