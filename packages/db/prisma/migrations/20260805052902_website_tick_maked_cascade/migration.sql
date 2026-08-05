-- DropForeignKey
ALTER TABLE "Website_tick" DROP CONSTRAINT "Website_tick_website_id_fkey";

-- AddForeignKey
ALTER TABLE "Website_tick" ADD CONSTRAINT "Website_tick_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
