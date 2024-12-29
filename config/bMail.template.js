const BMAIL_TEMPLATE = (content) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              width: 100%;
              max-width: 600px;
              margin: 20px auto;
              background: white;
              border-radius: 5px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              padding: 20px;
              text-align: center; /* Center text in the container */
          }
          h1 {
              color: #333;
          }
          .otp {
              font-size: 24px;
              font-weight: bold;
              color: #d9534f; /* Bootstrap Danger Color */
              margin: 20px 0;
          }
          p {
              font-size: 16px;
              line-height: 1.5;
              color: #555;
          }
          .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #aaa;
          }
          .logo {
              max-width: 200px; /* Adjust logo size */
              margin: 20px auto; /* Center the logo */
          }
          .love-title {
              font-size: 36px; /* Adjust font size for title */
              color: #d9534f; /* Color for the love title */
              margin: 20px 0; /* Add margin for spacing */
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="love-title">L❤️ve All</div>
          <h1>Registration Successful</h1>
          <p>Dear User,</p>
          <p>Thank you for registering with LoveAll! <br>We will contact you soon.</p>
          
          <div class="otp">${content}</div>
          
          <p>If you didn't initiate this request, please ignore this email.</p>
          
          <div class="footer">
              <p>Best Regards,<br>The LoveAll Team</p>
          </div>
      </div>
  </body>
  </html>`;
  };
  
  export default BMAIL_TEMPLATE;
  