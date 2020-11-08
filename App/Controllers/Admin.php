<?php

namespace App\Controllers;

use \Core\View;
use \App\Config;
use \Exception;

class Admin extends \Core\Controller {
    
    protected function loggedInCheck() {
        if (!isset($_SESSION['isAdmin']) OR !$_SESSION['isAdmin']) {
            header('Location: /');
            exit('You have to be signed in');
        }
    }

    public function indexAction() {
        $this->loggedInCheck();
        View::renderTemplate('admin/index.html', [
            'title' => ''
        ]);
    }

    public function logoutAction() {
        $_SESSION['isAdmin'] = false;
        return header('Location: /');
    }

    // ROUTING
    public function loginAction() {
        switch ($_SERVER['REQUEST_METHOD']) {
            
            case 'GET':
                return $this->getLogin();
            break;
            
            case 'POST':
                return $this->postLogin();
            break;
            
            default:
                return $this->getLogin();
            break;
        }
    }

    // ROUTING
    public function eventsAction() {
        $this->loggedInCheck();

        switch ($_SERVER['REQUEST_METHOD']) {
            
            case 'GET':
                return $this->getEvents();
            break;
            
            case 'POST':
                return $this->postEvents();
            break;
            
            default:
                return $this->getEvents();
            break;
        }
    }

    // ROUTING
    public function eventAction() {
        $this->loggedInCheck();

        switch ($_SERVER['REQUEST_METHOD']) {
            
            case 'GET':
                return $this->getEvent();
                break;

            case 'DELETE':
                return $this->deleteEvent();
                break;

            case 'PUT':
                return $this->putEvent();
                break;

            default:
                return $this->getEvent();
                break;
        }
    }

    ///// admin/login
    // GET LOGIN
    private function getLogin() {
        View::renderTemplate('admin/login.html', [
            'csrfToken' => $_SESSION['easycsrf_' . Config::TOKEN_SECRET]
        ]);
    }
    // POST LOGIN
    private function postLogin() {

        if (isset($_POST['submit'])) {
            $accesKey = $_POST['password'];

            if ($accesKey === getenv('HTTP_ACCESS_CODE')) {
                $_SESSION['isAdmin'] = true;
                return header('Location: /admin');
            } else {
                throw new Exception('Bad access code');
            }

        } else {
            throw new Exception('Bad access code');
        }

        
    }

    ///// admin/events
    private function getEvents() {
        View::renderTemplate('admin/events.html', []);
    }

    ///// admin/event
    private function getEvent() {
        View::renderTemplate('admin/event-detail.html', []);
    }
}