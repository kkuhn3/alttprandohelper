<?php
$input = json_decode(file_get_contents('php://input'), true);
$id = $input["id"];
$id = str_replace("\\", "", $id, $count);
$id = str_replace(".", "", $id, $count);
$id = str_replace("/", "", $id, $count);
echo file_get_contents(($id).".json");
?>