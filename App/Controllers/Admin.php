<?php

namespace App\Controllers;

use \Core\View;
use \App\Config;
use \Exception;
use \App\Models\Event;
use \Helpers\File;

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

        View::renderTemplate('admin/event-detail.html', [
            "csrfToken" => $_SESSION['easycsrf_' . Config::TOKEN_SECRET]
        ]);
    }

    public function deleteAction($params) {
        $this->loggedInCheck();
        $eventId = $params['id'];

        $event = Event::getEvent($eventId);
        File::delete($event['event_imageUrl']);
        Event::deleteEvent($eventId);

        header('Location: /admin/events');
        exit();
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

            case 'POST':
                return $this->postEvent($params);
                break;

            default:
                return $this->getEvent($params);
                break;
        }
    }

    ///// admin/login
    // LOGIN: GET
    private function getLogin() {

        if ($_SESSION['isAdmin']) {
            header('Location: /admin');
            exit();
        }

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
        $events = Event::getEvents(1000, true);

        View::renderTemplate('admin/events.html', [
            "events" => $events,
            "csrfToken" => $_SESSION['easycsrf_' . Config::TOKEN_SECRET]
        ]);
    }
    // EVENTS: POST
    private function postEvents() {

        if (!isset($_POST['submit'])) {
            header('Location: /admin/events?success=false');
        }

        $dateFrom = $_POST['dateFrom'];
        if (strlen($dateFrom) !== 10) {
            throw new \Exception('Date is in wrong format');
        }
        $date = strtotime($dateFrom);

        $imageUrl = File::upload();

        if (!$imageUrl) {
            throw new \Exception('No image was uploaded');
        }

        $event = [
            "title" => $_POST['title'],
            "date" => $date,
            "dateFrom" => $dateFrom,
            "dateTo" => $_POST['dateTo'],
            "imageUrl" => $imageUrl,
            "link" => $_POST['link']
        ];

        Event::addEvent($event);
        header('Location: /admin/events?success=true');
        exit();
    }

    ///// admin/events/{id:\d+}
    private function getEvent($params) {
        $eventId = $params['id'];

        $result = Event::getEvent($eventId);

        View::renderTemplate('admin/event-detail.html', [
            "event" => $result,
            "csrfToken" => $_SESSION['easycsrf_' . Config::TOKEN_SECRET]
        ]);
    }
    private function postEvent($params) {
        $eventId = $params['id'];

        if (!isset($_POST['submit'])) {
            header('Location: /admin/events?success=false');
        }

        $dateFrom = $_POST['dateFrom'];
        if (strlen($dateFrom) !== 10) {
            throw new \Exception('Date is in wrong format');
        }
        $date = strtotime($dateFrom);

        // Update image if isset and delete the old one
        $imageUrl = false;
        if (File::checkFile()) {
            $oldEvent = Event::getEvent($eventId);
            $oldImage = $oldEvent['event_imageUrl'];

            File::delete($oldImage);
            $imageUrl = File::upload();
        }

        $event = [
            "title" => $_POST['title'],
            "date" => $date,
            "dateFrom" => $dateFrom,
            "dateTo" => $_POST['dateTo'],
            "imageUrl" => $imageUrl,
            "link" => $_POST['link']
        ];

        Event::updateEvent($eventId, $event);

        header('Location: /admin/events?success=true');
        exit();
    }
}