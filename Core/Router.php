<?php

namespace Core;

use \App\Config;

class Router {
    protected $routes = [];
    protected $params = [];

    public function add($route, $params = []) {
        $route = preg_replace('/\//', '\\/', $route);
        $route = preg_replace('/\{([a-z]+)\}/', '(?P<\1>[a-z-]+)', $route);
        $route = preg_replace('/\{([a-z]+):([^\}]+)\}/', '(?P<\1>\2)', $route);
        $route = '/^' . $route . '$/i';

        $this->routes[$route] = $params;
    }

    public function getRoutes() {
        return $this->routes;
    }

    public function match($url) {

        foreach ($this->routes as $route => $params) {
            if (preg_match($route, $url, $matches)) {
                foreach ($matches as $key => $match) {
                    if (is_string($key)) {
                        $params[$key] = $match;
                    }
                }

                $this->params = $params;
                return true;
            }
        }
        
    }

    public function getParams() {
        return $this->params;
    }

    public function dispatch($url) {
        $this->checkCSRF();
        if (!isset($_SESSION['csrfToken'])) {
            $this->generateCSRF();
        }

        $url = $this->removeQueryStringVariables($url);

        if ($this->match($url)) {
            $controller = $this->params['controller'];
            $controller = $this->convertToStudlyCaps($controller);
            // $controller = "App\Controllers\\$controller";
            $controller = $this->getNamespace() . $controller;

            if (class_exists($controller)) {
                $controller_object = new $controller($this->params);

                $action = $this->params['action'];
                $action = $this->convertToCamelCase($action);

                if (is_callable([$controller_object, $action])) {
                    $controller_object->$action($this->params);
                } else {
                    throw new \Exception("Method $action (in controller $controller) not found");
                }
            } else {
                throw new \Exception("Controller class $controller not found");
            }
        } else {
            header('Location: /');
            exit();
        }
    }

    protected function convertToStudlyCaps($string) {
        return str_replace(' ', '', ucwords(str_replace('-', ' ', $string)));
    }
    protected function convertToCamelCase($string) {
        return lcfirst($this->convertToStudlyCaps($string));
    }

    protected function removeQueryStringVariables($url) {

        if ($url != '') {
            $parts = explode('&', $url, 2);
            if (strpos($parts[0], '=') === false) {
                $url = $parts[0];
            } else {
                $url = '';
            }
        }

        return $url;
    }

    protected function getNamespace() {
        $namespace = 'App\Controllers\\';

        if (array_key_exists('namespace', $this->params)) {
            $namespace .= $this->params['namespace'] . '\\';
        }

        return $namespace;
    }

    protected function checkCSRF() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $csrfToken = $_POST['_csrf'];

            global $easyCSRF;

            try {
                $easyCSRF->check(Config::TOKEN_SECRET, $csrfToken, null, true);
            } catch (\Exception $e) {
                header('Location: /?error=csrf');
                exit();
            }

            return true;
            
        } else {
            return true;
        }
    }

    protected function generateCSRF() {  

        global $easyCSRF;

        $_SESSION['csrfToken'] = $easyCSRF->generate(Config::TOKEN_SECRET);
        return;
    }
}