import chalk from "chalk";
import { intro, outro, cancel, isCancel, confirm } from "@clack/prompts";
import { getStoredToken, clearStoredToken } from "../../../lib/token";
import { Command } from "commander";


export async function logOutAction(){
     intro(chalk.bold("🔐 Auth Cli Logout"))

     const token = await getStoredToken();

     if(!token){
        console.log(chalk.yellow('You are not logged in.'));
        process.exit(0);
     }

     const shouldLogout = await confirm({
        message:"Are you sure you want to log out?",
        initialValue:false
     })

     if(isCancel(shouldLogout) || !shouldLogout){
        cancel(" Logout cancelled. ");
        process.exit(0);
     }

     const cleared = await clearStoredToken();

     if(cleared){
        outro(chalk.green("✅ Successfully logged out!"));
     }else{
        console.log(chalk.yellow("⚠️ Could not clear stored token."));
     }
}

export const logout = new Command("logout")
.description("Logout from the CLI AI Agent")
.action(logOutAction)