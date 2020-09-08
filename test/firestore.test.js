const {
  uploadFile,
  bucket,
} = require('../configs/firestore')
const {v1, v4} = require('uuid')
const path = require('path')

jest.mock('uuid')
jest.mock('path')

describe('firebase & google storage testing', () => {

  it('Should uploadFile success',async () => {
    let bucketTest = bucket
    let pathTest = path
    pathTest.join = jest.fn().mockImplementationOnce(() => 'test')
    const localFile = path.join()
    let file = {
      mimetype: 'type test',
    }
    const spy = jest.spyOn(global, 'encodeURIComponent').mockImplementationOnce(() => 'test')
    const data = [
      {name: 'test'}
    ]
    bucketTest.upload = jest.fn()
      .mockImplementation(localFile)
      .mockImplementation({
        destination: v1.mockImplementation(() => '1'),
        uploadType: jest.fn().mockReturnValue('test'),
        metadata: {
          contentType: jest.fn().mockReturnValue('test'),
          firebaseStorageDownloadTokens: v4.mockImplementation(() => '1')
        }
      })
      .mockResolvedValue(data)
    const result = await uploadFile(localFile, file)
    expect(pathTest.join).toBeCalledTimes(1)
    expect(pathTest.join).toHaveReturnedWith('test')
    expect(v1).toHaveReturnedWith('1')
    expect(v1).toBeCalledTimes(1)
    expect(v4).toHaveReturnedWith('1')
    expect(v4).toBeCalledTimes(1)
    expect(spy).toHaveReturnedWith('test')
    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(data[0].name)
    expect(bucketTest.upload).toBeCalledTimes(1)
    expect(bucketTest.upload).toBeCalledWith('test', {"destination": "1", "metadata": {"contentType": "type test", "firebaseStorageDownloadTokens": "1"}, "uploadType": "media"})
    expect(result.result_url).toEqual('https://firebasestorage.googleapis.com/v0/b/express-movielist.appspot.com/o/test?alt=media&token=1')
    expect(result.uuid).toEqual('1')
  })
})
