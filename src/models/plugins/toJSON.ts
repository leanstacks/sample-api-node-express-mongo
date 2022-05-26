const toJSON = (schema: any): void => {
  const currentOptions = schema.options.toJSON || {};

  schema.options.toJSON = Object.assign(currentOptions, {
    transform: (doc: any, ret: any, options: any) => {
      // remove any schema attributes marked private
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options.private) {
          delete ret[path];
        }
      });

      // change _id to id
      ret.id = ret._id;
      delete ret._id;

      return ret;
    },
    versionKey: false,
  });
};

export default toJSON;
