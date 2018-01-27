const serverUrl = 'www.xd.com'

module.exports = {
  getBattle: async ()=>{
    return fetch(`${serverUrl}/battles`)[0];
  }
}