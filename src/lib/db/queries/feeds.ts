import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";
import { createPost } from "./posts";
import { NewPost } from "../schema";
import { fetchFeed } from "../../rss";

export async function createFeed(
    feedName: string,
    url: string,
    userId: string,
) {
    const result = await db
        .insert(feeds)
        .values({
            name: feedName,
            url,
            userId,
        })
        .returning();

    return firstOrUndefined(result);
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function getFeedByURL(url: string) {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
    return firstOrUndefined(result);
}

export async function markFeedFetched(feedId: string) {
    const result = await db
        .update(feeds)
        .set({
            lastFetchedAt: new Date(),
        })
        .where(eq(feeds.id, feedId))
        .returning();
    return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
    const result = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
        .limit(1);
    return firstOrUndefined(result);
}


export async function scrapeFeeds() {
    let feed;
    try {
        feed = await getNextFeedToFetch();
    } catch (error) {
        console.error("Error fetching next feed to scrape:", error);
        return;
    }
    await markFeedFetched(feed.id);
    console.log(`Fetching feed: ${feed.url}`);
    let feedData;
    try {
        feedData = await fetchFeed(feed.url);
    } catch (error) {
        console.error(`Error fetching feed ${feed.url}:`, error);
        return;
    }
    if (!feedData) {
        console.log(`Failed to fetch feed ${feed.url}`);
        return;
    }
    for (const item of feedData.channel.item) {
        try {
            const post: NewPost = {
                feedId: feed.id,
                title: item.title,
                url: item.link,
                description: item.description,
                createdAt: new Date(),
                publishedAt: new Date(item.pubDate),
            };
            await createPost(post);
        } catch (error) {
            const cause = (error as any)?.cause?.message ?? "";
            if (!cause.includes("duplicate") && !cause.includes("unique")) {
                console.error(`Error creating post for item ${item.title}:`, error);
            }
        }
    }
}