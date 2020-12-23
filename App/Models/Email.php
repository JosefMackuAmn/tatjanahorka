<?php

namespace App\Models;

use PDO;

class Email extends \Core\Model {

    public static function getEmails() {
        
        try {
            $db = static::getDB();
            $stmt = $db->query("SELECT * FROM emails");
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $results;
        } catch (PDOException $e) {
            echo $e->getMessage();
        }

    }

    public static function addEmail($email) {

        try {
            $db = static::getDB();
            $stmt = $db->prepare('INSERT INTO emails (email_email) VALUES (:email);');
            $stmt->bindParam(':email', $email);
            $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }

    }

    public static function deleteEmail($id) {

        try {
            $db = static::getDB();
            $stmt = $db->prepare('DELETE FROM emails WHERE email_id=:id;');
            $stmt->bindParam(':id', $id);
            $stmt->execute();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        
    }

    public static function sendEmails($event) {
        
        $emails = static::getEmails();

        $headers = "From: web@tatjanahorka.cz";

        foreach ($emails as $email) {
            mail($email['email_email'], "Taťjana Horká: " . $event['title'], $event['title'], $headers);
        }

    }

}