import * as modules from '../../../modules';

import modulesPropsSchemas from '../../../modules/module-docs.json';

const modulesPropsSchemasKeys = Object.keys(modulesPropsSchemas);

const getPropsSchema = (moduleName) => {
  for (let i = modulesPropsSchemasKeys.length - 1; i >= 0; i--) {
    const moduleKey = modulesPropsSchemasKeys[i];

    if (moduleKey.indexOf(moduleName) !== -1) {
      return {
        path: moduleKey,
        propsSchema: modulesPropsSchemas[moduleKey],
      };
    }
  }

  return null;
};

const modulesWithPropsSchemaArray = Object.keys(modules).map((moduleName) => {
  const { propsSchema, path } = getPropsSchema(moduleName);

  const moduleWithPropsSchema = {
    path,
    propsSchema,
    type: modules[moduleName],
    name: moduleName,
  };

  return moduleWithPropsSchema;
});

const modulesWithPropsSchema = modulesWithPropsSchemaArray.reduce((
  acc,
  moduleWithPropsSchema,
) => {
  acc[moduleWithPropsSchema.name] = moduleWithPropsSchema;

  return acc;
}, {});

export {
  modulesWithPropsSchema as default,
  modulesWithPropsSchemaArray,
};
