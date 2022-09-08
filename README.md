<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

## Input parameters

### Credentials

| Key                     |   Type   | Required | Description                                                             |
| ----------------------- | :------: | :------: | ----------------------------------------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | `string` |   Yes    | Access Key ID                                                           |
| `AWS_SECRET_ACCESS_KEY` | `string` |   Yes    | Secret Access Key                                                       |
| `AWS_SESSION_TOKEN`     | `string` |    No    | Session Token                                                           |
| `REGION`                | `string` |    No    | Default `us-east-1`. Region where the Lambda function has been created. |

[AWS Security Credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) reference  
[AWS Temporary Credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html) reference

### Invocation

| Key                           |                     Type                     | Required | Description                                                                                                                                                                                                                                                                                      |
| ----------------------------- | :------------------------------------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `functnion_name`                |                   `string`                   |   Yes    | Name of the Lambda function to be invoked.            

## Output

| Key                     |   Type   | Description                                                             |
| ----------------------- | :------: | ----------------------------------------------------------------------- |
| `update_status`         | `string` | `UpdateStatus` response from the Lambda function invocation. Could be `Successful` or `Failed` after action completion |
| `is_successful`         | `bool`   | Whether or not the update was successful                                |

For more info about lambda function update see https://aws.amazon.com/blogs/compute/tracking-the-state-of-lambda-functions/
