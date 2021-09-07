<?php
$input = json_decode(file_get_contents('php://input'), true);
$id = $input["id"];
echo file_get_contents(($id).".json");
?>