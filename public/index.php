<?php

require_once dirname(__DIR__) . '/vendor/autoload.php';

set_error_handler('Core\Error::errorHandler');
set_exception_handler('Core\Error::exceptionHandler');

session_start();
if (!isset($_SESSION['isAdmin'])) {
    $_SESSION['isAdmin'] = false;
}

$sessionProvider = new \EasyCSRF\NativeSessionProvider();
$easyCSRF = new \EasyCSRF\EasyCSRF($sessionProvider);

/////
// ROUTES
/////
$router = new Core\Router();

///// PAGES & USER DATA
$router->add('', ['controller'=>'Home', 'action'=>'index']); // GET
$router->add('subscribe/?', ['controller'=>'Home', 'action'=>'subscribe']); // POST

///// ADMIN
$router->add('admin/?', ['controller'=>'Admin', 'action'=>'index']); // GET
$router->add('admin/login/?', ['controller'=>'Admin', 'action'=>'login']); // GET, POST
$router->add('admin/logout/?', ['controller'=>'Admin', 'action'=>'logout']); // POST
$router->add('admin/emails/?', ['controller'=>'Admin', 'action'=>'emails']); // GET
$router->add('admin/emails/delete/{id:\d+}/?', ['controller'=>'Admin', 'action'=>'deleteEmail']); // GET
$router->add('admin/events/?', ['controller'=>'Admin', 'action'=>'events']); // GET, POST
$router->add('admin/events/new/?', ['controller'=>'Admin', 'action'=>'newEvent']); // GET
$router->add('admin/events/delete/{id:\d+}/?', ['controller'=>'Admin', 'action'=>'delete']); // GET
$router->add('admin/events/{id:\d+}/?', ['controller' => 'Admin', 'action' => 'event']); // GET, PUT, POST
$router->add('admin/*', ['controller' => 'Admin', 'action' => 'notFound']); // GET
$router->add('/*', ['controller' => 'Home', 'action' => 'index']); // GET

$router->dispatch($_SERVER['QUERY_STRING']);
