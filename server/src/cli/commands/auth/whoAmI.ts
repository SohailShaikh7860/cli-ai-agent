import { requireAuth } from "../../../lib/token.js";
import prisma from "../../../lib/Ds.js";
import chalk from "chalk";
import { Command } from "commander";

const URL = "http://localhost:3005"

export async function whoamiAction(opts:any){
    const token = await requireAuth();

    if(!token){
        console.log("No access token found. Please log in.");
        process.exit(1);
    }

    const user: any = await prisma.user.findFirst({
        where:{
            sessions:{
                some:{
                    token: token.access_token
                },
            },
        },
        select:{
            id:true,
            name:true,
            email:true,
            image:true
        }
    });

    console.log(
        chalk.bold.greenBright(`\n👤 User: ${user?.name}\n
📧 Email:${user.email}
🪪 ID:${user.id}
        `
        )
    )
}

export const whoami = new Command("whoami")
.description("Display the currently authenticated user")
.option("--server-url <url>", "The Better Auth server URL", URL)
.action(whoamiAction)