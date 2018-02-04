const serverUrl = 'https://battle-sim.herokuapp.com';
const request = require('request');

const buildUrl = (...urlParts)=>urlParts.reduce((currentUrl,urlPart)=>`${currentUrl}/${urlPart}`,serverUrl);
const handleResponseWrapper = (fail=e=>console.log(e),success=()=>{},loading=()=>{})=>{
  loading(true);
  return (err,response,body)=>{
    handleResponse(err,response,body,fail,success);
    loading(false);
  }
}
const handleResponse = (err,response,body,fail,success) => {
  const successCodes = [200,201];
  let jsonBody = body;
  if(err){
    fail(err);
    return;
  }
  if(typeof body ==='string' && body.length){
    try{
      jsonBody = JSON.parse(body);
    }
    catch(e){
      fail(`Could not parse response body of ${body} because of ${e}`);
      return;
    }
  }
  if(response && !successCodes.includes(response.statusCode)){
    fail(jsonBody);
    return;
  }
  success(jsonBody);
};

const get = (route) => (id,{fail,success,loading})=> request.get(buildUrl(route,id),handleResponseWrapper(fail,success,loading));
const getAll = (route) => ({fail,success,loading})=> request.get(buildUrl(route),handleResponseWrapper(fail,success,loading));
const post = (route) => (body,{fail,success,loading})=> {
	console.log(body);
	return request.post({url:buildUrl(route),body:body,json:true},handleResponseWrapper(fail,success,loading));
};
const put = (route) =>(id,body,{fail,success,loading}) => request.put({url:buildUrl(route,id),body:body,json:true},handleResponseWrapper(fail,success,loading));
const del = (route) => (id,{fail,success,loading})=>request.delete(buildUrl(route,id),handleResponseWrapper(fail,success,loading));
const httpMethods = {get,getAll,post,put,del};

const endpoints = {
  player:{
    route:"players",
  },
  enemy:{
    route:"enemies"
  }
};

Object.keys(endpoints).forEach(endpoint=>Object.keys(httpMethods).forEach(httpMethodName=>endpoints[endpoint][httpMethodName]=httpMethods[httpMethodName](endpoints[endpoint].route)));

module.exports = endpoints; 