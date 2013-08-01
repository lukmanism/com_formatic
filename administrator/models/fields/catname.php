<?php
/**
 * @version     1.0.0
 * @package     com_formatic
 * @copyright   Copyright (C) 2013. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @author      Lukman Hussein <lukmanism@hotmail.com> - http://ntahla.com
 */

defined('JPATH_BASE') or die;

jimport('joomla.form.formfield');

/**
 * Supports an HTML select list of categories
 */
class JFormFieldCatname extends JFormField
{
	/**
	 * The form field type.
	 *
	 * @var		string
	 * @since	1.6
	 */
	protected $type = 'catname';

	/**
	 * Method to get the field input markup.
	 *
	 * @return	string	The field input markup.
	 * @since	1.6
	 */
	protected function getInput()
	{
		// Initialize variables.
		$html = array();
        
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);		 
		$query->select(array('id,name'))->from('#__formatic_categories')->order('name ASC');
		$db->setQuery($query);
		$results = $db->loadObjectList();

		$html[] = '<select size="1" class="inputbox" name="'.$this->name.'">';

		foreach ($results as $key) {
			if ($key->id == $this->value) {
				$html[] = '<option value="'.$key->id.'" selected="selected">'.$key->name.'</option>';
			} else {			
				$html[] = '<option value="'.$key->id.'">'.$key->name.'</option>';
			}
		}
		$html[] = '</select>';
        
		return implode($html);
	}
}