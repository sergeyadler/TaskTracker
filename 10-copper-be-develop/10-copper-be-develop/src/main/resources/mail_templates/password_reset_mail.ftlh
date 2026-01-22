<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your password</title>
    <style>
        body { font-family: Arial, sans-serif; background: #F7F7F8; color: #0F172A; }
        .container { max-width: 520px; margin: 24px auto; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
        .header { padding: 20px 24px; background: #111827; color: #fff; font-weight: 600; font-size: 18px; }
        .content { padding: 24px; line-height: 1.6; }
        .btn { display: inline-block; padding: 12px 18px; background: #2563EB; color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .note { margin-top: 16px; color: #6B7280; font-size: 13px; }
        .footer { padding: 16px 24px; background: #F9FAFB; color: #6B7280; font-size: 12px; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">Password reset request</div>
    <div class="content">
        <p>We received a request to reset your password.</p>
        <p>Click the button below to set a new password:</p>
        <p>
            <a class="btn" href="${link}">Reset password</a>
        </p>
        <p class="note">If you did not request a password reset, you can safely ignore this email.</p>
        <p class="note">This link will expire in 60 minutes.</p>
    </div>
    <div class="footer">
        If the button does not work, copy and paste this URL into your browser:
        <div><a href="${link}">${link}</a></div>
    </div>
</div>
</body>
</html>