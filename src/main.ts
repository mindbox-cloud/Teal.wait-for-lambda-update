import { getInput, setSecret, debug, setOutput, setFailed } from '@actions/core';
import AWS from 'aws-sdk/global';
import Lambda from 'aws-sdk/clients/lambda'

const enum AWSExtraOptions {
  HTTP_TIMEOUT = 'HTTP_TIMEOUT',
  MAX_RETRIES = 'MAX_RETRIES'
};

const enum AWSCredentials {
  AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
  AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY',
  AWS_SESSION_TOKEN = 'AWS_SESSION_TOKEN',
};

const enum outputs {
  updateStatus = "update_status",
  isSuccessful = "is_successful"
};

const functionNameInput = "function_name";


const setAWSCredentials = () : void => {
  const accessKeyId = getInput(AWSCredentials.AWS_ACCESS_KEY_ID);
  setSecret(accessKeyId);

  const secretAccessKey = getInput(AWSCredentials.AWS_SECRET_ACCESS_KEY);
  setSecret(secretAccessKey);

  const sessionToken = getInput(AWSCredentials.AWS_SESSION_TOKEN);
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

const setAWSConfigOptions = () : void => {
  const httpTimeout = getInput(AWSExtraOptions.HTTP_TIMEOUT);

  if (httpTimeout) {
    AWS.config.httpOptions = { timeout: parseInt(httpTimeout, 10) };
  }

  const maxRetries = getInput(AWSExtraOptions.MAX_RETRIES);

  if (maxRetries) {
    AWS.config.maxRetries = parseInt(maxRetries, 10);
  }
};

const apiVersion = '2015-03-31';

function run(): void {
  try {
    setAWSCredentials();

    setAWSConfigOptions();

    const lambda = new Lambda({ apiVersion, region: getInput('REGION') });

    const params = {
      FunctionName : getInput(functionNameInput)
    };

    lambda.waitFor('functionUpdatedV2', params, (error, data) => {
      if (error){
        setFailed(error.message);
      }
      debug(JSON.stringify(data));
      setOutput(outputs.updateStatus, data.Configuration?.LastUpdateStatus);
      setOutput(outputs.isSuccessful, data.Configuration?.LastUpdateStatus === 'Successful' ? true : false)
    });
    
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
};

run();
