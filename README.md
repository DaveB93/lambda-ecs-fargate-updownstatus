# lambda-ecs-fargate-updownstatus
AWS Lambda scripts for adjusting desired capacity of an ECS Fargate service and seeing the status of that service


This code was initially created to start/stop and see the status of a Valheim server created with code from this repository https://github.com/rileydakota/valheim-ecs-fargate-cdk 


## What it does

There are 2 javascriptv3 node scripts here
* startstopserver.ts
* serverstatus.ts

startstop takes a desiredCount and a key.  Your key matches the hardcoded key, then it adjusts the desired capacity of the ECS service. 

serverstatus does not require any authentication, it looks up your hardcoded cluster / service, and working from that figures out if it's up, and its public IP address.


## Setup

Q: Can't I just drop the serverstatus.ts and startstopservers.ts into the aws lambda console? what's with all this complicated setup?
A: No, due to the fact I'm using the AWS Javascript v3 api, this requires you to bundle all the required scripts with your code.  This is done using the CDK / esbuild.

( This is my first CDK / node.js project. I'm sorry if it's a bit of a mess, I'm still getting used to it. Suggestions are welcome.)


This is personal preference here, but I found working with node / deploying this code a bit saner in a linux environment ( developing was nicer on windows  though. ).   I installed WSL2, then Ubuntu LTS.  Then used vs code in the folder I'd cloned to by typing `code .`  

In order to not have an issue with having to run sudo when installing npm modules globally after installing npm I ran this: 
`npm config set prefix ~/.npm`  then modified my .profile

```
# set PATH so it includes user's .npm/bin if it exists
if [ -d "$HOME/.npm/bin" ] ; then
    PATH="$HOME/.npm/bin:$PATH"
fi
```
so that the files could be found

You will need the aws cli set up ( or at least the .config file), if you don't have esbuild setup, then you will need docker, and you will need to have docker shared with your WSL2

```
npm install
```

configure your settings to point to your ECS stack [here](bin/lambda-ecs-fargate-updownstatus.ts)

```
npx cdk deploy
```

## Using the code

After you deploy it you should get the URL of the Application Gateteway.  You can start the server by going to the server URL  and appending 

```
SERVERURL/startstop?key=PASSWORD
```

You can go to the ECS Cluster and see the desired count has changed to 1, and in about 15 seconds or so your service should be running. 

You can stop the server by doing the same, but setting the desiredCount=0

```
SERVERURL/startstop?key=PASSWORD&desiredCount=0
```

you can see if the server is running and it's IP by going to 

```
SERVERURL/serverstatus
```


## Optional if you're iterating on the script
next you need to go to the lambda console.  test your functions work with  this input for the startstop function
```
{
  "body": "eyJ0ZXN0IjoiYm9keSJ9",
  "resource": "/{proxy+}",
  "path": "/path/to/resource",
  "httpMethod": "POST",
  "isBase64Encoded": true,
  "queryStringParameters": {
    "key": "CHANGEME_PASSWORD"
  },
  "protocol": "HTTP/1.1"
}
```

stop the server
```
{
  "body": "eyJ0ZXN0IjoiYm9keSJ9",
  "resource": "/{proxy+}",
  "path": "/path/to/resource",
  "httpMethod": "POST",
  "isBase64Encoded": true,
  "queryStringParameters": {
    "key": "CHANGEME_PASSWORD",
    "desiredCount": 0
  },
  "protocol": "HTTP/1.1"
}
```

the status function doesn't require any specific input. 


After you've got those up, you will need to go to aws api gateway, and hook up an api for your functions.  I followed this tutorial.

https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/using-lambda-functions.html

I have this tutorial open in my tabs as well.  https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html


TODO: ( this can totally be automated as well )


To get the server to shut down automatically ( in case you forget to turn it off ) I recommend using application autoscaling see my comment here on how to set that up

https://github.com/rileydakota/valheim-ecs-fargate-cdk/issues/8#issuecomment-791126634


## Plan

Initially I'm just throwing this up on github so people can build off my work.  I will clean it up in the future so that it's more presentable 


I'm new to node, and typescript / javascript coding, so don't use this an example of good code. comments and suggestions are welcome.  I wrote this in Node / typescript because the eventual plan in my head is to submit a pull request that incorporates this into https://github.com/rileydakota/valheim-ecs-fargate-cdk , and keeping the same language as was already there is probably preferred. That said, this code is pretty slow. I feel like I'm doing something wrong that it takes over a second to get the public IP of an ecs task.   I'm seriously thinking about making a Java version of the status function at least.

The origin of this code was mostly git@github.com/awsdocs/aws-doc-sdk-examples/tree/master/javascriptv3/example_code/lambda.git

The [preview version of the AWS SDK for JavaScript v3](https://github.com/aws/aws-sdk-js-v3) is available. 

The [AWS documentation for this tutorial](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/using-lambda-functions.html) contains these examples.



## Security

This code has none / very little security.  Make sure your IAM roles are locked down a bit.  I feel like the direction to go with this is to figure out how Cognito works / create minor IAM roles for your friends you want to be able to start the server / or implement basic-auth.

