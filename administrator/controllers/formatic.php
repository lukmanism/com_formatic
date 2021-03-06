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

jimport('joomla.application.component.controllerform');

/**
 * Formatic controller class.
 */
class FormaticControllerFormatic extends JControllerForm
{

    function __construct() {
        $this->view_list = 'formatics';
        parent::__construct();
    }

}