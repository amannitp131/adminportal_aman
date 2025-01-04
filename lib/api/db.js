import dynamoDB from './dbConfig'

export const insertDataintoDatabase = async (tableName, item) => {
    var params = {
        TableName: tableName,
        Item: item,
    }

    let putItem = new Promise((res, rej) => {
        dynamoDB.put(params, function (err, data) {
            if (err) {
                console.log('Error', err)
                rej(err)
            } else {
                console.log('Success!')
                res('Inserted data into Dynamodb!')
            }
        })
    })
    const result = await putItem
    // console.log(result);
    return result
}

export const fetchDatafromDatabase1 = async (params) => {
    // Scan method fetch data from dynamodb

    let queryExecute = new Promise((res, rej) => {
        dynamoDB.scan(params, function (err, data) {
            if (err) {
                console.log('Error', err)
                rej(err)
            } else {
                console.log('Success! Scan method fetch data from dynamodb')
                res(JSON.stringify(data, null, 2))
            }
        })
    })
    const result = await queryExecute
    // console.log(result);
    return result
}

export const fetchDatafromDatabase2 = async (params) => {
    // get method fetch data from dynamodb
    // var params = {
    //     TableName:empTable,
    //     Key:{
    //         "id": id
    //     }
    // };

    let queryExecute = new Promise((res, rej) => {
        dynamoDB.get(params, function (err, data) {
            if (err) {
                console.log('Error', err)
                rej(err)
            } else {
                console.log('Success! get method fetch data from dynamodb')
                res(JSON.stringify(data, null, 2))
            }
        })
    })
    const result = await queryExecute
    // console.log(result);
    return result
}

export const fetchDatafromDatabase3 = async (params) => {
    // query method fetch data from dynamodb
    // var id = "ANPL2032231213";
    // var Dept = "Sales";
    // var params = {
    //     TableName:empTable,
    //     KeyConditionExpression: '#id = :id',
    //     ExpressionAttributeNames: {
    //         "#id": "id",
    //         "#dept": "Dept"
    //     },
    //     ExpressionAttributeValues: {
    //         ':id': id,
    //         ':deptValue': Dept
    //     },
    //     FilterExpression: "#dept = :deptValue", //AttributeName with attributeValue
    //     Limit: 5,
    //     ScanIndexForward: false, // Set ScanIndexForward to false to display most recent entries first
    // };

    let queryExecute = new Promise((res, rej) => {
        dynamoDB.query(params, function (err, data) {
            if (err) {
                console.log('Error', err)
                rej(err)
            } else {
                console.log('Success! query method fetch data from dynamodb')
                res(JSON.stringify(data, null, 2))
            }
        })
    })
    const result = await queryExecute
    // console.log(result);
    return result
}

export const updateDatafromDatabase = async (params) => {
    // update method fetch data from dynamodb
    // var id = "ANPL2032231113";
    // var Dept = "ABC Engineer";
    // var params = {
    //     TableName:empTable,
    //     Key:{
    //         id: id
    //     },
    //     UpdateExpression: "set Dept = :r",
    //     ExpressionAttributeValues:{
    //         ":r": Dept
    //     },
    //     ReturnValues:"UPDATED_NEW"
    // };

    let queryExecute = new Promise((res, rej) => {
        dynamoDB.update(params, function (err, data) {
            if (err) {
                console.log('Error', err)
                rej(err)
            } else {
                console.log('Updated Successfully done for :' + params.Key.id)
                res(JSON.stringify(data, null, 2))
            }
        })
    })
    const result = await queryExecute
    // console.log(result);
    return result
}

export const deleteDatafromDatabase = async (params) => {
    // delete method fetch data from dynamodb
    // var id = "ANPLDELETE31113";
    // var params = {
    //     TableName:empTable,
    //     Key: {
    //         id: id
    //     },

    // };

    let queryExecute = new Promise((res, rej) => {
        dynamoDB.delete(params, function (err, data) {
            if (err) {
                console.log('Error', err)
                rej(err)
            } else {
                console.log('Deleted Successfully user :' + params.Key.id)
                res(JSON.stringify(data, null, 2))
            }
        })
    })
    const result = await queryExecute
    // console.log(result);
    // return result;
}
