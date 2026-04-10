# Freshdesk ↔ HubSpot Integration

Find the live APP - http://amzn-s3-external-portal.s3-website-us-east-1.amazonaws.com/
## Sample Login

```json
{
  "email": "subasinisuba040401@gmail.com",
  "password": "subha123"
}
```


---

## Authentication Flow

### 1. Sign Up

Users can create a new account using:

* Email & Password
  Basic validation and secure password handling required

---

### 2. Sign In

Users can log in using:

* Email & Password
* Google Sign-In (OAuth)

After successful login, users are redirected to the Dashboard

---

### 3. Logout

Users can securely log out from the application
Token is cleared on logout

---

## Dashboard Overview

The Dashboard acts as the central hub for managing integrations and data.

### Integrations Section

Displays connection status for:

* Freshdesk
* HubSpot

---

### Navigation Sections

```
Dashboard
│
├── Integrations
│     ├── Freshdesk (Connect / Status)
│     └── HubSpot (Connect / Status)
│
├── Tickets
│     └── Freshdesk Tickets View
│
├── Webhooks
│     └── Freshdesk Webhook Logs
│
└── CRM
      └── HubSpot Contacts
```

---

## FreshDesk Setup

Get Domain and API Key as input from user → Connect user to Freshdesk

---

## HubSpot OAuth Setup

Go to your HubSpot Developer Dashboard
Create an app

Set the redirect URL:
http://localhost:8000/api/connect/hubspot/callback

Include:

* Client ID
* Client Secret

Add them to your `.env`

---

## Freshdesk Webhook Configuration

### Steps

Log in to your Freshdesk account

Go to:
Admin → Workflows → Automations

Choose:
Ticket Creation / Ticket Update

1. Add a new rule

2. Trigger: When ticket is created

3. Action: Trigger Webhook

4. Configure webhook:
   URL: http://your-server-url/api/webhook/freshdesk
   Example: http://3.90.186.18:8000/api/freshdesk

Method: POST
Content Type: JSON

Sample payload:

```json
{
  "event_type": "ticket_created",
  "ticket_id": "{{ticket.id}}",
  "ticket_subject": "{{ticket.subject}}",
  "ticket_status": "{{ticket.status}}",
  "ticket_priority": "{{ticket.priority}}",
  "requester_name": "{{ticket.requester.name}}",
  "requester_email": "{{ticket.requester.email}}",
  "created_at": "{{ticket.created_at}} "
}
```

5. Save and enable the automation

---

## Tech Stack

Client:

* Vite
* Tailwind CSS

Backend:

* Node.js
* Express.js

Database:

* MongoDB

---

## Deployment Notes

```
pm2 start server.js --name backend
```
