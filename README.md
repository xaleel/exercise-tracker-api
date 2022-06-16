# Exercise tracker API
A simple exercise tracker API made with Express and MongoDB

## Usage
- You can POST to `/api/users` with form data username to create a new user. Returns:
```
{
  username: "john",
  _id: "61204ee3f5860e05a3652f11"
}
```

- You can make a GET request to `/api/users` to get a list of all users.
- You can POST to `/api/users/:_id/exercises` with form data `description`, `duration`, and optionally `date`. If no date is given, the current date will be used. Returns the user object with the exercise fields added:
```
{
	"_id": "61204ee3f5860e05a3652f11",
	"username": "john",
	"date": "Thu Mar 10 2022",
	"duration": 27,
	"description": "Ran on the treadmill"
}
```
- You can make a GET request to `/api/users/:_id/logs` to retrieve a full exercise log of any user. Returns the user object with a log array of all the exercises added and their count:
```
{
	"_id": "61204ee3f5860e05a3652f11",
	"username": "john",
	"count": 3,
	"log": [{
		"description": "ran on the treadmill",
		"duration": 27,
		"date": "Thu Mar 10 2022"
	}, {
		"description": "side lunges",
		"duration": 10,
		"date": "Wed Mar 09 2022"
	}, {
		"description": "swimming",
		"duration": 90,
		"date": "Tue Mar 08 2022"
	}]
}
```
- You can add `from`, `to` and `limit` parameters to a GET `/api/users/:_id/logs` request to retrieve part of the log of any user. `from` and `to` are dates in yyyy-mm-dd format. `limit` is an integer of how many logs to send back. E.g.:
```
/api/users/61204ee3f5860e05a3652f11/logs?from=2022-03-08&to=2022-03-10&limit=1
```
Returns:
```
{
	"_id": "61204ee3f5860e05a3652f11",
	"username": "john",
	"from": "Tue Mar 08 2022",
	"to": "Thu Mar 10 2022",
	"count": 1,
	"log": [{
		"description": "side lunges",
		"duration": 10,
		"date": "Wed Mar 09 2022"
	}]
}
```
