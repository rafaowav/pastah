CREATE TABLE "document_relations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_document_id" uuid NOT NULL,
	"target_document_id" uuid NOT NULL,
	"relation_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_id" uuid,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"href" text,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- Migração de status legados (inglês) para o novo enum operacional em português
UPDATE "documents" SET "status" = 'rascunho' WHERE "status" IN ('draft', '');
UPDATE "documents" SET "status" = 'enviado' WHERE "status" = 'sent';
UPDATE "documents" SET "status" = 'aprovado' WHERE "status" IN ('accepted', 'approved');
UPDATE "documents" SET "status" = 'recusado' WHERE "status" = 'rejected';
UPDATE "documents" SET "status" = 'finalizado' WHERE "status" IN ('final', 'published', 'done');
UPDATE "documents" SET "status" = 'arquivado' WHERE "status" = 'archived';
--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "status" SET DEFAULT 'rascunho';--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "total_amount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "received_amount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "payment_status" text DEFAULT 'pendente' NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "received_at" timestamp;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
-- Backfill: preenche total_amount dos documentos antigos a partir do JSONB `data`
UPDATE "documents" SET "total_amount" = (
  SELECT COALESCE(SUM(
    ROUND(
      COALESCE((item->>'quantity')::numeric, 1)
      * COALESCE((item->>'unitPrice')::numeric, 0)
      * (1 - COALESCE((item->>'discountPercent')::numeric, 0) / 100.0)
    ) * 100
  ), 0)
  FROM jsonb_array_elements(
    CASE
      WHEN jsonb_typeof("documents"."data"->'items') = 'array' THEN "documents"."data"->'items'
      ELSE '[]'::jsonb
    END
  ) AS item
) WHERE "documents"."data" ? 'items';
--> statement-breakpoint
UPDATE "documents" SET "total_amount" = ROUND(COALESCE(("data"->>'amount')::numeric, 0) * 100)
WHERE "documents"."data" ? 'amount' AND "documents"."type" = 'recibo' AND "total_amount" = 0;
--> statement-breakpoint
ALTER TABLE "document_relations" ADD CONSTRAINT "document_relations_source_document_id_documents_id_fk" FOREIGN KEY ("source_document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_relations" ADD CONSTRAINT "document_relations_target_document_id_documents_id_fk" FOREIGN KEY ("target_document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "document_relations_source_idx" ON "document_relations" USING btree ("source_document_id");--> statement-breakpoint
CREATE INDEX "document_relations_target_idx" ON "document_relations" USING btree ("target_document_id");--> statement-breakpoint
CREATE UNIQUE INDEX "document_relations_source_target_unique" ON "document_relations" USING btree ("source_document_id","target_document_id","relation_type");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_user_read_idx" ON "notifications" USING btree ("user_id","read_at");--> statement-breakpoint
CREATE INDEX "documents_payment_status_idx" ON "documents" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "documents_company_deleted_at_idx" ON "documents" USING btree ("company_id","deleted_at");--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "id";