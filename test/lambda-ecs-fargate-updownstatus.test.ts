import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as LambdaEcsFargateUpdownstatus from '../lib/lambda-ecs-fargate-updownstatus-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LambdaEcsFargateUpdownstatus.LambdaEcsFargateUpdownstatusStack(app, 'MyTestStack', {
      region: "us-west-2",
      serviceArn: "", // arn:aws:ecs:us-west-2:XXXX:service/ValheimServerAwsCdkStack-fargateClusterXXXXX/ValheimServerAwsCdkStack-valheimServiceXXXX
      clusterArn: "", // arn:aws:ecs:us-west-2:XXXX:cluster/ValheimServerAwsCdkStack-fargateClusterXXXXXX
      startStopPassword: "changeme"
  });
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
