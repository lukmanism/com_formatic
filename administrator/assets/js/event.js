$(document).ready(function(){
    window.token 	= jQuery('#formaticToken');
    window.pushdata;
    window.thiscount = 0;

	
	if($("#jform_fields").html()){
	    var fields = jQuery.parseJSON($("#jform_fields").html());
		construct(fields, 'load'); // load if preset saved
	}
	if($("#jform_parameters").html()){
	    var parameters = jQuery.parseJSON($("#jform_parameters").html());
        $.each(parameters, function(name, val) {
        	switch(name){
        		case 'method':
        		case 'enctype':
        			$('#formParams select[name='+name+']').val(val);
        		break;
        		default:
        			$('#formParams input[name='+name+']').val(val);
        		break;
        	}
        });
	}

	$( "#sortable" ).sortable({
		update: function(){
			if($('#apply', this).length == 0) {
    			$(this).append('<input type="button" id="apply" value="Apply" />');
			}
		}
	}).disableSelection();

	$("#sortable").find(".tempfields").bind('mousedown.ui-disableSelection selectstart.ui-disableSelection', function(e) {
		e.stopImmediatePropagation();
	});

});

// Fields
$(document).on("click", ".addfield", function(){ 
	var data = $(this).data();
	var request = data.title;
	construct(request, 'store');
});

// Properties
$(document).on("change", ".field", function(){
	var target = $(this).closest('.rows');
	var name = $(this).prop('name');

	if(name == 'labels' || name.indexOf("cop") !== -1){
		constructOption($(this).val(), name);
	}

	$('#apply', target).prop('disabled', false);
});


$(document).on("click", "#formView #apply", function(){ 
	var position = {}, row, x=1;
	$("#formView .rows").each(function(){
		row = $(this).prop('id').split('_');
		position[x] = Number(row[1]);
		x++;
	});
	construct(position, 'position');
});

$(document).on("click", "#formProp #apply", function(){
	var data = $(this).closest('.rows').data();
	var request = {};	
	var prop = {};
	request['parentid'] = $(this).closest('.rows').prop('id');	
	request['title'] 	= data.title;	

	$('#formProp .field').each(function() {
		prop[$(this).prop('name')] = htmlEscape($(this).val());
	})
	request['properties'] = prop;
	construct(request, 'update');
});

$(document).on("click", "#formParams #apply", function(){ 
	var request = {};	
	$('#formParams .field').each(function(){
		request[$(this).prop('name')] = $(this).val();
	});	
	$("#jform_parameters").html(JSON.stringify(request));
});

// View
$(document).on("click", "#formView h3", function(){ 
	var data = $(this).closest('.rows').data();
    $('#formView .rows').removeClass('active');	
	$(this).parent().addClass('active');	
	var request = {};	
	request['parentid'] = $(this).parent().prop('id');	
	request['title'] 	= data.title;
	construct(request, 'get');
});

$(document).on("click", ".cancel", function(){ 
	var btn = $(this).parent();
	if(btn.hasClass('halt')){
		btn.removeClass('halt');
		$(this).prop('title', 'Delete');
	} else {
		btn.addClass('halt');
		$(this).prop('title', 'Cancel Action');
	}
});

$(document).on("click", ".confirm", function(){ 
	var request = {};	
	request['parentid'] = $(this).closest('.rows').prop('id');
	construct(request, 'delete');
	$(this).closest('.rows').remove();
});

// Disable button element
$(document).on("click", "#formView input[type=submit]", function(){ 
	return false;
});
$(document).on("click", "#formProp input[type=checkbox]", function(){
	$(this).val($(this).prop("checked")? true: false);
});


function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}