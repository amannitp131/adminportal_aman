var AWS = require('aws-sdk')

const my_AWSAccessKeyId = process.env.ACCESS_KEY
const my_AWSSecretKey = process.env.SECRET_KEY
const aws_region = process.env.REGION
const userTable = process.env.FACULTY_TABLE

var dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: aws_region,
    accessKeyId: my_AWSAccessKeyId,
    secretAccessKey: my_AWSSecretKey,
})

export default dynamoDB
