<?php

namespace App\Controllers;

use \Core\View;
use \App\Config;
use \Exception;
use \App\Models\Event;

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

    public function newEventAction() {
        $this->loggedInCheck();

        View::renderTemplate('admin/event-detail.html', []);
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
    public function eventAction($params) {
        $this->loggedInCheck();

        switch ($_SERVER['REQUEST_METHOD']) {
            
            case 'GET':
                return $this->getEvent($params);
                break;

            case 'DELETE':
                return $this->deleteEvent($params);
                break;

            case 'PUT':
                return $this->putEvent($params);
                break;

            default:
                return $this->getEvent($params);
                break;
        }
    }

    ///// admin/login
    // LOGIN: GET
    private function getLogin() {
        View::renderTemplate('admin/login.html', [
            'csrfToken' => $_SESSION['easycsrf_' . Config::TOKEN_SECRET]
        ]);
    }
    // LOGIN: POST
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
    // EVENTS: GET
    private function getEvents() {
        $events = Event::getEvents();

        View::renderTemplate('admin/events.html', [
            "events" => $events
        ]);
    }
    // EVENTS: POST
    private function postEvents() {

        if (!isset($_POST['submit'])) {
            header('Location: /admin/events?success=false');
        }

        $event = [
            "title" => $_POST['title'],
            "date" => $_POST['date'],
            "imageUrl" => $_POST['imageUrl'],
            "link" => $_POST['link']
        ];

        Event::addEvent($event);
        header('Location: /admin/events?success=true');
    }

    ///// admin/events/{id:\d+}
    private function getEvent($params) {
        $eventId = $params['id'];

        $result = Event::getEvent($eventId);

        View::renderTemplate('admin/event-detail.html', [
            "event" => $result
        ]);
    }
}