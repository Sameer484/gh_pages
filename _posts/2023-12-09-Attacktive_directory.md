---
title: Tryhackme-Attacktive Directory
tags: [Active Directory, security, Tryhackme, Windows]
layout: post
---  

This blog is more of a guided than solving the challenge. This is the room from tryhackme that focus on active directory enumeration and some basic attck types. This doesn't cover all the attacks in the AD environment but this can be a great place if you know nothing about AD exploitation. You should know what active directory is and how things works in AD. I've covered some basic stuffs that you may need in order to complete this room. 

## Setting up the environmnment using tools.
- We need to install Impacket toolkit first. You can use following commands to properly install impacket. 
  ```
  sudo git clone https://github.com/SecureAuthCorp/impacket.git /opt/impacket
  sudo pip3 install -r /opt/impacket/requirements.txt
  cd /opt/impacket/ 
  sudo pip3 install .
  sudo python3 setup.py install
  ```
- Install this tools (Bloodhund and neo4j).
 ` apt install bloodhound neo4j`
- Kerbrute for bruteforcing usernames and passwords
  `https://github.com/ropnop/kerbrute/releases`

This much tools for now. We will install more if necessary. Grab a coeffee and follow along with me.

## Enumeration Phase
 
 You probably know about `Nmap` which is most need utility for hacker. The first or inital active recon about the target is mostly running Nmap against the target and discovering out open ports, finding out the services running and along with versions that is running.
 On running Nmap against the target ip( This ip is the ip of domain controller when doing active directory red teaming) we got the following results.
 ```
 ┌──(samsec㉿kali)-[~/Downloads]
└─$ nmap 10.10.178.139 -sC -sV    
Starting Nmap 7.94SVN ( https://nmap.org ) at 2023-12-06 10:27 +0545
Nmap scan report for 10.10.178.139 (10.10.178.139)
Host is up (0.19s latency).
Not shown: 987 closed tcp ports (conn-refused)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
80/tcp   open  http          Microsoft IIS httpd 10.0
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/10.0
|_http-title: IIS Windows Server
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2023-12-06 04:42:33Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: spookysec.local0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  tcpwrapped
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: spookysec.local0., Site: Default-First-Site-Name)
3269/tcp open  tcpwrapped
3389/tcp open  ms-wbt-server Microsoft Terminal Services
| rdp-ntlm-info: 
|   Target_Name: THM-AD
|   NetBIOS_Domain_Name: THM-AD
|   NetBIOS_Computer_Name: ATTACKTIVEDIREC
|   DNS_Domain_Name: spookysec.local
|   DNS_Computer_Name: AttacktiveDirectory.spookysec.local
|   Product_Version: 10.0.17763
|_  System_Time: 2023-12-06T04:42:46+00:00
|_ssl-date: 2023-12-06T04:42:55+00:00; 0s from scanner time.
| ssl-cert: Subject: commonName=AttacktiveDirectory.spookysec.local
| Not valid before: 2023-12-05T04:25:52
|_Not valid after:  2024-06-05T04:25:52
Service Info: Host: ATTACKTIVEDIREC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2023-12-06T04:42:50
|_  start_date: N/A

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 53.16 seconds
 ```
 
And yeah, we got lots of ports opened, got insights on kerberos, ldap,netbios etc which means we are dealing with windows server. We see some smb(samba) running which basically is protocol for file sharing in windows.

### Answering question from tryhackme
1. *What tool will allow us to enumerate port 139/445?*
 ==> enum4linux tool helps us to enumerate more detailed information about the ports 139/445. Run the new version of enum4linux `enum4linux-ng 10.10.18.35` , you will get to know huge number of information about the service.

2. *What is the NetBIOS-Domain Name of the machine?*
 ==> **A little bit about NetBIOS.**
NetBIOS is the simple protocol that is used for communicating computers and application in local lan in smaller network. Mainly, windows system use this protocol for communication. SMB is used when file sharing is to be done. So, whenever you right click the file or folder in windows and click the share option, this will automatically opens up 3 ports that are **135,139,445**.

    You can find the answer to the above question by running enum4linux-ng.
 **ANS.** THM-AD
 
3. *What invalid TLD do people commonly use for their Active Directory Domain?*
==> When doing the actual pentesting, we won't be encountering the domain name as .local instead we are going to see things like spooky.net,org,com or something like this.
So, the invalid TLD people commonly use is **.local**

## Username enumeration
Say, we are doing internal or external pentesting on AD and we don't know anything about the users in the network, then we should perform username enumeration and find out the valid users in that network.
> ***Remember: Doing password bruteforcing is not a wise choice because of password policies. If we do password bruteforce for users, then we may ran into a  situation where every users in the network are locked out due to invalid password.***


---
---
### **About kerberos authentication**
How it works?

> - **User or client creates authenticator(meaning proving who am i). Plain text password is never sent in the network. Some part of this is encrypted using client's password and send to the KDC(key distribution center). KDC decrypts the authenticator using client's password that is stored within kdc and verifies that the user who is authenticating is actual user.**
> - **KDC creates TGT(ticket granting ticket) by encrypting it with TGS secret key and sends to the client. Client stores it in kerberos tray(a memory that stores all the tickets that client have).**
> - **If client wants to access the service like file server, he sends that TGT to KDC with the SPN(service principle name, unique identifier of service) and KDC sends back ticket that is encrypted using service  password's NTLM hash.**
> - **Client then uses copy of that ticket to authenticate with service they want to access.**

![image](https://github.com/Sameer484/gh_pages/assets/110039044/0224ba12-6d90-4861-aaa3-30fe33752555)


---
---

Now we will use kerbrute tool to bruteforce some users and password. To know more information about how the tool works, visit the github.[https://github.com/ropnop/kerbrute](https://)
We should specify the domain name of the active directory and the ip of the domain controller. The command and output looks like below.
![image](https://github.com/Sameer484/gh_pages/assets/110039044/28ab2cc3-2edf-4aa5-bd63-90d81c6e4d20)


&nbsp;
4. *What notable account is discovered? (These should jump out at you)?*
==> svc-admin(service admin) is something special that jump out at us.
&nbsp;

5. *What is the other notable account is discovered? (These should jump out at you)?*
==> backup

---

## Kerberoasting
> Kerberoasting is the process of cracking the password of the service account without sending any packet to the target system. As long we have valid credentials of the user account, we can request the TGS from KDC and since that TGS is encrypted using service's password NTLM hash, we can crack it offline. If service is running as domain administrator, then we can simply use the cracked password to become domain admin and compromise whole AD.
> **Note**: That's why service account must have strong and long password and shouldn't have domain admin access.
---

## Back to THM
**ASREPRoasting**==> If the user account has the privilege "Does not require Pre-Authentication" set, then we don't need TGT to get the TGS from domain controller ie. we don't need to find valid credentials for the user account.

Using impacket toolkit, we can find out the users that doesn't require pre-authentication. Run the impacket-GetNPUsers and get the valid ticket. 
`impacket-GetNPUsers spookysec.local/ -usersfile valid_user.txt -dc-ip 10.10.147.140`

![image](https://github.com/Sameer484/gh_pages/assets/110039044/7959a318-ffc0-4041-875d-c12ee2fa7119)

&nbsp;
6. *We have two user accounts that we could potentially query a ticket from. Which user account can you query a ticket from with no password?*
==> You can see the svc-admin's ticket in the above figure.
&nbsp;

7. *Looking at the Hashcat Examples Wiki page, what type of Kerberos hash did we retrieve from the KDC? (Specify the full name)*
==> Take a look at the hashcat examples in the wiki page and you can find the different names and codes for mode of cracking. Search for krb5asrep and you can find the name of kerberos hash. **ANS**. Kerberos 5, etype 23, AS-REP
&nbsp;

8. *What mode is the hash?*
==> 18200
&nbsp;

9. *Now crack the hash with the modified password list provided, what is the user accounts password?*
==> use hashcat to crack the password. I'll leave this up to you. This is just a basic hashcat command to crack the password, use the mode that is discoverd earlier.
&nbsp;

10. *What utility can we use to map remote SMB shares?*
==> smbclient tool is mostly used to list available shares.
&nbsp;

11. *How many remote shares is the server listing?*
==> find it out using smbmap,smbclient or crackmapexec `crackmapexec smb 10.10.211.94 -u "svc-admin" -p "management2005" --shares
`
&nbsp;
12. *There is one particular share that we have access to that contains a text file. Which share is it?*
==> backup
&nbsp;

13. *What is the content of the file?*
==> read that file using the tool smbclient `smbclient  //10.10.211.94/backup/ -U svc-admin `
&nbsp;

14. *Decoding the contents of the file, what is the full contents?*
==> it's base64 encoded data, and you can easily decode that.
&nbsp;

The user backup is something special because all the active directory changes are synced with this account because they have the privilege to do so.

## DCSync attack:
> Most enterprise active directory have two or more domain controller to provide reliability if in case one DC fails to serve. To sync the user's password hash, user account who have permissions can request for the replication of  user's password hash(NTDIS.DIT file where all the users hash are stored in windows). The permissions that are necessary are:
> - DS-Replication-Get-Changes
> - DS-Replication-Get-Changes-All
> - DS-Replication-Get-Changes-In-Filtered-Set
> 
> So, I as an attacker can pretend that I'm domain controller and ask other domain controller to replicate their data to me (send NTDIS.DIT file). This is how DCsync attack works.
> 
> By default, the group of administrator, domain admins, enterprise admins and domain controller have this permissions enabled.
> 
> Requesting the NTDIS.DIT file uses DRSUAPI protocol (directory replication service).

## THM continued....
15. *What method allowed us to dump NTDS.DIT?*
==> You got the answer, didn't you? DRSUAPI

16. *What is the Administrators NTLM hash?*
==> secretsdump.py tool can be used to perform and dump the NTDIS.DIT file. You can use impacket-secretsdump too. Run the below command and you will get all the hashes.

![image](https://github.com/Sameer484/gh_pages/assets/110039044/1acd6711-3971-45ea-8376-513f247b45cb)


The first hash is the LM hash(LAN manager hash. Take a look at wiki to know about this, it's so insecure) and second part is NTLM hash

17. *What method of attack could allow us to authenticate as the user without the password?*
==> pass the hash (In this attack, attacker can use the NTLM password hash without actual username and password to impersonate other users and elevate the rights on the domain)

18. *Using a tool called Evil-WinRM what option will allow us to use a hash?*
==> Evil-WinRM(windows remote management) tool is used to remotely connect and manage the windows machine. -H flag is used to connect to machine using hash.

![image](https://github.com/Sameer484/gh_pages/assets/110039044/2243a5df-5e5b-49df-9ac5-d87997c2d764)


I'll leave the last part of the flag submissions up to you. Once you became administrator, you can find each users password in the desktop of each users.

In this blog, I covered the basic active directory attacks. In the later posts, i'll come up with more advanced and various attack methods of active directory. Hope you learn a lot from this post.
