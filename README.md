# members-only

see live: https://deploy-members-only.herokuapp.com/

background
==========
This app is an exercise in database interaction, creating a backend with express, and authenticating users. The app is a simple message board. Only members can post on this board, and only members can see the author of each post, but non-members can see everything that has been posted (only the author is hidden from them). There is also a single admin who can see everything and also delete posts. 

The app will have a sign-up screen, which will consist of a form that invites a person to enter a username and password. Once they have created an account they are then invited to enter a secret passcode (if they know it), which will actually upgrade them to member (allowing them to post and see the author of existing posts). 
