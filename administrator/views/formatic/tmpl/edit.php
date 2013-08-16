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

JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
JHtml::_('behavior.keepalive');
// Import CSS
$document = JFactory::getDocument();
$document->addStyleSheet('components/com_formatic/assets/css/formatic.css');
?>
<script type="text/javascript">
Joomla.submitbutton = function(task) {
    if (task == 'formatic.cancel') {
        Joomla.submitform(task, document.getElementById('formatic-form'));
    } else{                    
        if (task != 'formatic.cancel' && document.formvalidator.isValid(document.id('formatic-form'))) {
            Joomla.submitform(task, document.getElementById('formatic-form'));
        } else {
            alert('<?php echo $this->escape(JText::_('JGLOBAL_VALIDATION_FORM_FAILED')); ?>');
        }
    }
}
</script>

<script src="<?php echo JURI::root();?>administrator/components/com_formatic/assets/js/jquery-1.10.2.min.js"></script>
<script src="<?php echo JURI::root();?>administrator/components/com_formatic/assets/js/jquery-ui-1.10.3.custom.min.js"></script>
<script src="<?php echo JURI::root();?>administrator/components/com_formatic/assets/js/event.js"></script>
<script src="<?php echo JURI::root();?>administrator/components/com_formatic/assets/js/function.js"></script>

<form action="<?php echo JRoute::_('index.php?option=com_formatic&layout=edit&id=' . (int) $this->item->id); ?>" method="post" enctype="multipart/form-data" name="adminForm" id="formatic-form" class="form-validate">
   <div class="width-50 fltlft">
        <fieldset class="adminform">
 
            <legend><?php echo JText::_('COM_FORMATIC_LEGEND_FORMATIC'); ?></legend>
            <ul class="adminformlist">

                <!-- <li><?php echo $this->form->getLabel('id'); ?>
				<?php echo $this->form->getInput('id'); ?></li> -->
				<li><?php echo $this->form->getLabel('name'); ?>
				<?php echo $this->form->getInput('name'); ?></li>
				<li><?php echo $this->form->getLabel('category'); ?>
				<?php echo $this->form->getInput('category'); ?></li>
                <li><?php echo $this->form->getLabel('fields'); ?>
                <?php echo $this->form->getInput('fields'); ?></li>
                <!-- 
				<li><?php echo $this->form->getLabel('values'); ?>
				<?php echo $this->form->getInput('values'); ?></li>
                -->
				<li><?php echo $this->form->getLabel('parameters'); ?>
				<?php echo $this->form->getInput('parameters'); ?></li> 

				<li><?php echo $this->form->getLabel('state'); ?>
				<?php echo $this->form->getInput('state'); ?></li>
				<li><?php echo $this->form->getLabel('created_by'); ?>
				<?php echo $this->form->getInput('created_by'); ?></li>


            </ul>
            <?php echo JHtml::_('form.token'); ?>
            <input type="hidden" name="task" value="" />
        <!-- <input type="hidden" name="fields" id="formaticFields" value=""> -->
        </fieldset>
</div>
        </form>

<div class="width-50 fltlft">
    <fieldset class="adminform" id="formParams">
    <legend>Form Parameters</legend>
    <div class="rows">
        <label>action</label>
            <input type="text" class="row field" name="action">
        <label>post-entry Page</label>
            <input type="text" class="row field" name="post_entry">
        <label>method</label>
            <select name="method" class="row field">
                <option value="POST">POST</option>
                <option value="GET">GET</option>
            </select>
        <label>enctype</label> 
        <select name="enctype" class="row field">
            <option value="multipart/form-data">multipart/form-data</option>
            <option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</option>
            <option value="text/plain">text/plain</option>
        </select>
        <label>name</label>
            <input type="text" class="row field" name="name">
        <label>id</label>
            <input type="text" class="row field" name="id">
        <label>class</label>
            <input type="text" class="row field" name="class">
            <input type="button" disabled="disabled" value="Apply" id="apply">
    </div>
    </fieldset>
</div>

<div class="container">

    <div class="width-20 fltlft">
    <fieldset class="adminform" id="formFields">
        <legend>Fields</legend>
        <div id="field1" class="fieldwrapper">
        <div class="rows">
        <ul class="sfield">
            <li>Custom
                <ul>
                <li class="addfield" data-title="custom_html">HTML</li>
            </ul>
            </li>
            <li>Input
            <ul>
                <li class="addfield" data-title="input_button">Button</li>
                <li class="addfield" data-title="input_checkbox">Checkbox</li>
                <li class="addfield" data-title="input_radio">Radio</li>
                <li class="addfield" data-title="input_reset">Reset</li>
                <li class="addfield" data-title="input_submit">Submit</li>
                <li class="addfield" data-title="input_text">Text</li>
            </ul>
            </li>
            <li>Select
                <ul>
                <li class="addfield" data-title="select_chain">Chain-Select</li>
                <li class="addfield" data-title="select_single">Select</li>
                <!-- <li class="addfield" data-title="select_date">Select (Date)</li> -->
            </ul>
            <li>Textarea
                <ul>
                <li class="addfield" data-title="textarea_textarea">Textarea</li>
            </ul>
        </ul>
        </div>

        <div class="clearboth"></div>
        </div>
    </fieldset>
    </div>

    <div class="width-45 fltlft">
    <fieldset class="adminform" id="formView">
        <legend>View</legend>
        <div id="sortable" class="fields"></div>
        <div id="formatic_getter"></div>
        <input type="hidden" name="formaticToken" id="formaticToken" value="<?php echo $this->tokenmatic();?>">
    </fieldset>
    </div>
    
    <div class="width-35 fltrt">
    <fieldset class="adminform" id="formProp">
        <legend>Properties</legend>
        <div class="fields">Select element from View Panel.</div>
    </fieldset>
    </div>

</div> 
    

    <div class="clr"></div>

    <style type="text/css">
        /* Temporary fix for drifting editor fields */
        .adminformlist li {
            clear: both;
        }
    </style>