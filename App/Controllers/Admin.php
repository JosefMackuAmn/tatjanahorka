<?php

namespace App\Controllers;

use \Core\View;

class Admin extends \Core\Controller {
    protected function before() {
        // Check if user is signed up
    }

    public function indexAction() {
        View::renderTemplate('admin/index.html', [
            'title' => ''
        ]);
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
    private function getLogin() {
        View::renderTemplate('admin/login.html', []);
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