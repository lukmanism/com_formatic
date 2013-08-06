<?php
/**
 * @version     1.0.0
 * @package     com_formatic
 * @copyright   Copyright (C) 2013. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @author      Lukman Hussein <lukmanism@hotmail.com> - http://ntahla.com
 */

defined('_JEXEC') or die;

abstract class FormaticHelper
{
	public static function myFunction()
	{
		$result = 'Something';
		return $result;
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
				if($values != ''){
			    switch($name){
			        case 'label':
				        if($values){
							$label = '<label for="'.$field['name'].'">'.$values.'</label>';				        	
				        } else {
				        	$label = '';
				        }
			        break;
			        case 'html':
						$html = $values;
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
							$attributes .= " $name='$values'";
			        break;
			    }
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
		            		$element .= '<span><label><input '.$attributes.'></input>'.$labels[$key].'</label></span>';
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
		        case 'custom':
		            $element = '<div class="rowmatic '.$field['name'].'" '.$attributes.'>'.$html.$postwrap;
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


}

