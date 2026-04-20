import { deleteUsers } from "../lib/db/queries/users";

export async function handlerReset(_: string) {
    await deleteUsers();
    console.log("Database reset successfully!");
}
