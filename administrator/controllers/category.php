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
 * Category controller class.
 */
class FormaticControllerCategory extends JControllerForm
{

    function __construct() {
        $this->view_list = 'categories';
        parent::__construct();
    }

}