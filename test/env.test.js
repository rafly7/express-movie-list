describe('.Env', () => {
  it('Should have APP_NAME', () => {
    expect(process.env.APP_NAME).toBeDefined()
  })
  it('Should have APP_PORT', () => {
    expect(process.env.APP_PORT).toBeDefined()
  })
  it('Should have HOST_LISTEN', () => {
    expect(process.env.HOST_LISTEN).toBeDefined()
  })
  it('Should have DB_NAME', () => {
    expect(process.env.DB_NAME).toBeDefined()
  })
  it('Should have DB_HOST', () => {
    expect(process.env.DB_HOST).toBeDefined()
  })
  it('Should have DB_PASS', () => {
    expect(process.env.DB_PASS).toBeDefined()
  })
  it('Should have DB_USER', () => {
    expect(process.env.DB_USER).toBeDefined()
  })
  it('Should have DB_PORT', () => {
    expect(process.env.DB_PORT).toBeDefined()
  })
  it('Should have DB_TYPE', () => {
    expect(process.env.DB_TYPE).toBeDefined()
  })
  it('Should have lOG_PATH', () => {
    expect(process.env.LOG_PATH).toBeDefined()
  })
  it('Should have LOG_LEVEL', () => {
    expect(process.env.LOG_LEVEL).toBeDefined()
  })
  it('Should have REDIS_PORT', () => {
    expect(process.env.REDIS_PORT).toBeDefined()
  })
  it('Should have REDIS_HOST', () => {
    expect(process.env.REDIS_HOST).toBeDefined()
  })
  it('Should have app port', () => {
    expect(process.env.APP_PORT).toBeDefined()
  })
  it('Should have app port', () => {
    expect(process.env.APP_PORT).toBeDefined()
  })
})
