import {cancel, confirm, intro, isCancel, outro} from "@clack/prompts";
import {logger} from "better-auth";
import {createAuthClient} from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";

import chalk from "chalk";
import { Command } from "commander";
import fs from "node:fs/promises"
import open from "open";
import os from "os";
import path from "path";
import yoctoSpinner from "yocto-spinner";
import * as z from "zod/v4";
import dotenv from "dotenv";
import prisma from "../../../lib/Ds.js"

dotenv.config();

const URL = "http://localhost:3005"
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CONFIG_DIR = path.join(os.homedir(), ".cli-ai-agent");
const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

export async function loginAction(opts){
   const options = z.object({
      serverURL: z.string().optional(),
      clientId: z.string().optional()
   })

   const serverURL = options.serverURL || URL;
   const clientId = options.clientId || CLIENT_ID;

   intro(chalk.bold("🔐Auth Cli Login"))

   //TODO: CHANGE THIS TO CHECK DB
   const exisitingToken = false;
   const expired = false;

    if(exisitingToken && !expired){
        const shouldReAuth = await confirm({
            message:" You are already logged in. Do you want to re-authenticate? ",
            initialValue:false
        })

        if(isCancel(shouldReAuth) || !shouldReAuth){
            cancel(" Login cancelled. ");
            process.exit(0);
        }
    }

    const authClient = createAuthClient({
        baseURL: serverURL,
        plugins:[deviceAuthorizationClient()]
    })

    const spinner = yoctoSpinner({text: "Requesting device authorization..."})
    .start("Starting login process...");

    try {
        const {data, error} = await authClient.device.code({
            client_id: clientId,
            scope: "openid profile email"
        })

        spinner.stop("Device authorization received.");
        if(error){
            logger.error("Failed to request device authorization:", error);
            process.exit(1);
        }

        const {
            device_code,
            user_code,
            verification_uri,
            verification_uri_complete,
            interval = 5,
            expires_in
        } = data;

        console.log(chalk.cyan("Device Authorization required"))
        console.log(`please visit: ${chalk.underline.blue(verification_uri || verification_uri_complete)}`);

        console.log(`Enter Code: ${chalk.bold.green(user_code)}`)

        const shouldOpen = await confirm({
            message:"Open browser automatically",
            initialValue:true
        })

        if(!isCancel(shouldOpen) && shouldOpen){
            const urlToOpen = verification_uri || verification_uri_complete;
            await open(urlToOpen);
        }

        console.log(
            chalk.gray(
                `Waiting for authorization (expires in ${Math.floor(
                    expires_in / 60
                )} minutes)...`
            )
        )
    } catch (error) {
        spinner.stop("Failed to receive device authorization.");
        console.log(chalk.red("Error during device authorization:"), error);
        process.exit(1);
    }

    
    outro(chalk.green("Login flow started!"));
}


// Command setup

export const login = new Command("login")
  .description("Login to the CLI AI Agent")
  .option("-s, --server-url <url>", "Authentication server URL", URL)
  .option("-c, --client-id <id>", "OAuth Client ID", CLIENT_ID)
  .action(loginAction)