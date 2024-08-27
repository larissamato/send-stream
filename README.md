# Gateway Message
This is a gateway for sending messages. A queue of messages is created that can be redirected to various communication channels.

## Requirements
- Composer

## Usage

### Run in docker

run `docker-compose up`

### Whatsapp setup
use qr code to connect to whatsapp by reading the output from edwiges

## Examples

### Send message as discord compatible to all services defined in environment variable
```console
$ curl -H "Content-Type: application/json" 'http://127.0.0.1:3000/api/message?hash=changeme' -d '{"content": "hello world"}'
```

### Send message to specific channel service
```console
$ curl -X POST -H "Content-Type: application/json" '127.0.0.1:3000/api/message?hash=changeme' -d '{"to": {"discord": ["mydiscordwebhook"]}, "message": {"content": "hello world"}}'
```

### Send message with embed
```console
$ curl -X POST -H "Content-Type: application/json" '127.0.0.1:3000/api/message?hash=changeme' -d '{"message": {"content": "hello world, again", "embeds": [{"title": "look, Im an embed"}]}}'
```

### List messages queue
```console
$ curl '127.0.0.1:3000/api/message?hash=changeme'
```

### List services
```console
$ curl '127.0.0.1:3000/api/service?hash=changeme'
```
