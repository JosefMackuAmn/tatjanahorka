<?php

namespace App\Controllers;

use \Core\View;
use \App\Models\Event;

class Home extends \Core\Controller {

    public function indexAction() {
        // Find 3 upcoming events
        $events = Event::getEvents(3, false);

        View::renderTemplate('index.html', [
            "events" => $events
        ]);
    }

}