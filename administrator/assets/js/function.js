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
            // load views
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
// console.log(element, type, rowid, request, thatval);
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
    var type, attributes, field, format;
    var propTainer  = $(getContainer(rowid, request));
    var formProp    = $('#formProp .fields');
    var tempfields  = $('<div class="tempfields"></div>');
    var apply       = $('<input type="button" id="apply" value="Apply" disabled="disabled" />');


    formProp.html('');
    formProp.append(propTainer);

    $.each(attributes, function(key, val) {
                // console.log(key, val);
        switch(key){
            case 'format':
                propTainer.append(getFieldProp('input', 'hidden', key, val));
            break;
            case 'required':
                propTainer.append(getFieldProp('input', 'checkbox', key, val));  
            break;
            case 'fieldtype':
                var fieldType = ['Text', 'Email', 'Phone US', 'Phone Intl', 'Zip Code'];
                $.each(fieldType, function(key2, val2){
                    var cval    = vared(val2);
                    if(cval === val){
                        fieldType[key2] = '}'+val2;
                    } 
                });
                propTainer.append(getFieldProp('select', 'single', key, fieldType));
            break;
            case 'values':
            case 'options':
            case 'html':
                propTainer.append(getFieldProp('textarea', 'textarea', key, val));
            break;
            case 'labels':
                propTainer.append(getFieldProp('textarea', 'labels', key, val));
            break;
            case 'coptions':
                var elements = getFieldProp('textarea', 'chainselect', key, val);
                var tempoptions = $('<div class="tempoptions"/>');

                $(tempoptions).append(elements);  
                $(tempfields).append(tempoptions); 
                // console.log(key, thiscount++);
            break;
            case 'cvalues':
                var elements = {};
                var tempvalues = $('<div data-title="" class="tempvalues"/>');
                $.each(val, function(key3, val3){
                    $.each(val3, function(key4, val4){
                        elements[key4] = getFieldProp('textarea', 'textarea', key4, val3[key4]);
                        $(elements[key4][0]).html(key3+' > '+key4);
                        $(elements[key4][1]).prop('name', 'cvalues['+key3+']['+key4+']');
                        tempvalues.append(elements[key4]);
                        $(".tempoptions", tempfields).append(tempvalues);
                    });
                    tempvalues.addClass(key3).attr('data-title', key3);
                });                
            break;
            default:
                propTainer.append(getFieldProp('input', 'text', key, val));
            break;
        }
    });
    propTainer.append(tempfields).append(apply);
}


function getFieldProp(field, type, name, value){
    // console.log(field, name, type, value);
    var elements;
    var element = $(getElement(field,type)); 
    var label = $('<label>'+name+'</label>');

    switch(type){
        case 'textarea':
            element.html(value).prop('name', name);
            elements = label.add(element);
        break;
        case 'labels':
            element.html(value).prop('name', name);
            element.attr('rows', 2);
            elements = label.add(element);
        break;
        case 'single':
            var options = {};
            $.each(value, function(key,val) {
                if(val.indexOf("}") !== -1){
                    val     = val.replace('}','');
                    val2    = vared(val);
                    options[key] = new Option(val,val2,true);
                } else {
                    opt     = (val != 'Text')? val: '';
                    opt     = vared(val);
                    options[key] = new Option(val,opt,false);
                }
            });  
            element.append(options);
            elements = label.add(element);
        break;
        case 'checkbox':
            element.attr('checked', (value == 'true')?true:false);
            element.val(value).prop('name', name);
            elements = label.add(element);
        break;
        case 'hidden':
            elements = element.val(value).prop('name', name);
        break;
        case 'chainselect':
        var tempelements = {};
        $.each(value, function(key, val){
            if(typeof val == 'object'){
                $.each(val, function(key2, val2){
                    element.html(val2).prop('name', 'cvalues['+key+']['+key2+']');
                    label = label.html(key.replace('_', ' ')+' > '+key2);
                    tempelements[key2] = label.add(element);
                });
            } else { // Labels
                element.html(val).prop('name', 'coptions['+key+']');
                label = label.html(key.replace('_', ' '));
                tempelements = label.add(element);
                // console.log('key', key, val);
            }
        });
        elements = tempelements;
        break;
        default:
            element.val(value).prop('name', name);
            elements = label.add(element);
        break;
    }

    return elements;
}

function getFieldView(field, type, attr) {
    var element = {}, elements, allElements = {};

    element = getElement(field,type);
    return applyViewType(element, type, attr);
}

function applyViewType(element, type, attr){   
    var voidAttr = ['values', 'options', 'format', 'label', 'cvalues', 'labels']; 
    var labelElements, allElements = {};
    var label = '<label>'+type+'</label>';
    labelElements = $(label);
    if(typeof attr != 'undefined'){
        switch(type){
            case 'html':
                elements = $(element);
                $.each(attr, function(name, val){
                    if(voidAttr.indexOf(name) === -1){
                        if(name == 'html'){
                            elements = elements.html(val).text();
                        } else {
                            elements = elements.attr(name, val);                        
                        }
                    }
                });
                allElements[0]   = [labelElements, elements];            
            break;
            case 'chain':
                $.each(attr, function(name, val){
                    // console.log(name, voidAttr.indexOf(name), val);
                    if(voidAttr.indexOf(name) === -1){
                        switch(name){
                            case 'coptions':
                                var x = 0;
                                labels = attr['labels'].split("\n");

                                $.each(labels, function(key3, val3){
                                    gelements = $(element);

                                    if(key3 == 0){
                                        getter = vared(val3);
                                        coptions = attr['coptions'][getter].split("\n");
                                        glabelElements = $(label).html(val3); 
                                    } else {
                                        setter = val3.replace(' ', '').toLowerCase();
                                        slabelElements = $(label).html(val3); 

                                        var goptions = {};
                                        window.temp_values = {};
                                        $.each(coptions, function(key2, val2){ 
                                            selements = $(element);
                                            coption = vared(val2);
                                            gelements.prop('id', getter);
                                            allElements[val3]   = [glabelElements, gelements.append(new Option(val2,coption,false))];

                                            cvalues = attr['cvalues'][setter][coption].split("\n");
                                            temp_values[coption] = cvalues;
                                            var soptions = {};

                                            selements.prop('id', setter);
                                            if(x < 1){
                                                $.each(cvalues, function(key4, val4){
                                                    allElements[coption]   = [slabelElements, selements.append(new Option(val4,val4,false))]; 
                                                }); 
                                                x++;                                            
                                                $(document).on("change", gelements, function(){ 
                                                    var val = $('option:selected', gelements).val();
                                                    $('#'+setter+' option').remove();    
                                                    $.each(window.temp_values[val], function(val, val) {
                                                        $('#'+setter).append(new Option(val,val));
                                                    });
                                                });
                                            }
                                        });      
                                    }
                                });
                            break;
                        }
                    }
                });
            break;
            case 'checkbox':
            case 'radio':
                left    = attr['values'].split("\n");
                right   = attr['options'].split("\n");
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
                left    = attr['options'].split("\n");
                right   = attr['values'].split("\n");

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

function constructOption(thatval,name) {
    var target;
    var index = 0;
    var defaultSelected = false;
    var options = thatval.split("\n");
    options = getUnique(options);
    countOpt = options.length;

        if(name =='labels'){
            target  = $('#formProp .tempfields');
            div = '<div class="tempoptions '+vared(options[countOpt-1])+'"></div>';
            // append container
            $(target).html(''); 
            $.each(options, function(key, val) {
                if(val != '' && (key + 1) <= (countOpt - 1)){
                    var clone = '<label>'+val+'</label><textarea name="coptions['+vared(val)+']" class="field"></textarea><div class="tempvalues '+vared(options[key+1])+'" data-title="'+vared(options[key+1])+'"></div>';
                    $(target).append($(div).append(clone));
                }
            });
        } else if(name.indexOf("coptions") !== -1){
            target  = $('#formProp .tempfields .tempoptions .tempvalues');
            data    = $('#formProp .tempfields .tempoptions .tempvalues').data();
            label   = data.title;
            // append container
            $(target).html(''); 
            $.each(options, function(key, val) {
                // console.log(key, val);
                if(val != ''){
                    var clone = '<label>'+label+' > '+val+'</label><textarea name="cvalues['+vared(label)+']['+vared(val)+']" class="field"></textarea>';
                    $(target).append(clone);
                }
            });
        }
}   

function getElement(field,type){
    // console.log(field,type);
    var element;
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
        case 'custom':
            label       = '';
            element     = '<div class="field" />';
        break;
    }
    return element;
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

function getContainer(rowid, request) {
    var container = '<div class="rows" id="row_'+rowid+'" data-title="'+request+'" />';
    return container;
}

function getAttr(type){
    // console.log(type);
    var attribute = {};    
    switch(type){
        //field attributes
        case 'text':
            attribute['class']      = '';
            attribute['name']       = '';
            attribute['label']      = '';
            attribute['id']         = '';
            attribute['value']      = '';
            attribute['size']       = '';
            attribute['maxlength']  = '';
            attribute['required']   = '';
            attribute['fieldtype']  = '';
        break;
        case 'textarea':
            attribute['class']      = '';
            attribute['name']       = '';
            attribute['label']      = '';
            attribute['id']         = '';
            attribute['value']      = '';
            attribute['cols']       = '';
            attribute['rows']       = '';
            attribute['required']   = '';
        break;
        case 'html':
            attribute['class']      = '';
            attribute['id']         = '';
            attribute['html']       = '';
        break;
        case 'single':
            attribute['class']      = '';
            attribute['name']       = '';
            attribute['label']      = '';
            attribute['id']         = '';
            attribute['size']       = '';
            attribute['options']    = '';
            attribute['values']     = '';
            attribute['required']   = '';
        break;
        case 'chain':
            attribute['class']      = '';
            attribute['name']       = '';
            attribute['required']   = '';
            attribute['labels']     = '';
        break;
        case 'radio':
        case 'checkbox':
            attribute['class']      = '';
            attribute['name']       = '';
            attribute['label']      = '';
            attribute['options']    = '';
            attribute['values']     = '';
            attribute['required']   = '';
        break;
        case 'button':
        case 'submit':
        case 'reset':
            attribute['class']      = '';
            attribute['name']       = '';
            attribute['id']         = '';
            attribute['value']      = '';
        break;
    }
    return attribute;
}
function vared(val){
    return val.replace(' ', '_').toLowerCase();
}