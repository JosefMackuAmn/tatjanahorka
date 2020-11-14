<?php

namespace Helpers;

use \RuntimeException;
use \finfo;

define ('SITE_ROOT', realpath(dirname(__FILE__)));

class File {

    public static function upload() {
        static::checkFile();

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $ext = array_search(
            $finfo->file($_FILES['image']['tmp_name']),
            array(
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
            ),
            true
        );
        
        // You should name it uniquely.
        // DO NOT USE $_FILES['image']['name'] WITHOUT ANY VALIDATION !!
        // On this example, obtain safe unique name from its binary data.
        $fileName = sha1_file($_FILES['image']['tmp_name']) . "-" . rand(1000000, 9999999) . "." . $ext;

        if (!move_uploaded_file($_FILES['image']['tmp_name'], SITE_ROOT . "/../public/img/" . $fileName)) {
            throw new RuntimeException('Failed to move uploaded file.');
        }

        return $fileName;
    }

    public static function delete($fileName) {
        $path = SITE_ROOT . "/../public/img/" . $fileName;

        if (file_exists($path)) unlink($path);
    }

    public static function checkFile() {
        try {
   
            // Undefined | Multiple Files | $_FILES Corruption Attack
            // If this request falls under any of them, treat it invalid.
            if (
                !isset($_FILES['image']['error']) ||
                is_array($_FILES['image']['error'])
            ) {
                throw new RuntimeException('Invalid parameters.');
            }
        
            // Check $_FILES['image']['error'] value.
            switch ($_FILES['image']['error']) {
                case UPLOAD_ERR_OK:
                    break;
                case UPLOAD_ERR_NO_FILE:
                    throw new RuntimeException('No file sent.');
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    throw new RuntimeException('Exceeded filesize limit.');
                default:
                    throw new RuntimeException('Unknown errors.');
            }
        
            // You should also check filesize here.
            if ($_FILES['image']['size'] > 1000000) {
                throw new RuntimeException('Exceeded filesize limit.');
            }
        
            // DO NOT TRUST $_FILES['image']['mime'] VALUE !!
            // Check MIME Type by yourself.
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            if (false === $ext = array_search(
                $finfo->file($_FILES['image']['tmp_name']),
                array(
                    'jpg' => 'image/jpeg',
                    'jpeg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                ),
                true
            )) {
                throw new RuntimeException('Invalid file format.');
            }

            return true;
        
        } catch (RuntimeException $e) {
            if (\App\Config::SHOW_ERRORS) {
                echo $e->getMessage();
            }        
        }
    }

}