exports.contactUsEmail = (
    email,
    name,
    message,
    phoneNumber
  ) => {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <title>Contact Confirmation</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f1f5f9;
          margin: 0;
          padding: 0;
          color: #1e293b;
        }
        .container {
          max-width: 600px;
          margin: 30px auto;
          background-color: #ffffff;
          border-radius: 12px;
          padding: 40px 30px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
        }
        h2 {
          text-align: center;
          color: #10b981;
          font-size: 26px;
          margin-bottom: 20px;
        }
        .body {
          font-size: 16px;
          line-height: 1.6;
          color: #334155;
        }
        .info-box {
          background-color: #d1fae5;
          border: 1px solid #10b981;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          color: #065f46;
        }
        .info-box p {
          margin: 10px 0;
        }
        .footer {
          text-align: center;
          font-size: 13px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
          padding-top: 16px;
          margin-top: 30px;
        }
      </style>
    </head>
    
    <body>
      <div class="container">
        <h2>Contact Form Confirmation</h2>
        <div class="body">
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.</p>
          <p>Here are the details you provided:</p>
  
          <div class="info-box">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
  
          <p>If this wasn’t you, please contact our support immediately.</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply directly to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Dental Care. All rights reserved.</p>
        </div>
      </div>
    </body>
    
    </html>`;
  };
  