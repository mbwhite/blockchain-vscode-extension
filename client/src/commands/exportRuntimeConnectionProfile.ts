/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { UserInputUtil, IBlockchainQuickPickItem } from './UserInputUtil';
import { RuntimeTreeItem } from '../explorer/model/RuntimeTreeItem';
import { VSCodeOutputAdapter } from '../logging/VSCodeOutputAdapter';
import { FabricRuntime } from '../fabric/FabricRuntime';

export async function exportRuntimeConnectionProfile(runtimeTreeItem?: RuntimeTreeItem): Promise<void> {

  let runtime: FabricRuntime;
  if (!runtimeTreeItem) {
        const chosenRuntime: IBlockchainQuickPickItem<FabricRuntime> = await UserInputUtil.showRuntimeQuickPickBox('Select the Fabric runtime to export the profile for');
        if (!chosenRuntime) {
            return;
        }

        runtime = chosenRuntime.data;
    } else {
        runtime = runtimeTreeItem.getRuntime();
    }

  const folderPath: string = await UserInputUtil.folderOrBrowse('Enter a file path to the connection profile json file');
  if (!folderPath) {
        return Promise.resolve();
    }
  console.log(folderPath);
  const folderName: string = path.basename(folderPath);
  const connectionProfilePath: string = path.join(folderPath, `${runtime.getName()}-connection.json`);

  const cp = await runtime.getConnectionProfile();
  fs.writeFileSync(connectionProfilePath, JSON.stringify(cp));

  vscode.window.showInformationMessage(`Successfully written profile to ${connectionProfilePath}`);
}
