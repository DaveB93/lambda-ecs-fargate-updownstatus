#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaEcsFargateUpdownstatusStack } from '../lib/lambda-ecs-fargate-updownstatus-stack';

const app = new cdk.App();
new LambdaEcsFargateUpdownstatusStack(app, 'LambdaEcsFargateUpdownstatusStack', {
    serviceArn: "", // arn:aws:ecs:us-west-2:XXXX:service/ValheimServerAwsCdkStack-fargateClusterXXXXX/ValheimServerAwsCdkStack-valheimServiceXXXX
    clusterArn: "", // arn:aws:ecs:us-west-2:XXXX:cluster/ValheimServerAwsCdkStack-fargateClusterXXXXXX
    startStopPassword: "changeme",
});
