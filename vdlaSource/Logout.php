<?php
// logout.php
session_start();
session_unset();
session_destroy();

// Redirect to login page after logout
header("file:///C:/xampp/htdocs/vdlaSource/home%20page.html");  // Change to your login page path
exit();
?>