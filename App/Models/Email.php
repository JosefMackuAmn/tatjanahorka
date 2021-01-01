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

        $subject = "Taťjana Horká: " . $event['title'];
        $headers = array(
            'From' => "web@tatjanahorka.cz",
            'Reply-To' => "tatjanahorka@gmail.cz",
            'Content-Type' => 'text/html; charset=UTF-8'
        );

        $message = "Zveme Vás na akci:" . "<br /><br />" . $event['content'] . "<br /><br />S úctou,<br />Taťjana Horká<br /><br />Tato zpráva byla vygenerována automaticky.";

        foreach ($emails as $email) {
            mail($email['email_email'], $subject, $message, $headers);
        }

    }

}