<?php

require_once dirname(__DIR__) . '/vendor/autoload.php';

set_error_handler('Core\Error::errorHandler');
set_exception_handler('Core\Error::exceptionHandler');

session_start();

$sessionProvider = new \EasyCSRF\NativeSessionProvider();
$easyCSRF = new \EasyCSRF\EasyCSRF($sessionProvider);

/////
// ROUTES
/////
$router = new Core\Router();

///// PAGES
$router->add('', ['controller'=>'Home', 'action'=>'index']);

///// ADMIN
$router->add('admin/?', ['controller'=>'Admin', 'action'=>'index']);
$router->add('admin/login/?', ['controller'=>'Admin', 'action'=>'login']);
$router->add('admin/logout/?', ['controller'=>'Admin', 'action'=>'logout']);
$router->add('admin/events/?', ['controller'=>'Admin', 'action'=>'events']);
$router->add('admin/events/{id}/?', ['controller' => 'Admin', 'action' => 'event']);

$router->dispatch($_SERVER['QUERY_STRING']);