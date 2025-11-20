import * as fs from 'node:fs';
import { LinearConfig } from './api';

export async function loadConfig(path: string): Promise<LinearConfig> {
  return fs.promises.readFile(path).then( i=> JSON.parse(i.toString()) as LinearConfig)
}
