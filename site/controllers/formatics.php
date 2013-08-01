<?php
/**
 * @version     1.0.0
 * @package     com_formatic
 * @copyright   Copyright (C) 2013. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 * @author      Lukman Hussein <lukmanism@hotmail.com> - http://ntahla.com
 */

// No direct access.
defined('_JEXEC') or die;

require_once JPATH_COMPONENT.'/controller.php';

/**
 * Formatics list controller class.
 */
class FormaticControllerFormatics extends FormaticController
{
	/**
	 * Proxy for getModel.
	 * @since	1.6
	 */
	public function &getModel($name = 'Formatics', $prefix = 'FormaticModel')
	{
		$model = parent::getModel($name, $prefix, array('ignore_request' => true));
		return $model;
	}
}