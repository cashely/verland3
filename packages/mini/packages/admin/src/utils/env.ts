export function getEnvs() {
    const env = import.meta.env.ENV
    let envStr = ''
    if (env === 'development') {
      envStr = 'dev'
    }
    return envStr
  }