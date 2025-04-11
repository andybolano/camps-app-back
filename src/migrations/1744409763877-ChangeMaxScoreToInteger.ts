import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeMaxScoreToInteger1744409763877 implements MigrationInterface {
    name = 'ChangeMaxScoreToInteger1744409763877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_based_event_item" DROP CONSTRAINT "FK_member_based_event_item_event"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_event_camp"`);
        await queryRunner.query(`ALTER TABLE "event_item" DROP CONSTRAINT "FK_event_item_event"`);
        await queryRunner.query(`ALTER TABLE "result_item" DROP CONSTRAINT "FK_result_item_result"`);
        await queryRunner.query(`ALTER TABLE "result_item" DROP CONSTRAINT "FK_result_item_event_item"`);
        await queryRunner.query(`ALTER TABLE "result_member_based_item" DROP CONSTRAINT "FK_result_member_based_item_result"`);
        await queryRunner.query(`ALTER TABLE "result_member_based_item" DROP CONSTRAINT "FK_result_member_based_item_event_item"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_result_club"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_result_event"`);
        await queryRunner.query(`ALTER TABLE "member_characteristic" DROP CONSTRAINT "FK_member_characteristic_club"`);
        await queryRunner.query(`ALTER TABLE "club" DROP CONSTRAINT "FK_club_camp"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_member_based_event_item_eventId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_event_campId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_event_item_eventId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_result_item_resultId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_result_item_eventItemId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_result_member_based_item_resultId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_result_member_based_item_eventItemId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_result_clubId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_result_eventId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_member_characteristic_clubId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_club_campId"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "maxScore"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "maxScore" integer NOT NULL DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE "camp" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "camp" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "member_based_event_item" ADD CONSTRAINT "FK_dd9c566079710f189a8e45d8abf" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_bedaa1485073ba2e03985817ae5" FOREIGN KEY ("campId") REFERENCES "camp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_item" ADD CONSTRAINT "FK_240303484dbe00aa45b2cf86a2b" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result_item" ADD CONSTRAINT "FK_3cd2c349b1fd39ab634baf46b32" FOREIGN KEY ("resultId") REFERENCES "result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result_item" ADD CONSTRAINT "FK_e5f8db752df4332895fce660feb" FOREIGN KEY ("eventItemId") REFERENCES "event_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result_member_based_item" ADD CONSTRAINT "FK_8c40bd6944e3a842508d28736d9" FOREIGN KEY ("resultId") REFERENCES "result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result_member_based_item" ADD CONSTRAINT "FK_e6785c9f122f0a4fcfa7ec33525" FOREIGN KEY ("eventItemId") REFERENCES "member_based_event_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_f9284363a46ec833bef81689cf9" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_48eba0868e22f0409a99fa703ca" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_characteristic" ADD CONSTRAINT "FK_618c31baa866fda0990cdf32456" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "club" ADD CONSTRAINT "FK_f8e0685abaa926846cf01fbeeb5" FOREIGN KEY ("campId") REFERENCES "camp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "club" DROP CONSTRAINT "FK_f8e0685abaa926846cf01fbeeb5"`);
        await queryRunner.query(`ALTER TABLE "member_characteristic" DROP CONSTRAINT "FK_618c31baa866fda0990cdf32456"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_48eba0868e22f0409a99fa703ca"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_f9284363a46ec833bef81689cf9"`);
        await queryRunner.query(`ALTER TABLE "result_member_based_item" DROP CONSTRAINT "FK_e6785c9f122f0a4fcfa7ec33525"`);
        await queryRunner.query(`ALTER TABLE "result_member_based_item" DROP CONSTRAINT "FK_8c40bd6944e3a842508d28736d9"`);
        await queryRunner.query(`ALTER TABLE "result_item" DROP CONSTRAINT "FK_e5f8db752df4332895fce660feb"`);
        await queryRunner.query(`ALTER TABLE "result_item" DROP CONSTRAINT "FK_3cd2c349b1fd39ab634baf46b32"`);
        await queryRunner.query(`ALTER TABLE "event_item" DROP CONSTRAINT "FK_240303484dbe00aa45b2cf86a2b"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_bedaa1485073ba2e03985817ae5"`);
        await queryRunner.query(`ALTER TABLE "member_based_event_item" DROP CONSTRAINT "FK_dd9c566079710f189a8e45d8abf"`);
        await queryRunner.query(`ALTER TABLE "camp" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "camp" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "maxScore"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "maxScore" numeric(10,2) NOT NULL DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "description" text`);
        await queryRunner.query(`CREATE INDEX "IDX_club_campId" ON "club" ("campId") `);
        await queryRunner.query(`CREATE INDEX "IDX_member_characteristic_clubId" ON "member_characteristic" ("clubId") `);
        await queryRunner.query(`CREATE INDEX "IDX_result_eventId" ON "result" ("eventId") `);
        await queryRunner.query(`CREATE INDEX "IDX_result_clubId" ON "result" ("clubId") `);
        await queryRunner.query(`CREATE INDEX "IDX_result_member_based_item_eventItemId" ON "result_member_based_item" ("eventItemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_result_member_based_item_resultId" ON "result_member_based_item" ("resultId") `);
        await queryRunner.query(`CREATE INDEX "IDX_result_item_eventItemId" ON "result_item" ("eventItemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_result_item_resultId" ON "result_item" ("resultId") `);
        await queryRunner.query(`CREATE INDEX "IDX_event_item_eventId" ON "event_item" ("eventId") `);
        await queryRunner.query(`CREATE INDEX "IDX_event_campId" ON "event" ("campId") `);
        await queryRunner.query(`CREATE INDEX "IDX_member_based_event_item_eventId" ON "member_based_event_item" ("eventId") `);
        await queryRunner.query(`ALTER TABLE "club" ADD CONSTRAINT "FK_club_camp" FOREIGN KEY ("campId") REFERENCES "camp"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_characteristic" ADD CONSTRAINT "FK_member_characteristic_club" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_result_event" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_result_club" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result_member_based_item" ADD CONSTRAINT "FK_result_member_based_item_event_item" FOREIGN KEY ("eventItemId") REFERENCES "member_based_event_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result_member_based_item" ADD CONSTRAINT "FK_result_member_based_item_result" FOREIGN KEY ("resultId") REFERENCES "result"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result_item" ADD CONSTRAINT "FK_result_item_event_item" FOREIGN KEY ("eventItemId") REFERENCES "event_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result_item" ADD CONSTRAINT "FK_result_item_result" FOREIGN KEY ("resultId") REFERENCES "result"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_item" ADD CONSTRAINT "FK_event_item_event" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_event_camp" FOREIGN KEY ("campId") REFERENCES "camp"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_based_event_item" ADD CONSTRAINT "FK_member_based_event_item_event" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
