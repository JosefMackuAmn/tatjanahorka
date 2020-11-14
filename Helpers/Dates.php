<?php

namespace Helpers;

class Dates {
    
    public static function format($from, $to) {

        $from = str_replace("-0", "-", $from);
        $to = str_replace("-0", "-", $to);

        $fromPieces = explode('-', $from);
        $toPieces = explode('-', $to);

        $prettyDate;

        // If year differs
        if ($fromPieces[0] === $toPieces[0]) {

            // If month differs
            if ($fromPieces[1] === $toPieces[1]) {

                // If day differs
                if ($fromPieces[2] === $toPieces[2]) {

                    $prettyDate = $toPieces[2] . "." . $toPieces[1] . "." . $toPieces[0];
    
                } else {
                    $prettyDate = $fromPieces[2] . "." . " - " . $toPieces[2] . "." . $toPieces[1] . "." . $toPieces[0];
                }

            } else {
                $prettyDate = $fromPieces[2] . "." . $fromPieces[1] . "." . " - " . $toPieces[2] . "." . $toPieces[1] . "." . $toPieces[0];
            }

        } else {
            $prettyDate = $fromPieces[2] . "." . $fromPieces[1] . "." . $fromPieces[0] . " - " . $toPieces[2] . "." . $toPieces[1] . "." . $toPieces[0];
        }

        return $prettyDate;
    }

}