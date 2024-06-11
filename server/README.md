Example Usage how to use the passwordless feature:

curl -X POST -d “email=aaron@email.com” localhost:8000/auth/email/
Email to aaron@email.com:
...
<h1>Your login token is 815381.</h1>
...

Return Stage

```
curl -X POST -d "email=aaron@example.com&token=815381" localhost:8000/auth/token/

> HTTP/1.0 200 OK
> {"token":"76be2d9ecfaf5fa4226d722bzdd8a4fff207ed0e”}
```
Same for phone

You can now POST to either of the endpoints:
```bash
curl -X POST -d "email=aaron@email.com" localhost:8000/auth/email/

// OR

curl -X POST -d "mobile=+15552143912" localhost:8000/auth/mobile/
```


A 6 digit callback token will be sent to the contact point.

The client has 15 minutes to use the 6 digit callback token correctly. If successful, they get an authorization token in exchange which the client can then use with Django Rest Framework’s TokenAuthentication scheme.

```bash
curl -X POST -d "email=aaron@email.com&token=815381" localhost:8000/auth/token/

> HTTP/1.0 200 OK
> {"token":"76be2d9ecfaf5fa4226d722bzdd8a4fff207ed0e”}
```