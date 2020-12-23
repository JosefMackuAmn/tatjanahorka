<?php

namespace App\Controllers;

use \Core\View;
use \App\Config;
use \App\Models\Event;
use \App\Models\Email;

class Home extends \Core\Controller {

    public function indexAction() {
        // Find 3 upcoming events
        $events = [];//Event::getEvents(3, false);

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
        if (!isset($_POST['email'])) {
            header('Location: /?success=false');
            exit();            
        }
    
        $split_email = explode('@', $_POST['email']);
        if (count($split_email) < 2) {
            header('Location: /?success=false');
            exit();
        }
        
        $split_domain = explode('.', $split_email[1]);        
        if (count($split_domain) < 2) {
            header('Location: /?success=false');
            exit();
        }

        Email::addEmail($_POST['email']);

        header('Location: /?success=true');
        exit();

    }

}