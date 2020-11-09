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
$router->add('', ['controller'=>'Home', 'action'=>'index']); // GET

///// ADMIN
$router->add('admin/?', ['controller'=>'Admin', 'action'=>'index']); // GET
$router->add('admin/login/?', ['controller'=>'Admin', 'action'=>'login']); // GET, POST
$router->add('admin/logout/?', ['controller'=>'Admin', 'action'=>'logout']); // POST
$router->add('admin/events/?', ['controller'=>'Admin', 'action'=>'events']); // GET, POST
$router->add('admin/events/new/?', ['controller'=>'Admin', 'action'=>'newEvent']); // GET
$router->add('admin/events/delete/{id:\d+}/?', ['controller'=>'Admin', 'action'=>'delete']); // GET
$router->add('admin/events/{id:\d+}/?', ['controller' => 'Admin', 'action' => 'event']); // GET, PUT, POST
$router->add('admin/*', ['controller' => 'Admin', 'action' => 'notFound']); // GET

$router->dispatch($_SERVER['QUERY_STRING']);