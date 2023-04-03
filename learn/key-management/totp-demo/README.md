# Time-based OTP Demo
[Demo](https://glad-cat.sneakpeak.dev/demo)

Time-based OTPs are a popular version of multi-factor authentication (MFA) used in many services today. The concept of generating them is simple, yet a single blunder could risk all your user's accounts.

## How does it work? 🧐
![Source Twilio.com](https://assets.cdn.prod.twilio.com/images/totp-diagram_Cw3JZsA.width-800.png)
Image Source: twilio.com

Time-based OTP's work on a simple concept. When a users sets it up, the device (such as Google Authenticator, Authy, etc) and the server share a secret key. The key is then hashed with the time and the same code can be generated on the server and the user's client device.

### Single Point of Failiure ❌
If a bad actor gains access to the servers or databases where you store all the secret keys used to generate the OTPs, now all your users accounts could get compromised!

### How do we fix this - Use a KEY MANAGER
Key Managers like the [CipherTrust Platform](https://ciphertrust.io/) are designed to store cryptographic keys very securely. This demo is an example where I use the CipherTrust platform to store keys and generate time based OTP codes.