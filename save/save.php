<?php
$input = json_decode(file_get_contents('php://input'), true);
$id = $input["id"];
$state = $input["state"];
file_put_contents(($id).".json",($state));
?>