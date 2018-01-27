const serverUrl = 'https://battle-sim.herokuapp.com';

module.exports = {
  getBattle: ()=>{
    return fetch(`${serverUrl}/battles`);
  }
}