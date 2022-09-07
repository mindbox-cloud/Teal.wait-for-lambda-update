import * as core from '@actions/core'
import { getInput, setSecret, debug, setOutput, setFailed } from '@actions/core';
import {wait} from './wait'
import AWS from 'aws-sdk/global';
import Lambda from 'aws-sdk/clients/lambda'

enum ExtraOptions {
  HTTP_TIMEOUT = 'HTTP_TIMEOUT',
  MAX_RETRIES = 'MAX_RETRIES'
}

enum Credentials {
  AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
  AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY',
  AWS_SESSION_TOKEN = 'AWS_SESSION_TOKEN',
}

const functionNameInput = "function-name"


const setAWSCredentials = () => {
  const accessKeyId = getInput(Credentials.AWS_ACCESS_KEY_ID);
  setSecret(accessKeyId);

  const secretAccessKey = getInput(Credentials.AWS_SECRET_ACCESS_KEY);
  setSecret(secretAccessKey);

  const sessionToken = getInput(Credentials.AWS_SESSION_TOKEN);
  // Make sure we only mask if specified
  if (sessionToken) {
    setSecret(sessionToken);
  }

  AWS.config.credentials = {
    accessKeyId,
    secretAccessKey,
    sessionToken,
  };
};

enum Inputs {
  FunctionName = 'FunctionName',
  InvocationType = 'InvocationType',
  LogType = 'LogType',
  ClientContext = 'ClientContext',
}

const getInputs = () => {
  return Object.keys(Inputs).reduce((memo, prop) => {
    const value = getInput(prop);
    return value ? { ...memo, [prop]: value } : memo;
  }, {} as any);
}

const setAWSConfigOptions = () => {
  const httpTimeout = getInput(ExtraOptions.HTTP_TIMEOUT);

  if (httpTimeout) {
    AWS.config.httpOptions = { timeout: parseInt(httpTimeout, 10) };
  }

  const maxRetries = getInput(ExtraOptions.MAX_RETRIES);

  if (maxRetries) {
    AWS.config.maxRetries = parseInt(maxRetries, 10);
  }
};

const apiVersion = '2015-03-31';

async function run(): Promise<void> {
  try {
    setAWSCredentials();

    setAWSConfigOptions();

    const lambda = new Lambda({ apiVersion, region: getInput('REGION') });

    const params = {
      FunctionName : getInput(functionNameInput)
    };

    const response = lambda.waitFor('functionUpdatedV2', params, (error, data) => {
      if (error){
        core.setFailed(error.message + error.stack);
      }
      setOutput("update-status", data.Configuration?.LastUpdateStatus);
    })
    
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
