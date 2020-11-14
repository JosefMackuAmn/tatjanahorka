<?php

namespace App\Models;

use PDO;
use \Helpers\Dates;

class Event extends \Core\Model {
    public static function getAll() {
        try {
            $db = static::getDB();
            $stmt = $db->query('SELECT id, title, content FROM posts ORDER BY created_at');
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $results;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public static function getEvents($number = 3, $passed = true) {
        $todayDate = 0;
        if (!$passed) {
            $todayDate = time();
        }

        try {
            $db = static::getDB();
            $stmt = $db->query("SELECT * FROM events WHERE event_date >= $todayDate ORDER BY event_date DESC LIMIT $number;");
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($results as &$result) {
                $result['event_prettyDate'] = Dates::format($result['event_dateFrom'], $result['event_dateTo']);
            }

            return $results;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }

    public static function getEvent($id) {
        
        $db = static::getDB();
        $stmt = $db->prepare('SELECT * FROM events WHERE event_id=:id;');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $result = $stmt->fetch();

        $result['event_prettyDate'] = Dates::format($result['event_dateFrom'], $result['event_dateTo']);

        return $result;
    }

    public static function addEvent($event) {
        $db = static::getDB();
        $stmt = $db->prepare('INSERT INTO events (event_title, event_date, event_imageUrl, event_link, event_dateFrom, event_dateTo) VALUES (:title, :date, :imageUrl, :link, :dateFrom, :dateTo);');
        $stmt->bindParam(':title', $event['title']);
        $stmt->bindParam(':date', $event['date']);
        $stmt->bindParam(':imageUrl', $event['imageUrl']);
        $stmt->bindParam(':link', $event['link']);
        $stmt->bindParam(':dateFrom', $event['dateFrom']);
        $stmt->bindParam(':dateTo', $event['dateTo']);
        $stmt->execute();
    }

    public static function updateEvent($id, $event) {
        $db = static::getDB();

        if ($event['imageUrl']) {
            $stmt = $db->prepare('UPDATE events SET event_title=:title, event_date=:date, event_imageUrl=:imageUrl, event_link=:link, event_dateFrom=:dateFrom, event_dateTo=:dateTo WHERE event_id=:id;');
            $stmt->bindParam(':imageUrl', $event['imageUrl']);
        } else {
            $stmt = $db->prepare('UPDATE events SET event_title=:title, event_date=:date, event_link=:link, event_dateFrom=:dateFrom, event_dateTo=:dateTo WHERE event_id=:id;');
        }
        $stmt->bindParam(':title', $event['title']);
        $stmt->bindParam(':date', $event['date']);
        $stmt->bindParam(':link', $event['link']);
        $stmt->bindParam(':dateFrom', $event['dateFrom']);
        $stmt->bindParam(':dateTo', $event['dateTo']);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

    }

    public static function deleteEvent($id) {
        $db = static::getDB();
        $stmt = $db->prepare('DELETE FROM events WHERE event_id=:id;');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }
}