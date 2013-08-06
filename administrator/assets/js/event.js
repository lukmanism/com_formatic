$(document).ready(function(){
    window.token 	= jQuery('#formaticToken');
    window.pushdata;
	
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
	});
	$( "#sortable" ).disableSelection();
});

// Fields
$(document).on("click", ".addfield", function(){ 
	var request = $(this).attr('title');
	construct(request, 'store');
});

// Properties
$(document).on("click", ".field", function(){
	var target = $(this).parent();
	$('#apply', target).attr('disabled', false);
});


$(document).on("click", "#formView #apply", function(){ 
	var position = {}, row, x=1;
	$("#formView .rows").each(function(){
		row = $(this).attr('id').split('_');
		position[x] = Number(row[1]);
		x++;
	});
	construct(position, 'position');
});

$(document).on("click", "#formProp #apply", function(){ 
	var request = {};	
	var prop = {};
	request['parentid'] = ($(this).parent().attr('id'))? $(this).parent().attr('id'): $(this).parent().parent().attr('id');	
	request['title'] 	= ($(this).parent().attr('title'))? $(this).parent().attr('title'): $(this).parent().parent().attr('title');	

	$('#formProp .row').each(function() {
		prop[$(this).attr('name')] = htmlEscape($(this).val());
	})
	request['properties'] = prop;
	construct(request, 'update');
});

$(document).on("click", "#formParams #apply", function(){ 
	var request = {};	
	$('#formParams .field').each(function(){
		request[$(this).attr('name')] = $(this).val();
	});	
	$("#jform_parameters").html(JSON.stringify(request));
});

// View
$(document).on("click", "#formView h3", function(){ 
    $('#formView .rows').removeClass('active');	
	$(this).parent().addClass('active');	
	var request = {};	
	request['parentid'] = $(this).parent().attr('id');	
	request['title'] 	= $(this).parent().attr('title');
	construct(request, 'get');
});

$(document).on("click", ".cancel", function(){ 
	var btn = $(this).parent();
	if(btn.hasClass('halt')){
		btn.removeClass('halt');
		$(this).attr('title', 'Delete');
	} else {
		btn.addClass('halt');
		$(this).attr('title', 'Cancel Action');
	}
});

$(document).on("click", ".confirm", function(){ 
	var request = {};	
	request['parentid'] = $(this).parent().parent().attr('id');		
	construct(request, 'delete');
	$(this).parent().parent().remove();
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
        // .replace(/"/g, '&quot;')
        // .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}