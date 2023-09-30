<?php
$input = json_decode(file_get_contents('php://input'), true);
$id = $input["id"];
$id = preg_replace('/[^A-Za-z0-9\-]/', '', $id);
$state = $input["state"];
file_put_contents("./saves/".($id).".json",($state));
?>