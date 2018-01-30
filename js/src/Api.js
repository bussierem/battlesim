const serverUrl = 'https://battle-sim.herokuapp.com';
const request = require('request');

const buildUrl = (urlParts)=>urlParts.reduce((currentUrl,urlPart)=>`${currentUrl}/${urlPart}`,serverUrl);
const handleResponseWrapper = (fail,success,loading)=>{
  loading(true);
  return (err,response,body)=>{
    handleResponse(err,response,body,fail,success);
    loading(false);
  }
}
const handleResponse = (err,response,body,fail,success) => {
  let jsonBody;
  if(err){
    fail(err);
    return;
  }
  try{
    jsonBody = JSON.parse(body);
  }
  catch(e){
    fail(`Could not parse response body ${e}`);
    return;
  }
  success(jsonBody);
};

const get = (route) => (id,{fail,success,loading})=> request.get(buildUrl(route,id),handleResponseWrapper(fail,success,loading));
const getAll = (route) => ({fail,success,loading})=> request.get(buildUrl(route),handleResponseWrapper(fail,success,loading));
const post = (route) => (body,{fail,success,loading})=> request.post({url:buildUrl(route),body},handleResponseWrapper(fail,success,loading));
const put = (route) =>(id,body,{fail,success,loading}) => request.put({url:buildUrl(route,id),body},handleResponseWrapper(fail,success,loading));
const del = (route) => (id,{fail,success,loading})=>request.delete(buildUrl(route,id),handleResponseWrapper(fail,success,loading));
const httpMethods = [get,getAll,post,put,del];

const endpoints = {
  player:{
    route:"players",
  },
  enemy:{
    route:"enemies"
  }
};

Object.keys(endpoints).forEach(endpoint=>httpMethods.forEach(httpMethod=>endpoints[endpoint][httpMethod]=httpMethod(endpoints[endpoint].route)));

module.exports = endpoints; 