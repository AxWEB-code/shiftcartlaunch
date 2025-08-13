<?php
header('Content-Type: application/json');

// DB connection
$conn = new mysqli("localhost", "rjizgunf", "7e1BxlE20P:X-k", "rjizgunf_ecnsls_db");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Ensure table exists
$conn->query("CREATE TABLE IF NOT EXISTS waitlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    role ENUM('vendor','customer') NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$name  = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$email = trim($_POST['email'] ?? '');
$role  = trim($_POST['role'] ?? '');

if (!$name || !$phone || !$role) {
    echo json_encode(["status" => "error", "message" => "Please fill all required fields"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO waitlist (name, phone, email, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $phone, $email, $role);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "✅ You’ve joined the waitlist!"]);
} else {
    echo json_encode(["status" => "error", "message" => "⚠️ Could not save your details"]);
}

$stmt->close();
$conn->close();
?>
