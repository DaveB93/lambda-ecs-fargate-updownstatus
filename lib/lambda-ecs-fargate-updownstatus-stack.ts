import * as cdk from '@aws-cdk/core';
import { Arn, Stack } from '@aws-cdk/core';
import * as widget_service from '../lib/widget_service';

interface MultiStackProps extends cdk.StackProps {
  region: string;
  serviceArn: Arn;
  clusterArn: Arn;
  startStopPassword: string
}

export class LambdaEcsFargateUpdownstatusStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: MultiStackProps) {
    super(scope, id, props);

    new widget_service.WidgetService(this, 'Status', {
      region: props.region,
      serviceArn: props.serviceArn,
      clusterArn: props.clusterArn,
      startStopPassword: props.startStopPassword
    });
  }
}
