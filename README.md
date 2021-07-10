# Binus API

An unofficial REST API to fetch Binus data like class schedule and exam schedule.

If you are interested to contribute feel free to send a [pull request](https://github.com/MrMissx/binus_api/pulls).


## General API Information

- Base endpoint url is: https://binus-api.vercel.app/api
- All endpoints return either a JSON object or array.
- available endpoints are:
    - [Schedule](https://github.com/MrMissx/binus_api#schedule): `POST  /api/schedule`.
    - [Exam](https://github.com/MrMissx/binus_api#exam): `POST  /api/exam`.


## Error

- Any post endpoint can return an error

This is a sample of error payload:
```json
{
  "ok": false,
  "message": "Invalid username or password!"
}
```

## Endpoints Information

- All requests must be sent with POST.
- For each request you need to include these JSON body parameters to make the call valid:

Name  | Type    | Optional | Description
----- | ------- | ------ | ------
username| string | No | Binus username without `@binus.ac.id`.
password | string | No | Binus account pasword.


## Schedule

Get a class schedule.

- URL: `/api/schedule`
- Method: `POST`

Response: 
```json
{
    "ok": true,
    "result": [...]
}
```


## Exam

Get the latest exam schedule.

- URL: `/api/exam`
- Method: `POST`

Response:
```json
{
  "ok": true,
  "result": {...}
}
```


## Example

bellow is an example of `POST` request using Python (`requests`):

```python
import requests

res = requests.post(
    "https://binus-api.vercel.app/api/schedule",
    json={"username": "User123", "password": "Pass123"}
)

print(res.json())
```


# License
Licensed under [MIT License](https://github.com/mrmissx/binus_api/blob/master/LICENSE).

[![](https://raw.githubusercontent.com/abumalick/powered-by-vercel/master/powered-by-vercel.svg)](https://vercel.com/?utm_source=powered-by-vercel)

Made with ❤️
