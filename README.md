# TicketPal

![Project Image](Screen Shot 2021-06-22 at 10.49.52 AM<img width="1764" alt="Screen Shot 2021-06-22 at 10 49 52 AM" src="https://user-images.githubusercontent.com/40044944/122976235-03842f80-d349-11eb-8d98-c8168a10fc30.png">
)


---

### Table of Contents
You're sections headers will be used to reference location of destination.

- [Description](#description)
- [How To Use](#how-to-use)
- [References](#references)
- [Author Info](#author-info)

---

## Description

TicketPal is an Event-Based Microservices application that allows a general user to browse the app to see any available tickets to a show, concert, or sporting event. Each ticket shows the date posted, title, and price. Inorder to purchase a ticket or post a ticket a user must have an account with TicketPal and the registered user has 15 minutes to purchase the ticket before the time finishes. Once the time expires and the registered user does not purchase the ticket. The ticket is put back on the feed for sale. 

---

## Technologies

- Backend: Node.js and Express.js, 
- Frontend: React.js and Next.js
- Database: MongoDB and Redis
- event-bus: Nats-Streaming
- Docker containers and kubernetes clusters
- Typescript
- ingress-nginx

[Back To The Top](#read-me-template)

---

## How To Use

## Installation


#### dependencies

```html
    $npm install typescript ts-node-dev express @types/express
    tsc init
    npm start
```

## Docker

#### to build an image
```html
    docker -t build [dockerusername]/[folder] .
    docker push [dockerusername]/[folder]
    
```

## Kubernetes

#### To process a yaml file and convert it to a pod
```html
    kubectl apply -f [filename]    
```

#### To delete a pod
```html
    kubectl delete pod [nameofpod]    
```

#### To see exisiting pods
```html
    kubectl get pods    
```



[Back To The Top](#Table-of-Contents)

---

## References
[Back To The Top](#Table-of-Contents)

---


## Author Info

- LinkedIn - [@edgarcatalan](https://www.linkedin.com/in/edgarcatalan10/)

