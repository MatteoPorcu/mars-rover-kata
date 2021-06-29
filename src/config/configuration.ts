import * as yaml from 'js-yaml';
import { join } from 'path';
import * as fs from 'fs';

const ENVIRONMENT = process.env.NODE_ENV || 'develop';
const YAML_CONFIG_FILENAME = `${ENVIRONMENT}.yaml`;

const getConf = () => {
  try {
    const dt = yaml.load(
      fs.readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
    ) as Record<string, any>;
    return dt;
  } catch (error) {
    console.log(error);
  }
};

export default getConf;

export const getConfiguration = (...keys: string[]) => {
  return () => {
    const config: Record<string, any> = getConf();
    const resObj = {};
    if (config) {
      for (const key of keys) {
        if (config[key]) {
          resObj[key] = config[key];
          continue;
        }
        throw Error(`no configuration found for ${key}`);
      }
      if (resObj && Object.values(resObj).length > 0) {
        return resObj;
      }
    }
    throw Error(`no configuration found`);
  };
};
