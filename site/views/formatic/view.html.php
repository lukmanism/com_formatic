<?php

/**
 * @version     1.0.0
 * @package     com_formatic
 * @copyright   Copyright (C) 2013. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @author      Lukman Hussein <lukmanism@hotmail.com> - http://ntahla.com
 */
// No direct access
defined('_JEXEC') or die;

jimport('joomla.application.component.view');

/**
 * View to edit
 */
class FormaticViewFormatic extends JView {

    protected $state;
    protected $item;
    protected $form;
    protected $params;

    /**
     * Display the view
     */
    public function display($tpl = null) {
        
		$app	= JFactory::getApplication();
        $user		= JFactory::getUser();
        
        $this->state = $this->get('State');
        $this->item = $this->get('Data');

        $this->params = $app->getParams('com_formatic');
   		

        // Check for errors.
        if (count($errors = $this->get('Errors'))) {
            throw new Exception(implode("\n", $errors));
        }      
        
        
        if($this->_layout == 'edit') {
            
            $authorised = $user->authorise('core.create', 'com_formatic');

            if ($authorised !== true) {
                throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'));
            }
        }
        
        $this->_prepareDocument();

        parent::display($tpl);
    }

	public function constructatic($key, $field, $wrap) {
			$format = explode('_', $field['format']);
			$option = array('radio', 'checkbox');
			$button = array('button', 'submit', 'reset');
			$element = '';
			$label 	= '';
			$value 	= '';
			$labels = '';
			$values = '';
			$attributes = " type='$format[1]'";

			foreach ($field as $name => $values) {
			    switch($name){
			        case 'label':
				        if($values){
							$label = '<label for="'.$field['name'].'">'.$values.'</label>';				        	
				        } else {
				        	$label = '';
				        }
			        break;
			        case 'fieldtype':
			        case 'required':
			        break;
			        case 'class':
			        	@$required 	= ($field['required'] == 'true')? 'required': '';
			        	@$fieldtype = ($field['fieldtype'])? $field['fieldtype']: '';
						$attributes .= " $name='$values $required $fieldtype'";
			        break;
			        case 'labels':
			        case 'options':
			        	$labels = explode("\n", $values);
			        break;
			        case 'values':
			        	$value = explode("\n", $values);
			        break;
			        case ($name != 'format'):
				        if($values != ''){
							$attributes .= " $name='$values'";
				        }
			        break;
			    }
			}
			if($wrap){
				$prewrap 	= '<div class="rowmatic '.$field['name'].'">';
				$postwrap 	= '</div>';
			} else {
				$prewrap 	= '';
				$postwrap 	= '';
			}

		    switch($format[0]){
		        case 'input':
		        	if(in_array($format[1], $option)){
		        		$element .= $prewrap.$label;
		        		foreach($value as $key => $val){
		            		$element .= '<label><input '.$attributes.'></input>'.$labels[$key].'</label>';
		        		}
		        		$element .= $postwrap;
		        	} elseif(in_array($format[1], $button)){
		            		$element = $prewrap.'<input '.$attributes.$value.'/>'.$postwrap;	
		        	} else {
		            	$element = $prewrap.$label.'<input '.$attributes.'>'.$value.'</input>'.$postwrap;		        		
		        	}
		        break;
		        case 'textarea':
		            $element = $prewrap.$label.'<textarea '.$attributes.'>'.$value.'</textarea>'.$postwrap;
		        break;
		        case 'select':
	            	$element .= $prewrap.$label.'<select '.$attributes.'>';
	        		foreach($value as $key => $val){
	        			if(stristr($val, '}')){
	        				$selected = 'selected="selected"';
	        				$val = str_replace('}', '', $val);
	        			} else {
	        				$selected = '';
	        			}
		            	$element .= '<option value="'.$val.'" '.$selected.'>'.$labels[$key].'</option>';
	        		}
		            $element .= '</select>'.$postwrap;
		        break;
		    }
		    return $element;
	}

	/**
	 * Prepares the document
	 */
	protected function _prepareDocument()
	{
		$app	= JFactory::getApplication();
		$menus	= $app->getMenu();
		$title	= null;

		// Because the application sets a default page title,
		// we need to get it from the menu item itself
		$menu = $menus->getActive();
		if($menu)
		{
			$this->params->def('page_heading', $this->params->get('page_title', $menu->title));
		} else {
			$this->params->def('page_heading', JText::_('com_formatic_DEFAULT_PAGE_TITLE'));
		}
		$title = $this->params->get('page_title', '');
		if (empty($title)) {
			$title = $app->getCfg('sitename');
		}
		elseif ($app->getCfg('sitename_pagetitles', 0) == 1) {
			$title = JText::sprintf('JPAGETITLE', $app->getCfg('sitename'), $title);
		}
		elseif ($app->getCfg('sitename_pagetitles', 0) == 2) {
			$title = JText::sprintf('JPAGETITLE', $title, $app->getCfg('sitename'));
		}
		$this->document->setTitle($title);

		if ($this->params->get('menu-meta_description'))
		{
			$this->document->setDescription($this->params->get('menu-meta_description'));
		}

		if ($this->params->get('menu-meta_keywords'))
		{
			$this->document->setMetadata('keywords', $this->params->get('menu-meta_keywords'));
		}

		if ($this->params->get('robots'))
		{
			$this->document->setMetadata('robots', $this->params->get('robots'));
		}
	}        
    
}
