<?php

namespace App\Models;

use PDO;

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

    public static function getEvents($number = 3, $passed = false) {
        try {
            $db = static::getDB();
            $stmt = $db->query('SELECT * FROM events');
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

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

        return $result;
    }

    public static function addEvent($event) {
        $db = static::getDB();
        $stmt = $db->prepare('INSERT INTO events (event_title, event_date, event_imageUrl, event_link) VALUES (:title, :date, :imageUrl, :link);');
        $stmt->bindParam(':title', $event['title']);
        $stmt->bindParam(':date', $event['date']);
        $stmt->bindParam(':imageUrl', $event['imageUrl']);
        $stmt->bindParam(':link', $event['link']);
        $stmt->execute();
    }
}