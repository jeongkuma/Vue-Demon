describe('URL Parse', () => {
  const url = 'http://localhost:8090/ccp/online/iotlogout/processIotLogout'
  it('logout URL Parse', () => {
    let urlSplit = url.split('/')
    let lastResource = urlSplit[urlSplit.length - 1]
    expect(lastResource).toEqual('processIotLogout')
  })
})
