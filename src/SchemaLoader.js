const path = require('path');

module.exports = (topSchemas)=>{
  const allSchemas = {};
  topSchemas.forEach(topSchema=>{
    const loadSchema = (title)=>{
      if(allSchemas[title]){
        return allSchemas[title];
      }
      const schema = JSON.parse(fs.readFileSync(path.join('..','schemas',`${title}.json`),'utf8'));
      if(schema.baseClass){
        baseSchema = loadSchema(schema.baseClass);
      }
      const schema = {...baseSchema};
      Object.keys(properties).forEach(propName=>{
        const prop = properties[propName];
        schema[propName] = ()=>typeParser(prop.type,prop.default);
      });
    }
    const typeParser = (type,defaultVal)=>{
      switch(type){
          case "string":
          case "integer":
          case "array":
          default:
            return defaultVal;
        }
    }
  });
}