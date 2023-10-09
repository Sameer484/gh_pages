---
title: Api Pentesting- Part 2
tags: [Api, security, api documentation, bug bounty]
layout: post
---  

## Api documentation or Reversing enpoints 

Here, we will be doing some automated API documentation using some of the tools installed previously. There are many ways to make the api documentation but i will cover the most easiest and automated way. In this whole series, I will be using CrAPI as a vulnerable website. You can check my part-1 blog to know how to setup this environment. In this blog, I'll create API documentation of CrAPI website. So follow along with me.

- Open the terminal and type `mitmweb` . This will  run the intercepter on port 8081. Open the browser and open the page in `127.0.0.1:8081`
 ![Image](/assets/img/api/mitmweb.png)
 

- Now it's time to capture all the request of your webiste. You will see all the request in above tab once you start burp proxy and surf all the endpoints of your site. Make sure you turn on proxy on `127.0.0.1` or burp. You will the request like below if everything goes right.
 ![Image](/assets/img/api/captured.png)
  

- Save the file and run the command `mitmproxy2swagger -i flows -o spec.yaml -p http://crapi.apisec.ai -f flow `. This will convert the flows that you captured in earlier step into yaml file that can be imported into postman or view in any web browser. ![Image](/assets/img/api/mitmproxy2swagger.png)

- Open the new file spec.yaml and you will see the endpoints are listed in ignore. You need to remove those ignored api endpoints and save the file. It's just basic things. You can do that.

- Then again run the above mitmproxy2swagger command but with `--examples` flag to enhance your API documentation.![Image](/assets/img/api/mitm2.png)

- You can validate the documentation by visiting https://editor.swagger.io/ and by importing your spec file into the Swagger Editor. Use File>Import file and select your spec.yml file. If everything has gone as planned then you should see something like the image below.  ![Image](/assets/img/api/swagger.png)


That's all!! Note that you can also import spec.yaml file in postman and view the endpoints are analyze further. This much for this post. Thank you for sticking with me till the end. We will move onto real api testing later.
