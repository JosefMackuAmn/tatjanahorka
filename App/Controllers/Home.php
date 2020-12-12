<?php

namespace App\Controllers;

use \Core\View;
use \App\Config;
use \App\Models\Event;
use \App\Models\Email;

class Home extends \Core\Controller {

    public function indexAction() {
        // Find 3 upcoming events
        $events = Event::getEvents(3, false);

        View::renderTemplate('index.html', [
            'events' => $events,
            'csrfToken' => $_SESSION['csrfToken']
        ]);
    }

    public function subscribeAction() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /?success=false');
            exit();
        }

        Email::addEmail($_POST['email']);

        header('Location: /?success=true');
        exit();

    }

}