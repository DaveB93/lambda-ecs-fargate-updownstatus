/* 
ABOUT THIS NODE.JS EXAMPLE: This example works with AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/using-lambda-function-prep.html.

Purpose:
slotpull.ts runs the lambda function for this example.

Inputs (into code):
- REGION
- 

Running the code:
ts-node lambda-function-setup.ts
*/
"use strict";

const { ECSClient, ListServicesCommand, DescribeServicesCommand, ListTasksCommand, DescribeTasksCommand } = require('@aws-sdk/client-ecs');
const { EC2Client, DescribeNetworkInterfacesCommand } = require('@aws-sdk/client-ec2');

//Set the AWS Region
const REGION = "us-west-2"; //e.g. "us-east-1"
const SERVICE_ARN = "CHANGEME_SERVICES_ARN";  // arn:aws:ecs:us-west-2:######:service/ValheimServerAwsCdkStack-fargateCluster7F3D820B-eccKqMVSXj5m/ValheimServerAwsCdkStack-valheimService6CC6232D-ojRS5VVVNwQL
const CLUSTER_ARN = "CHANGEME_CLUSTER_ARN"; // arn:aws:ecs:us-west-2:######:cluster/ValheimServerAwsCdkStack-fargateCluster7F3D820B-eccKqMVSXj5m

const client = new ECSClient({ region: REGION });
const ec2Client = new EC2Client({ region: REGION });



exports.handler = async (event, context, callback) => {


  var statusResults = await getIPFunction();
  console.log("status results: " + JSON.stringify(statusResults));

  callback(null, statusResults);
};


async function getIPFunction() {

  // Define the object that will hold the data values returned
  let statusResults = {
    running: false,
    ip: "",
  };

  try {

    var ListTasksParams = {
      servicesName: SERVICE_ARN,
      cluster: CLUSTER_ARN,
      desiredStatus: "RUNNING"
    };
    const listTasksCommand = new ListTasksCommand(ListTasksParams);

    //const listTasksPromise = 
    const listTasks = await client.send(listTasksCommand);
    console.log(listTasks);

    if (listTasks.taskArns.length > 0) {
      var describeTaskParams = {
        cluster: CLUSTER_ARN,
        tasks: listTasks.taskArns
      };


      const describeTaskCommand = new DescribeTasksCommand(describeTaskParams);

      const describeTasks = await client.send(describeTaskCommand);
      console.log(describeTasks);
      var networkInterfaceId = describeTasks.tasks[0].attachments[0].details.find(x => x.name === "networkInterfaceId").value;

      console.log("found network interfaceid " + networkInterfaceId);

      var describeNetworkInterfacesParams = {
        NetworkInterfaceIds: [networkInterfaceId]
      };

      const describeNetworkInterfacesCommand = new DescribeNetworkInterfacesCommand(ListTasksParams);

      const networkInterfaces = await ec2Client.send(describeNetworkInterfacesCommand);
      console.log(networkInterfaces);
      var publicIp = networkInterfaces.NetworkInterfaces.find(x => x.Association != undefined).Association.PublicIp;
      console.log("found public IP " + publicIp);
      statusResults.running = true;
      statusResults.ip = publicIp + ":2456";
    }

  } catch (error) {
    console.log(error);
  }

  console.log(JSON.stringify(statusResults));


  return statusResults;
}

