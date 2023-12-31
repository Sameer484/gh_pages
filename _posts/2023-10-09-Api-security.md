---
title: Api Pentesting- Part 1
tags: [Api, security, api documentation, bug bounty]
layout: post
---    
## Part 1 
<h1> Setting up the lab environment</h1>
Firstly you want to create an environment to start getting your hands dirty in api security and penetration testing. In this series, I will guide you from very basic to advanced api testing with every tools and commands you need. So stay with me with your laptop and enthusiasm bind together. 

<h2> Installing the tools</h2>

- CrAPI (This is the vulnerable api that you are going to exploit). So go and download the api from github and use docker to setup the environment easily.
  ```
  curl -o docker-compose.yml https://raw.githubusercontent.com/OWASP/crAPI/main/deploy/docker/docker-compose.yml
  docker-compose pull
  docker-compose -f docker-compose.yml --compatibility up -d
  ```
 &nbsp;
  &nbsp;
- Postman (This may be handy when you need to organize all the api requests properly )
  ```
  snap install postman
  ```
 &nbsp;
  &nbsp;
- Mitmweb ( This tool  acts as interceptor of all the web requests. This comes useful when automating api documentation. I'll teach you api documentation after this part.)
```
this comes pre-installed in kali
```
 &nbsp;
  &nbsp;
- Mitmproxy2swagger ( A tool to convert flow file created by mitmweb into yaml file)
```
cd /opt
sudo pip3 install mitmproxy2swagger
```
 &nbsp;
  &nbsp;

- JWT_Tool ( Python based tool that is used to perfrom various attacks related to jwt tokens like bruteforcing secret key and other known attacks).
  ```
  git clone https://github.com/ticarpi/jwt_tool
  python3 -m pip install termcolor cprint pycryptodomex requests
  ```
   &nbsp;
  &nbsp;
- Crunch (To generate the wordlist)
  ```
  comes preinstalled in kali
  ```
   &nbsp;
  &nbsp;
- Kiterunner ( Great tool to find out the endpoints or bruteforce the api directory. Normal gobuster or dirbuster like dir bruteforcing tool isn't that much useful in api fuzzing.)
```
pre-built binary 
https://github.com/assetnote/kiterunner/releases/download/v1.0.2/kiterunner_1.0.2_linux_amd64.tar.gz
```
 &nbsp;
  &nbsp;
- Zaproxy (The OWASP Zed Attack Proxy (ZAP) is an easy to use integrated penetration testing tool for finding vulnerabilities in web applications).
  ```
  sudo apt install zaproxy
  ```
