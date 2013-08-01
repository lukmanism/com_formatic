<?php
/**
 * @version     1.0.0
 * @package     com_formatic
 * @copyright   Copyright (C) 2013. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @author      Lukman Hussein <lukmanism@hotmail.com> - http://ntahla.com
 */
// no direct access
defined('_JEXEC') or die;

//Load admin language file
$lang = JFactory::getLanguage();
$lang->load('com_formatic', JPATH_ADMINISTRATOR);

$doc = JFactory::getDocument();
$doc->addScript('http://code.jquery.com/jquery-1.9.1.js');
$doc->addScript('http://ajax.aspnetcdn.com/ajax/jquery.validate/1.11.1/jquery.validate.min.js');
$css = JUri::root() . 'components/com_formatic/assets/css/formatic.css';
$doc->addStyleSheet($css);

?>
<?php if ($this->item) : ?>

    <div class="item_fields">
    	<fieldset class="containatic">
        <?php   
            $parameters = json_decode($this->item->parameters);

            $form = '<form ';
            foreach ($parameters as $name => $value) {
                if($name == 'post_entry'){
                    $rval = array(
                        'value'     => $value,
                        'format'    => 'input_hidden',
                        'name'      => $name
                    );
                    $redirect = $this->constructatic(0, $rval, false);
                } else {
                    $form .= " $name=\"$value\"";
                }
            }
            $form .= '>';
            $fields = json_decode($this->item->fields, true);
            foreach ($fields as $key => $field) {
                $form .= $this->constructatic($key, $field, true);
            }
            if(isset($redirect)){
                $form .= $redirect;                
            }
            $form .= '</form>';
            echo $form;
            $target = ($parameters->id != '')? '#'.$parameters->id : '.'.$parameters->class;
		?>
        <script>
            $(document).ready(function() {
                $('<?php echo $target; ?>').validate({
                    submitHandler: function(form) {
                    $.ajax({
                        type: "POST",
                        url: $(form).prop('action'),
                        data: $(form).serialize(),
                        timeout: 3000,
                        async : false,
                        success: function() {
                            window.location.replace("<?php echo $parameters->post_entry; ?>");
                        },
                        error: function() {
                            $('#status').html('Form has not been submitted. Please try again.')
                        }
                    });
                    return false;
                    }
                });
            }); 

            $.validator.addMethod("phone_us", function(phone_number, element) {  phone_number = phone_number.replace(/\s+/g, ""); 
            return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);}, "Please specify a valid phone number");
            
            $.validator.addMethod('phone_intl', function(value) { var numbers = value.split(/\d/).length - 1;
            return (10 <= numbers && numbers <= 20 && value.match(/^(\+){0,1}(\d|\s|\(|\)){10,20}$/)); }, 'Please enter a valid phone number');
            
            $.validator.addMethod("zip_code", function(zipcode, element) {
            return this.optional(element) || zipcode.match(/(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXYabceghjklmnpstvxy]{1}\d{1}[A-Za-z]{1} ?\d{1}[A-Za-z]{1}\d{1})$/);
        }, "Please specify a valid postal/zip code");            
        </script>
        <div id="status"></div>
    	</fieldset>

    </div>
    
<?php
else:
    echo JText::_('COM_FORMATIC_ITEM_NOT_LOADED');
endif;
?>
